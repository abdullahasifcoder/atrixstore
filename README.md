# ATRIX E-Commerce Platform

A full-stack e-commerce platform with a customer-facing website, React admin dashboard, and complete payment integration using Stripe.

---

## 🌐 Live Application

- **Customer & Backend**: https://atrixstore.tech
- **Admin Dashboard**: https://admin.atrixstore.tech

---

## 🛠️ Tech Stack

### Backend
- **Node.js** + **Express.js** - Server and API
- **PostgreSQL** (Neon Cloud) - Database
- **Sequelize** - ORM and migrations
- **EJS** - Server-side templating for customer pages
- **JWT** - Authentication (httpOnly cookies)
- **Bcrypt** - Password hashing
- **Stripe** - Payment processing

### Admin Dashboard
- **React 18** - UI framework
- **Vite** - Build tool
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling
- **Recharts** - Analytics charts
- **Axios** - HTTP client

### Database
- **PostgreSQL** hosted on **Neon** (serverless cloud)
- **Sequelize ORM** for migrations and models

---

## 📐 Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         ATRIX Platform                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐       │
│  │   Customer   │    │    Admin     │    │   Backend    │       │
│  │   Frontend   │    │   Dashboard  │    │    API       │       │
│  │   (EJS)      │    │   (React)    │    │  (Express)   │       │
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

- **Express server** serves both EJS-rendered customer pages and REST API endpoints under `/api/*`
- **React admin dashboard** is a separate SPA that communicates with the backend API
- **Authentication** uses JWT tokens stored in httpOnly cookies (`token` for customers, `adminToken` for admins)

---

## ✨ Key Features

### Customer Features
- **Product Browsing**: View products with advanced search and category filters
- **Shopping Cart**: Add/remove items with real-time updates
- **Checkout**: Stripe integration for secure payments
- **User Authentication**: Register, login, profile management
- **Order History**: Track order status (pending, processing, shipped, delivered)
- **Reviews**: Submit reviews for delivered products (verified purchases)
- **Wishlist**: Save products for later

### Admin Features
- **Dashboard**: Analytics with revenue stats, order trends, and product metrics
- **Product Management**: Full CRUD operations with image upload and stock tracking
- **Category Management**: Hierarchical categories (parent-child structure)
- **Order Management**: View and update order status
- **Review Moderation**: Approve/reject reviews and respond to customer feedback

---

## 📂 Repository Structure

```
backend/
├── src/
│   ├── server.js              # Express app entry point
│   ├── config/
│   │   ├── database.js        # Sequelize connection (Neon)
│   │   ├── jwt.js             # JWT configuration
│   │   └── stripe.js          # Stripe configuration
│   ├── controllers/           # Business logic
│   ├── middleware/            # Auth, error handling, rate limiting
│   ├── models/                # Sequelize models (User, Product, Order, etc.)
│   ├── routes/                # API routes + view routes
│   ├── views/                 # EJS templates for customer pages
│   ├── migrations/            # Database migrations
│   └── seeders/               # Demo data
├── package.json
└── .env

admin/
├── src/
│   ├── App.jsx                # React app with routing
│   ├── api/axios.js           # API client
│   ├── components/            # Reusable components
│   ├── context/               # Auth context
│   ├── pages/                 # Dashboard, Products, Orders, etc.
│   └── main.jsx
├── package.json
└── vite.config.js
```

---

## 🔐 Environment Variables

### Backend (`backend/.env`)

```env
# Server
NODE_ENV=development
PORT=3000

# Database (Neon PostgreSQL)
DATABASE_URL=postgresql://user:password@host.neon.tech/database?sslmode=require

# JWT
JWT_SECRET=your_secret_key_min_32_characters
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your_refresh_secret
JWT_REFRESH_EXPIRES_IN=30d

# Bcrypt
BCRYPT_SALT_ROUNDS=12

# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
STRIPE_SUCCESS_URL=http://localhost:3000/orders/success
STRIPE_CANCEL_URL=http://localhost:3000/cart

# CORS
ADMIN_URL=http://localhost:5174
CUSTOMER_URL=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=5
```

### Admin Dashboard (`admin/.env`)

```env
VITE_API_URL=http://localhost:3000/api
```

---

## 🚀 Local Development

