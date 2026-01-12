# 🚀 Quick Deployment Summary

## Changes Made for Production

### Admin Dashboard Changes
**File**: [admin/src/api/axios.js](admin/src/api/axios.js)
- Changed `VITE_API_URL` → `VITE_API_BASE_URL`
- Default changed from `/api` → `http://localhost:3000`
- ✅ `withCredentials: true` already present

### Backend Changes

#### 1. Cookie Configuration (Differentiated for Admin vs Customer)
**File**: [backend/src/config/jwt.js](backend/src/config/jwt.js)

**Admin Cookies (Cross-Subdomain)**:
- `ADMIN_COOKIE_OPTIONS` for `adminToken`
- Production: `domain: '.atrixstore.tech'`, `sameSite: 'none'`, `secure: true`
- Required for admin.atrixstore.tech → atrixstore.tech API calls

**Customer Cookies (Same-Origin)**:
- `CUSTOMER_COOKIE_OPTIONS` for `token`
- `sameSite: 'lax'` (no cross-domain needed)
- More secure since same-origin (atrixstore.tech → atrixstore.tech)

#### 2. Controller Updates
**Files**: 
- [backend/src/controllers/adminController.js](backend/src/controllers/adminController.js) - Uses `ADMIN_COOKIE_OPTIONS`
- [backend/src/controllers/authController.js](backend/src/controllers/authController.js) - Uses `CUSTOMER_COOKIE_OPTIONS`

Both login/logout flows use appropriate cookie options for their use case.

#### 3. CORS Configuration
**File**: [backend/src/server.js](backend/src/server.js)
- Explicitly allows `https://admin.atrixstore.tech` and `https://atrixstore.tech`
- Maintains `credentials: true`
- Already has `app.set('trust proxy', 1)`

#### 4. Logout Functions
**Files**: 
- [backend/src/controllers/adminController.js](backend/src/controllers/adminController.js)
- [backend/src/controllers/authController.js](backend/src/controllers/authController.js)

- Updated `clearCookie()` to use respective cookie options configurations

#### 5. Health Endpoints
**File**: [backend/src/server.js](backend/src/server.js)
- Added `GET /health` → `{ ok: true, uptime: ... }`
- Added `GET /api/health`

#### 6. Database Config
**File**: [backend/src/config/database.js](backend/src/config/database.js)
- ✅ No changes needed - already configured correctly with SSL

#### 7. Customer Site (EJS Templates)
**Files**: [backend/src/views/**/*.ejs](backend/src/views)
- ✅ No hardcoded localhost URLs found
- ✅ All API calls use relative paths (`/api/...`)
- ✅ Ready for production deployment

---

## Required Environment Variables

### Backend (Render Web Service)
```env
NODE_ENV=production
DATABASE_URL=postgresql://...?sslmode=require
JWT_SECRET=<generated-with-openssl>
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Admin (Render Static Site)
```env
VITE_API_BASE_URL=https://atrixstore.tech
```

---

## Render Deployment Config

### Backend + Customer Site
- **Type**: Web Service
- **Root**: `backend`
- **Build**: `npm install && npx sequelize-cli db:migrate && npx sequelize-cli db:seed:all`
- **Start**: `npm start`
- **Domain**: `atrixstore.tech`

### Admin Dashboard  
- **Type**: Static Site
- **Root**: `admin`
- **Build**: `npm install && npm run build`
- **Publish**: `dist`
- **Domain**: `admin.atrixstore.tech`

---

## Quick Verification

1. Backend health: https://atrixstore.tech/health
2. API health: https://atrixstore.tech/api/health
3. Customer site: https://atrixstore.tech
4. Admin login: https://admin.atrixstore.tech
5. Check DevTools → Network → verify API calls go to `atrixstore.tech`
6. Check DevTools → Application → Cookies → verify `domain: .atrixstore.tech`

---

## What Makes Cross-Domain Cookies Work

### Admin (Cross-Subdomain)
1. ✅ `withCredentials: true` in axios (admin side)
2. ✅ `credentials: true` in CORS (backend)
3. ✅ `domain: '.atrixstore.tech'` in cookie options (backend)
4. ✅ `sameSite: 'none'` + `secure: true` (backend, production only)
5. ✅ HTTPS on both domains (Render provides automatically)

### Customer (Same-Origin)
1. ✅ Same domain (atrixstore.tech → atrixstore.tech)
2. ✅ `sameSite: 'lax'` - more secure than 'none'
3. ✅ `secure: true` in production (HTTPS only)
4. ✅ No `domain` attribute needed (browser auto-scopes to current domain)
5. ✅ Better security posture since no cross-site requirements

### Cookie Comparison Table

| Feature | Admin Cookie | Customer Cookie |
|---------|-------------|----------------|
| **Name** | `adminToken` | `token` |
| **Use Case** | Cross-subdomain | Same-origin |
| **sameSite (prod)** | `none` | `lax` |
| **domain (prod)** | `.atrixstore.tech` | (not set) |
| **secure** | `true` (prod) | `true` (prod) |
| **httpOnly** | `true` | `true` |
| **CSRF Risk** | Higher (none) | Lower (lax) |
| **XSS Protection** | ✅ httpOnly | ✅ httpOnly |

---

For detailed information, see [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md).
