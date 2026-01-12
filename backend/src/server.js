require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const { testConnection } = require('./config/database');
const { errorHandler, notFound } = require('./middleware/error');
const { apiLimiter, adminLimiter } = require('./middleware/rateLimit');

const app = express();

app.set('trust proxy', 1);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.use(morgan('dev'));

if (process.env.DEBUG_ORDERS === 'true') {
  const requestLogger = require('./middleware/requestLogger');
  app.use(requestLogger);
  console.log('🔍 Detailed order logging enabled');
}

// CORS Configuration - Allow admin and customer frontends
const allowedOrigins = [
  'https://admin.atrixstore.tech',
  'https://atrixstore.tech',
  'http://localhost:5174',
  'http://localhost:5173',
  'http://localhost:5175',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  'http://127.0.0.1:5175'
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Essential for cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use('/api/orders/webhook', express.raw({ type: 'application/json' }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Apply rate limiting - higher limits for admin routes
app.use('/api/admin', adminLimiter);
app.use('/api', apiLimiter);

// Database health check with table validation
const db = require('./models');
const validateDatabase = async (retries = 3) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await testConnection();
      
      // Small delay to let Neon fully wake up
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Verify critical tables exist using pg_tables (more reliable)
      const criticalTables = ['users', 'products', 'categories', 'orders', 'admins'];
      const [tables] = await db.sequelize.query(
        `SELECT tablename FROM pg_tables WHERE schemaname = 'public'`
      );
      const existingTables = tables.map(t => t.tablename);
      
      const missingTables = criticalTables.filter(t => !existingTables.includes(t));
      if (missingTables.length > 0) {
        if (attempt < retries) {
          console.log(`⏳ Database tables not ready (attempt ${attempt}/${retries}), retrying...`);
          await new Promise(resolve => setTimeout(resolve, 2000));
          continue;
        }
        console.error('❌ CRITICAL: Missing database tables:', missingTables.join(', '));
        console.error('   Run: npx sequelize-cli db:migrate && npx sequelize-cli db:seed:all');
        process.exit(1);
      }
      
      console.log('✅ Database schema validated (' + existingTables.length + ' tables)');
      return;
    } catch (error) {
      if (attempt < retries) {
        console.log(`⏳ Database connection attempt ${attempt}/${retries} failed, retrying...`);
        await new Promise(resolve => setTimeout(resolve, 2000));
        continue;
      }
      console.error('❌ Database validation failed:', error.message);
      process.exit(1);
    }
  }
};
validateDatabase();

// Load categories for all view routes (navbar dropdown)
app.use(async (req, res, next) => {
  // Skip for API routes and static files
  if (req.path.startsWith('/api') || req.path.includes('.')) {
    return next();
  }
  try {
    res.locals.allCategories = await db.Category.findAll({
      where: { isActive: true },
      order: [['sortOrder', 'ASC'], ['name', 'ASC']],
      attributes: ['id', 'name', 'slug', 'parentId']
    });
  } catch (error) {
    res.locals.allCategories = [];
  }
  next();
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/wishlist', require('./routes/wishlistRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));

app.use('/', require('./routes/viewRoutes'));

// Health check endpoint for monitoring
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

app.use(notFound);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});

module.exports = app;