### Prerequisites
- Node.js 18+
- npm or yarn
- PostgreSQL account on [Neon](https://neon.tech/) (or local PostgreSQL)

### 1. Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd FinalLabexamproject

# Install backend dependencies
cd backend
npm install

# Install admin dependencies
cd ../admin
npm install
```

### 2. Configure Environment

Create `backend/.env` file with your Neon database URL and secrets (see above).

Create `admin/.env` file with API URL (see above).

### 3. Setup Database

```bash
cd backend

# Run migrations
npx sequelize-cli db:migrate

# Seed demo data (optional)
npx sequelize-cli db:seed:all
```

### 4. Run Development Servers

**Terminal 1 - Backend + Customer Site:**
```bash
cd backend
npm run dev
# Runs on http://localhost:3000
```

**Terminal 2 - Admin Dashboard:**
```bash
cd admin
npm run dev
# Runs on http://localhost:5174
```

### 5. Access the Application

- **Customer Website**: http://localhost:3000
- **Admin Dashboard**: http://localhost:5174

---

## 🗄️ Database Management

### Run Migrations
```bash
cd backend
npx sequelize-cli db:migrate
```

### Seed Demo Data
```bash
npx sequelize-cli db:seed:all
```

### Reset Database (Development Only)
```bash
npm run db:reset
```

This will undo all migrations, re-run them, and re-seed data.

---

## 👤 Demo Credentials

### Admin Account
- **Email**: `admin@ecommerce.com`
- **Password**: `Admin@123`

### Customer Account
- **Email**: `john@example.com`
- **Password**: `Password123!`

### Test Stripe Card
- **Card Number**: `4242 4242 4242 4242`
- **Expiry**: Any future date
- **CVC**: Any 3 digits

---

## 📡 API Routes

### Public Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List all products |
| GET | `/api/products/:id` | Get product details |
| GET | `/api/categories` | List categories |
| POST | `/api/auth/register` | Customer registration |
| POST | `/api/auth/login` | Customer login |

### Customer Routes (Auth Required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cart` | Get shopping cart |
| POST | `/api/cart/add` | Add item to cart |
| PUT | `/api/cart/:id` | Update cart item quantity |
| DELETE | `/api/cart/:id` | Remove cart item |
| GET | `/api/orders` | Get user orders |
| POST | `/api/orders/checkout` | Create Stripe checkout |
| POST | `/api/reviews` | Submit product review |
| POST | `/api/wishlist/toggle` | Toggle wishlist item |

### Admin Routes (Admin Auth Required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/auth/login` | Admin login |
| GET | `/api/admin/dashboard/stats` | Dashboard statistics |
| GET/POST/PUT/DELETE | `/api/admin/products/*` | Product CRUD |
| GET/POST/PUT/DELETE | `/api/admin/categories/*` | Category CRUD |
| GET/PUT | `/api/admin/orders/*` | Order management |
| GET/PUT/DELETE | `/api/admin/reviews/*` | Review moderation |

---

## 🌍 Deployment

### Production URLs
- **Backend + Customer Site**: https://atrixstore.tech (Render Web Service)
- **Admin Dashboard**: https://admin.atrixstore.tech (Render Static Site)
- **Database**: Neon PostgreSQL (serverless)

### Production Environment Variables

**Backend:**
```env
NODE_ENV=production
DATABASE_URL=<neon-production-url>
JWT_SECRET=<strong-random-secret>
JWT_EXPIRES_IN=7d
STRIPE_SECRET_KEY=<stripe-live-key>
STRIPE_SUCCESS_URL=https://atrixstore.tech/orders/success
STRIPE_CANCEL_URL=https://atrixstore.tech/cart
ADMIN_URL=https://admin.atrixstore.tech
CUSTOMER_URL=https://atrixstore.tech
```

**Admin Dashboard:**
```env
VITE_API_BASE_URL=https://atrixstore.tech
```

### Deployment Notes
- Backend uses **Render Web Service** with automatic SSL
- Admin dashboard uses **Render Static Site** (built with Vite)
- Database uses **Neon** with connection pooling enabled
- Cross-domain cookies configured with `domain: .atrixstore.tech` and `sameSite: 'none'`
- Backend includes `app.set('trust proxy', 1)` for Render's proxy

For detailed deployment instructions, see [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md).

---

## 🔒 Security Features

- **JWT Authentication**: Tokens stored in httpOnly cookies
- **Password Hashing**: Bcrypt with 12 salt rounds
- **Rate Limiting**: Protects against brute force attacks
- **CORS**: Configured for specific allowed origins
- **SQL Injection Prevention**: Sequelize parameterized queries
- **Input Validation**: express-validator middleware
- **Secure Cookies**: httpOnly, secure (in production), sameSite attributes

---

## 🧪 Testing Stripe Checkout

Use these test cards in development:

| Card Number | Result |
|-------------|--------|
| 4242 4242 4242 4242 | Success |
| 4000 0000 0000 0002 | Card declined |
| 4000 0000 0000 9995 | Insufficient funds |

Use any future expiry date and any 3-digit CVC.

---

## 🛠️ Troubleshooting

### Database Connection Issues
- Verify `DATABASE_URL` is correct in `.env`
- Ensure Neon instance is active
- Check if `?sslmode=require` is included in connection string

### Authentication Issues
- Clear browser cookies
- Verify `JWT_SECRET` matches across restarts
- Check token expiration settings

### Stripe Checkout Fails
- Verify `STRIPE_SECRET_KEY` in `.env`
- Ensure success/cancel URLs are correct
- Use test cards in development mode

### Port Already in Use
```bash
# Kill process on port 3000 (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Kill process on port 3000 (Mac/Linux)
lsof -ti:3000 | xargs kill -9
```

---

## 📖 Additional Documentation

- **[PROJECT_FLOW.md](./PROJECT_FLOW.md)** - Complete technical documentation
- **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Production deployment guide
- **[API_DOCS.md](./API_DOCS.md)** - API reference
- **[postman_collection.json](./postman_collection.json)** - Postman collection

---

## 📝 Scripts Reference

### Backend Scripts
```bash
npm start              # Run server in production
npm run dev            # Run with nodemon (auto-reload)
npm run migrate        # Run database migrations
npm run migrate:undo   # Undo last migration
npm run seed           # Seed demo data
npm run seed:undo      # Undo all seeds
npm run db:reset       # Reset database (dev only)
```

### Admin Scripts
```bash
npm run dev            # Start Vite dev server
npm run build          # Build for production
npm run preview        # Preview production build
```

---

## 🙏 Acknowledgments

- **Neon** - Serverless PostgreSQL hosting
- **Stripe** - Payment processing
- **Render** - Application hosting
- **Bootstrap 5** - Customer site styling
- **Tailwind CSS** - Admin dashboard UI
- **Recharts** - Analytics visualization

---

**Built with ❤️ for E-Commerce Excellence**
