# 🚀 Production Deployment Guide - Render

## Overview

This guide covers deploying the ATRIX e-commerce platform to Render with:
- **Backend + Customer Site**: https://atrixstore.tech
- **Admin Dashboard**: https://admin.atrixstore.tech

---

## Architecture in Production

```
┌─────────────────────────────────────────────────────────────────┐
│                    Production Architecture                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────┐         ┌──────────────────────┐     │
│  │   Admin Dashboard    │         │  Backend + Customer  │     │
│  │   (Static Site)      │────────>│    (Web Service)     │     │
│  │ admin.atrixstore.tech│   API   │   atrixstore.tech    │     │
│  │   Port: 443 (HTTPS)  │ Calls   │   Port: 443 (HTTPS)  │     │
│  └──────────────────────┘         └──────────┬───────────┘     │
│                                               │                  │
│                                    ┌──────────▼───────────┐     │
│                                    │  Neon PostgreSQL     │     │
│                                    │  (Cloud Database)    │     │
│                                    └──────────────────────┘     │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Cross-Domain Cookie Flow
- Admin dashboard at `admin.atrixstore.tech` makes API calls to `atrixstore.tech`
- Cookies are set with `domain: .atrixstore.tech` (note the leading dot)
- This allows `adminToken` and `token` cookies to be shared across subdomains
- `sameSite: 'none'` + `secure: true` enables cross-site cookie transmission over HTTPS

---

## Deployment Steps

### 1️⃣ Backend + Customer Site (Render Web Service)

**Service Configuration:**
- **Name**: atrix-backend (or your choice)
- **Root Directory**: `backend`
- **Build Command**: `npm install && npx sequelize-cli db:migrate && npx sequelize-cli db:seed:all`
- **Start Command**: `npm start` (or `node src/server.js`)
- **Custom Domain**: `atrixstore.tech` and `www.atrixstore.tech`

**Environment Variables:**
```env
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://user:pass@host.neon.tech/dbname?sslmode=require
JWT_SECRET=<your-secure-random-string>
JWT_EXPIRES_IN=7d
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

**Notes:**
- Render automatically provides `PORT`, but backend defaults to 3000 if not set
- `DATABASE_URL` should come from your Neon dashboard
- Generate `JWT_SECRET` with: `openssl rand -base64 32`
- Server already has `app.set('trust proxy', 1)` for Render's proxy

---

### 2️⃣ Admin Dashboard (Render Static Site)

**Service Configuration:**
- **Name**: atrix-admin (or your choice)
- **Root Directory**: `admin`
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `dist`
- **Custom Domain**: `admin.atrixstore.tech`

**Environment Variables:**
```env
VITE_API_BASE_URL=https://atrixstore.tech
```

**Important:** This variable is used at **build time**, so rebuilding is required if changed.

---

## Code Changes Summary

### ✅ Files Modified

#### 1. [admin/src/api/axios.js](admin/src/api/axios.js)
**Before:**
```javascript
const API_URL = import.meta.env.VITE_API_URL || '/api';
```

**After:**
```javascript
const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
```

**Why:** 
- Changed variable name to `VITE_API_BASE_URL` for clarity
- Default to full localhost URL instead of relative `/api` (which would fail in production)
- `withCredentials: true` already present (enables cookie transmission)

---

#### 2. [backend/src/config/jwt.js](backend/src/config/jwt.js)

**Important Change: Differentiated Cookie Options**

The application now uses **separate cookie configurations** for admin and customer authentication:

**Admin Cookies (Cross-Subdomain):**
```javascript
ADMIN_COOKIE_OPTIONS: {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
  // Production: set domain for cross-subdomain cookies
  ...(process.env.NODE_ENV === 'production' && {
    domain: '.atrixstore.tech',
    path: '/'
  })
}
```

**Customer Cookies (Same-Origin):**
```javascript
CUSTOMER_COOKIE_OPTIONS: {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax', // More secure - same-origin doesn't need 'none'
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: '/'
  // No domain attribute - browser auto-scopes to current domain
}
```

**Why Differentiate?**

| Aspect | Admin (`adminToken`) | Customer (`token`) |
|--------|---------------------|-------------------|
| **Flow** | admin.atrixstore.tech → atrixstore.tech API | atrixstore.tech → atrixstore.tech API |
| **sameSite** | `none` (required for cross-subdomain) | `lax` (more secure for same-origin) |
| **domain** | `.atrixstore.tech` (share across subdomains) | (not set - current domain only) |
| **Security** | Lower (cross-site required) | Higher (same-site protection) |
| **CSRF Risk** | Higher with `sameSite: 'none'` | Lower with `sameSite: 'lax'` |

**Benefits:**
- ✅ Admin gets necessary cross-subdomain access
- ✅ Customer gets stronger CSRF protection with `sameSite: 'lax'`
- ✅ Follows principle of least privilege
- ✅ Both maintain XSS protection via `httpOnly: true`

