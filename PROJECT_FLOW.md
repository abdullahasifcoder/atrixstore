# ATRIX E-Commerce Platform - Project Flow Documentation

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Backend Structure](#backend-structure)
3. [Frontend Structure](#frontend-structure)
4. [Database Schema](#database-schema)
5. [Authentication Flow](#authentication-flow)
6. [API Routes](#api-routes)
7. [Key Features](#key-features)
8. [Development Guide](#development-guide)

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         ATRIX Platform                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐       │
│  │   Customer   │    │    Admin     │    │   Backend    │       │
│  │   Frontend   │    │   Dashboard  │    │    API       │       │
│  │   (EJS)      │    │   (React)    │    │  (Express)   │       │
│  │   Port:3000  │    │   Port:5174  │    │   Port:3000  │       │
│  └──────┬───────┘    └──────┬───────┘    └──────┬───────┘       │
│         │                   │                    │                │
│         └───────────────────┼────────────────────┘                │
│                             │                                     │
│                    ┌────────┴────────┐                           │
│                    │   PostgreSQL    │                           │
│                    │   (Neon Cloud)  │                           │
│                    └─────────────────┘                           │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Tech Stack
- **Backend**: Node.js + Express.js
- **Database**: PostgreSQL (Neon Cloud)
- **ORM**: Sequelize
- **Customer Frontend**: EJS Templates + Bootstrap 5
- **Admin Dashboard**: React + Vite + Tailwind CSS
- **Payment**: Stripe Integration
- **Authentication**: JWT (httpOnly cookies)

---

## Backend Structure

```
backend/
├── src/
│   ├── server.js              # Main entry point
│   ├── config/
│   │   ├── database.js        # Sequelize DB connection
│   │   ├── jwt.js             # JWT configuration
│   │   └── stripe.js          # Stripe configuration
│   ├── controllers/
│   │   ├── adminController.js     # Admin auth & dashboard stats
│   │   ├── authController.js      # Customer authentication
│   │   ├── cartController.js      # Shopping cart operations
│   │   ├── categoryController.js  # Category CRUD
│   │   ├── messageController.js   # Notification system
│   │   ├── orderController.js     # Order & checkout
│   │   ├── productController.js   # Product CRUD
│   │   ├── reviewController.js    # Review system
│   │   └── wishlistController.js  # Wishlist operations
│   ├── middleware/
│   │   ├── auth.js            # JWT authentication middleware
│   │   ├── error.js           # Global error handler
│   │   ├── rateLimit.js       # API rate limiting
│   │   └── requestLogger.js   # Request logging
│   ├── models/
│   │   ├── index.js           # Sequelize model loader
│   │   ├── User.js            # Customer model
│   │   ├── Admin.js           # Admin model
│   │   ├── Product.js         # Product model
│   │   ├── Category.js        # Category model
│   │   ├── Order.js           # Order model
│   │   ├── OrderItem.js       # Order items model
│   │   ├── CartItem.js        # Cart items model
│   │   ├── Review.js          # Review model
│   │   ├── Wishlist.js        # Wishlist model
│   │   └── Message.js         # Notification model
│   ├── routes/
│   │   ├── adminRoutes.js     # /api/admin/* routes
│   │   ├── authRoutes.js      # /api/auth/* routes
│   │   ├── cartRoutes.js      # /api/cart/* routes
│   │   ├── categoryRoutes.js  # /api/categories/* routes
│   │   ├── orderRoutes.js     # /api/orders/* routes
│   │   ├── productRoutes.js   # /api/products/* routes
│   │   ├── reviewRoutes.js    # /api/reviews/* routes
│   │   ├── viewRoutes.js      # Server-rendered pages
│   │   └── wishlistRoutes.js  # /api/wishlist/* routes
│   ├── views/                 # EJS templates
│   │   ├── pages/             # Page templates
│   │   └── partials/          # Reusable components
│   ├── migrations/            # Database migrations
│   ├── seeders/               # Demo data seeders
│   └── utils/
│       ├── hybridSearch.js    # Advanced product search
│       ├── jwt.js             # Token utilities
│       └── validators.js      # Input validation
```

---

## Frontend Structure

### Customer Frontend (EJS)
Server-rendered pages at port 3000:
- `/` - Home page with featured products
- `/shop` - Product listing with filters
- `/product/:slug` - Product detail page
- `/cart` - Shopping cart
- `/checkout` - Stripe checkout
- `/orders` - Order history
- `/login`, `/register` - Authentication
- `/profile` - User profile

### Admin Dashboard (React)
SPA at port 5174:
```
admin/
├── src/
│   ├── App.jsx                # Main app with routing
│   ├── main.jsx               # React entry point
│   ├── api/
│   │   └── axios.js           # API client configuration
│   ├── components/
│   │   ├── Layout.jsx         # Dashboard layout with sidebar
│   │   ├── LoadingSpinner.jsx # Loading indicator
│   │   ├── Modal.jsx          # Reusable modal
│   │   └── Table.jsx          # Data table component
│   ├── context/
│   │   └── AuthContext.jsx    # Admin authentication context
│   ├── hooks/
│   │   └── useApi.js          # Custom API hook
│   └── pages/
│       ├── Dashboard.jsx      # Stats & analytics
│       ├── Products.jsx       # Product management
│       ├── Categories.jsx     # Category management
│       ├── Orders.jsx         # Order management
│       ├── Reviews.jsx        # Review moderation
│       └── Login.jsx          # Admin login
```

---

## Database Schema

### Entity Relationships

```
┌──────────┐     ┌───────────┐     ┌──────────┐
│   User   │────<│   Order   │────<│OrderItem │
└──────────┘     └───────────┘     └──────────┘
     │                                   │
     │           ┌───────────┐          │
     └──────────>│  Review   │<─────────┘
                 └───────────┘
                      │
┌──────────┐     ┌───────────┐
│ Category │────<│  Product  │
└──────────┘     └───────────┘
     │                │
     │           ┌────┴────┐
     └──────────>│CartItem │
                 └─────────┘
```

### Key Models

| Model | Primary Fields | Relations |
|-------|---------------|-----------|
| User | id, email, password, firstName, lastName | hasMany: Orders, Reviews, CartItems |
| Admin | id, email, password, role | standalone |
| Product | id, name, slug, price, stock, categoryId | belongsTo: Category, hasMany: Reviews |
| Category | id, name, slug, parentId | hasMany: Products, self-reference |
| Order | id, orderNumber, userId, status, total | belongsTo: User, hasMany: OrderItems |
| OrderItem | id, orderId, productId, quantity, price | belongsTo: Order, Product |
| Review | id, userId, productId, rating, comment | belongsTo: User, Product |

---

## Authentication Flow

### Customer Authentication
```
1. Login: POST /api/auth/login
   → Validates credentials
   → Returns JWT in httpOnly cookie (token)
   → Frontend redirects to /

2. Protected Routes: Middleware checks req.cookies.token
   → Verifies JWT
   → Attaches req.user

3. Logout: POST /api/auth/logout
   → Clears cookie
```

### Admin Authentication
```
1. Login: POST /api/admin/auth/login
   → Validates admin credentials
   → Returns JWT in httpOnly cookie (adminToken)
   → React app stores auth state

2. Protected Routes: Middleware checks req.cookies.adminToken
   → Verifies JWT with admin claim
   → Attaches req.admin

3. Logout: POST /api/admin/auth/logout
   → Clears adminToken cookie
```

---

## API Routes

### Public Routes
| Method | Route | Description |
|--------|-------|-------------|
| GET | /api/products | List products |
| GET | /api/products/:id | Get product |
| GET | /api/categories | List categories |
| POST | /api/auth/login | Customer login |
| POST | /api/auth/register | Customer register |

### Customer Routes (Auth Required)
| Method | Route | Description |
|--------|-------|-------------|
| GET | /api/cart | Get cart |
| POST | /api/cart/add | Add to cart |
| PUT | /api/cart/:id | Update quantity |
| DELETE | /api/cart/:id | Remove item |
| GET | /api/orders | Get orders |
| POST | /api/orders/checkout | Create checkout |
| POST | /api/reviews | Submit review |
| POST | /api/wishlist/toggle | Toggle wishlist |

### Admin Routes (Admin Auth Required)
| Method | Route | Description |
|--------|-------|-------------|
| GET | /api/admin/dashboard/stats | Dashboard data |
| GET/POST/PUT/DELETE | /api/admin/products/* | Product CRUD |
| GET/POST/PUT/DELETE | /api/admin/categories/* | Category CRUD |
| GET/PUT | /api/admin/orders/* | Order management |
| GET/PUT/DELETE | /api/admin/reviews/* | Review moderation |

---

## Key Features

### 1. Hybrid Product Search
Location: `backend/src/utils/hybridSearch.js`
- Full-text search with PostgreSQL
- Category filtering
- Price range filtering
- Sort by: price, date, popularity

### 2. Review System
- Only verified purchases can review (order must be delivered)
- Star ratings (1-5)
- Admin moderation (approve/reject)
- Admin responses to reviews

### 3. Order Flow
```
Cart → Checkout → Stripe Payment → Order Created → 
Processing → Shipped → Delivered → Can Review
```

### 4. Notification System
- Order confirmations
- Shipping updates
- Delivery notifications
- Unread message counter in navbar

### 5. Rate Limiting
Environment-based configuration:
- Development: Relaxed limits, localhost bypass
- Testing: Higher limits for automated tests
- Production: Strict limits for security

---

## Development Guide

### Prerequisites
- Node.js 18+
- PostgreSQL (or Neon account)
- npm or yarn

### Environment Setup
```bash
# Backend .env
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret
STRIPE_SECRET_KEY=sk_test_...
NODE_ENV=development

# Admin .env (if needed)
VITE_API_URL=http://localhost:3000/api
```

### Running the Project

```bash
# Backend
cd backend
npm install
npm run dev          # Starts on port 3000

# Admin Dashboard
cd admin
npm install
npm run dev          # Starts on port 5174
```

### Database Commands
```bash
cd backend
npx sequelize-cli db:migrate    # Run migrations
npx sequelize-cli db:seed:all   # Seed demo data
node reset-db.js                # Reset & reseed
```

### Demo Credentials
**Customer**:
- Email: `john@example.com`
- Password: `Password123!`

**Admin**:
- Email: `admin@ecommerce.com`
- Password: `Admin@123`

---

## Admin Dashboard Design System

The admin dashboard follows a modern SaaS aesthetic inspired by Stripe, Linear, and Vercel dashboards.

### Color Palette
```
Primary:     Indigo (#6366f1) - Main accent, CTAs, active states
Secondary:   Violet (#8b5cf6) - Gradient accents, secondary highlights
Success:     Emerald (#10b981) - Positive states, delivered, approved
Warning:     Amber (#f59e0b) - Pending states, low stock alerts
Danger:      Rose (#f43f5e) - Delete actions, cancelled, errors

Neutrals:    Warm gray scale
- Background: #fafafa (gray-50)
- Cards: #ffffff with subtle shadow
- Text: #18181b (gray-900) to #71717a (gray-500)
- Borders: #e4e4e7 (gray-200)
```

### Typography
- **Font**: Inter (Google Fonts)
- **Hierarchy**: Bold headings, regular body, medium for labels
- **Colors**: Dark for primary text, muted gray for secondary

### Component Patterns
| Component | Style |
|-----------|-------|
| Primary Button | `bg-indigo-600 hover:bg-indigo-700 text-white` |
| Danger Button | `bg-rose-600 hover:bg-rose-700 text-white` |
| Success Badge | `bg-emerald-50 text-emerald-700 border-emerald-200` |
| Warning Badge | `bg-amber-50 text-amber-700 border-amber-200` |
| Info Badge | `bg-indigo-50 text-indigo-700 border-indigo-200` |
| Table Hover | `hover:bg-indigo-50/30` |
| Modal Header | `bg-gradient-to-r from-indigo-600 to-violet-600` |

### Order Status Colors
- **Pending**: Amber (waiting for action)
- **Processing**: Indigo (in progress)
- **Shipped**: Violet (in transit)
- **Delivered**: Emerald (complete)
- **Cancelled**: Rose (terminated)

---

## File Modification Summary

When implementing features, these are the typical files to modify:

| Feature Type | Files to Modify |
|--------------|-----------------|
| New API endpoint | controller, route, (model if needed) |
| New admin page | admin/src/pages/, App.jsx router |
| New customer page | views/pages/, viewRoutes.js |
| Database change | migrations/, models/, seeders/ |
| Styling (admin) | tailwind.config.js, index.css |
| Styling (customer) | public/css/style.css |

---

## Troubleshooting

### Common Issues

1. **Rate Limit Exceeded**
   - Set `NODE_ENV=testing` for higher limits
   - Check `middleware/rateLimit.js` configuration

2. **Auth Token Invalid**
   - Clear browser cookies
   - Check JWT_SECRET matches
   - Verify token not expired

3. **Database Connection Failed**
   - Check DATABASE_URL format
   - Verify Neon instance is active
   - Check IP allowlist

4. **Stripe Checkout Fails**
   - Verify STRIPE_SECRET_KEY
   - Check webhook configuration
   - Use test card: 4242 4242 4242 4242

---

## Architecture Decisions

1. **EJS for Customer Frontend**: Server-side rendering for SEO and initial load performance
2. **React for Admin**: SPA for complex dashboard interactions
3. **Separate Auth Cookies**: `token` for customers, `adminToken` for admins
4. **Soft Deletes**: Products use `isActive` flag instead of hard delete
5. **Order Snapshots**: OrderItems store product price at time of purchase
6. **Review Gating**: Reviews require delivered order for verified purchase badge

---

*Last Updated: January 2025*