---

#### 3. [backend/src/server.js](backend/src/server.js)
**CORS Update:**
```javascript
const allowedOrigins = [
  'https://admin.atrixstore.tech',
  'https://atrixstore.tech',
  'http://localhost:5174', // dev
  'http://localhost:3000',
  // ... other localhost variants
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
```

**Health Endpoints Added:**
```javascript
// Root health check
app.get('/health', (req, res) => {
  res.json({
    ok: true,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API health check
app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});
```

**Why:**
- Explicitly allow production domains for CORS
- `credentials: true` enables cookie sharing
- Health endpoints for Render's health checks and monitoring

---

#### 4. [backend/src/controllers/adminController.js](backend/src/controllers/adminController.js)

**Updated to use `ADMIN_COOKIE_OPTIONS`:**

```javascript
// Import
const { ADMIN_COOKIE_OPTIONS } = require('../config/jwt');

// Login
res.cookie('adminToken', token, ADMIN_COOKIE_OPTIONS);

// Logout
res.clearCookie('adminToken', ADMIN_COOKIE_OPTIONS);
```

**Why:** Uses cross-subdomain cookie configuration for admin authentication.

---

#### 5. [backend/src/controllers/authController.js](backend/src/controllers/authController.js)

**Updated to use `CUSTOMER_COOKIE_OPTIONS`:**

```javascript
// Import
const { CUSTOMER_COOKIE_OPTIONS } = require('../config/jwt');

// Register
res.cookie('token', token, CUSTOMER_COOKIE_OPTIONS);

// Login
res.cookie('token', token, CUSTOMER_COOKIE_OPTIONS);

// Logout
res.clearCookie('token', CUSTOMER_COOKIE_OPTIONS);
```

**Why:** 
- Uses same-origin cookie configuration for customer authentication
- `clearCookie` must use the **exact same options** as when cookie was set
- More secure with `sameSite: 'lax'` instead of 'none'

---

#### 6. [backend/src/config/database.js](backend/src/config/database.js)
    success: true,
    message: 'Logout successful'
  });
});
```

---

#### 6. [backend/src/config/database.js](backend/src/config/database.js)
**No changes needed!** Already configured correctly:
```javascript
if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  });
}
```

✅ SSL is enabled for Neon
✅ Uses `DATABASE_URL` from environment
✅ Connection pooling configured

---

#### 7. [backend/src/views/**/*.ejs](backend/src/views) - Customer Site

**Verification Complete:**
- ✅ No hardcoded localhost URLs found
- ✅ All API calls use relative paths (`/api/...`)
- ✅ No changes needed - already production-ready

**Sample from templates:**
```javascript
// All API calls are relative - works in any environment
fetch('/api/auth/login', { ... })
fetch('/api/cart', { credentials: 'include' })
fetch('/api/products', { ... })
```

---

## Verification Checklist

### Before Deployment
- [ ] All code changes committed to Git
- [ ] `.env` files NOT committed (in `.gitignore`)
- [ ] Database migrations exist and tested locally

### After Backend Deployment
- [ ] Visit `https://atrixstore.tech/health` → should return `{ ok: true, uptime: ... }`
- [ ] Visit `https://atrixstore.tech/api/health` → should return `{ ok: true, uptime: ... }`
- [ ] Visit `https://atrixstore.tech` → customer homepage loads
- [ ] Check Render logs for database connection success message
- [ ] Test customer login at `https://atrixstore.tech/login`

### After Admin Deployment
- [ ] Visit `https://admin.atrixstore.tech` → admin login page loads
- [ ] Open browser DevTools → Network tab
- [ ] Login with admin credentials
- [ ] Verify API calls go to `https://atrixstore.tech/api/...` (not `admin.atrixstore.tech/api`)
- [ ] Check Application → Cookies → see `adminToken` cookie with:
  - Domain: `.atrixstore.tech`
  - Secure: ✓
  - HttpOnly: ✓
  - SameSite: None
- [ ] Navigate to Products, Categories, Orders pages
- [ ] Logout and verify `adminToken` cookie is removed

### Cross-Domain Cookie Test
1. Login to admin dashboard at `https://admin.atrixstore.tech`
2. Open DevTools → Application → Cookies
3. Verify `adminToken` exists with domain `.atrixstore.tech`
4. Make any API call (view products, etc.)
5. Check Network tab → verify request includes `Cookie: adminToken=...`
6. If cookies aren't sent:
   - Check CORS allows `https://admin.atrixstore.tech`
   - Check `withCredentials: true` in axios
   - Check cookie has `secure: true` and `sameSite: 'none'`

---

## Troubleshooting

### Issue: "CORS policy: No 'Access-Control-Allow-Origin' header"
**Solution:**
- Verify backend `CORS` includes `https://admin.atrixstore.tech`
- Check Network tab → verify `Origin` header matches allowed origins
- Ensure `credentials: true` in CORS config

### Issue: Cookies not sent with API requests
**Solution:**
- Verify `withCredentials: true` in axios config
- Check cookie has `sameSite: 'none'` and `secure: true` in production
- Verify domain is `.atrixstore.tech` (with leading dot)
- Ensure both sites use HTTPS (not HTTP)

### Issue: "Cookie not cleared on logout"
**Solution:**
- `clearCookie` options must match `cookie` options exactly
- Check: `domain`, `path`, `sameSite`, `secure` all match
- Common mistake: setting cookie with domain but clearing without domain

### Issue: "Database connection failed"
**Solution:**
- Verify `DATABASE_URL` is set in Render environment variables
- Check Neon instance is active (Neon has auto-pause after inactivity)
- Ensure URL includes `?sslmode=require`
- Check IP allowlist in Neon (Render's IPs should be allowed, or set to allow all)

### Issue: "Cannot read properties of undefined (reading 'id')"
**Solution:**
- JWT token invalid or expired
- Check `JWT_SECRET` matches between environments
- Verify auth middleware is checking correct cookie name (`adminToken` vs `token`)

### Issue: Admin build succeeds but shows blank page
**Solution:**
- Check browser console for errors
- Verify `VITE_API_BASE_URL` is set correctly
- Rebuild admin with correct environment variable
- Check network requests are going to correct domain

---

## Environment-Specific Behavior

### Development (`NODE_ENV=development`)
- CORS: allows all localhost variants
- Cookies: `sameSite: 'lax'`, `secure: false`, no domain
- Admin API: `http://localhost:3000`
- Database: can use local PostgreSQL or Neon

### Production (`NODE_ENV=production`)
- CORS: only allows specific production domains
- Cookies: `sameSite: 'none'`, `secure: true`, `domain: '.atrixstore.tech'`
- Admin API: `https://atrixstore.tech`
- Database: Neon with SSL

---

## Post-Deployment Tasks

1. **Test all user flows:**
   - Customer registration/login
   - Browse products, add to cart
   - Checkout with Stripe test card
   - View orders
   - Leave review (after order delivery)

2. **Test admin flows:**
   - Admin login
   - Create/edit/delete products
   - Manage categories
   - Update order status
   - Moderate reviews

3. **Monitor Render logs:**
   - Watch for errors or warnings
   - Check database query performance
   - Monitor memory/CPU usage

4. **Set up Stripe webhooks:**
   - Add webhook endpoint: `https://atrixstore.tech/api/orders/webhook`
   - Select events: `checkout.session.completed`
   - Get webhook secret and add to `STRIPE_WEBHOOK_SECRET`

5. **Configure custom domains:**
   - Add DNS records:
     - `atrixstore.tech` → CNAME to Render backend
     - `admin.atrixstore.tech` → CNAME to Render static site
   - Wait for SSL certificates to provision (automatic)

---

## Security Checklist

- [x] `httpOnly: true` on all auth cookies (prevents XSS access)
- [x] `secure: true` in production (HTTPS only)
- [x] `sameSite: 'none'` for cross-domain (with secure)
- [x] CORS explicitly lists allowed origins (no wildcards)
- [x] `JWT_SECRET` is strong and secret (not in Git)
- [x] Database uses SSL (Neon requires it)
- [x] Rate limiting enabled (`middleware/rateLimit.js`)
- [x] SQL injection protection (Sequelize ORM)
- [x] Password hashing (bcrypt in User/Admin models)

---

## Rollback Plan

If deployment fails:
1. Render keeps previous successful deployment
2. Use "Manual Deploy" → select previous commit
3. Or revert Git commit and redeploy
4. Database migrations can be rolled back with Sequelize

---

## Performance Optimization

After deployment, consider:
- Enable Render's CDN for static assets
- Add Redis for session storage (reduce DB load)
- Implement image CDN (Cloudinary, etc.)
- Add database indexes for frequently queried fields
- Enable gzip compression (Express already has it)

---

## Monitoring & Maintenance

**Recommended tools:**
- **Render Metrics**: CPU, memory, response time (built-in)
- **Neon Dashboard**: Database size, query performance
- **Sentry**: Error tracking (optional)
- **LogTail**: Centralized logging (optional)

**Regular tasks:**
- Review error logs weekly
- Monitor Neon database size (free tier limits)
- Update dependencies monthly (`npm audit`)
- Backup database (Neon has automatic backups)

---

## Support & Resources

- **Render Docs**: https://render.com/docs
- **Neon Docs**: https://neon.tech/docs
- **Sequelize Docs**: https://sequelize.org/docs
- **Vite Docs**: https://vitejs.dev/guide/

---

*Last Updated: January 2026*
