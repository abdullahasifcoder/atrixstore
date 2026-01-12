const rateLimit = require('express-rate-limit');

/**
 * Rate Limiting Configuration
 * 
 * Environment-based rate limits:
 * - development/testing: High limits for comfortable testing
 * - production: Strict limits for security
 * 
 * Configuration via environment variables:
 * - NODE_ENV: 'development' | 'testing' | 'production'
 * - RATE_LIMIT_WINDOW_MS: Custom window in milliseconds
 * - RATE_LIMIT_MAX_REQUESTS: Custom max requests per window
 */

const isDevelopment = process.env.NODE_ENV !== 'production';
const isTesting = process.env.NODE_ENV === 'testing' || process.env.NODE_ENV === 'test';

// Skip rate limiting for localhost/127.0.0.1 in development
const skipLocalhost = (req) => {
  if (!isDevelopment) return false;
  const ip = req.ip || req.connection.remoteAddress;
  return ip === '127.0.0.1' || ip === '::1' || ip === '::ffff:127.0.0.1' || ip === 'localhost';
};

// Rate limit configurations by environment
const rateLimitConfig = {
  development: {
    auth: { windowMs: 15 * 60 * 1000, max: 100 },      // 100 attempts per 15 min
    api: { windowMs: 15 * 60 * 1000, max: 1000 },      // 1000 requests per 15 min
    strict: { windowMs: 60 * 60 * 1000, max: 50 },     // 50 per hour
    admin: { windowMs: 15 * 60 * 1000, max: 2000 },    // 2000 requests per 15 min
  },
  testing: {
    auth: { windowMs: 15 * 60 * 1000, max: 200 },      // 200 attempts per 15 min
    api: { windowMs: 15 * 60 * 1000, max: 5000 },      // 5000 requests per 15 min
    strict: { windowMs: 60 * 60 * 1000, max: 100 },    // 100 per hour
    admin: { windowMs: 15 * 60 * 1000, max: 10000 },   // 10000 requests per 15 min
  },
  production: {
    auth: { windowMs: 15 * 60 * 1000, max: 10 },       // 10 attempts per 15 min
    api: { windowMs: 15 * 60 * 1000, max: 200 },       // 200 requests per 15 min
    strict: { windowMs: 60 * 60 * 1000, max: 5 },      // 5 per hour
    admin: { windowMs: 15 * 60 * 1000, max: 500 },     // 500 requests per 15 min
  }
};

// Determine current environment config
const getConfig = () => {
  if (isTesting) return rateLimitConfig.testing;
  if (isDevelopment) return rateLimitConfig.development;
  return rateLimitConfig.production;
};

const config = getConfig();

// Auth limiter - for login/register endpoints
const authLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || config.auth.windowMs,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || config.auth.max,
  message: {
    success: false,
    message: 'Too many login attempts. Please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: skipLocalhost,
  keyGenerator: (req) => {
    // Use IP + user agent for better tracking
    return req.ip + (req.headers['user-agent'] || '');
  }
});

// General API limiter - for all API routes
const apiLimiter = rateLimit({
  windowMs: config.api.windowMs,
  max: config.api.max,
  message: {
    success: false,
    message: 'Too many requests. Please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: skipLocalhost,
});

// Strict limiter - for sensitive operations (password reset, etc.)
const strictLimiter = rateLimit({
  windowMs: config.strict.windowMs,
  max: config.strict.max,
  message: {
    success: false,
    message: 'Too many attempts. Please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: skipLocalhost,
});

// Admin API limiter - higher limits for admin dashboard operations
const adminLimiter = rateLimit({
  windowMs: config.admin.windowMs,
  max: config.admin.max,
  message: {
    success: false,
    message: 'Admin rate limit exceeded. Please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: skipLocalhost,
});

// Log rate limit configuration on startup (only in development)
if (isDevelopment) {
  console.log(`📊 Rate Limiting: ${process.env.NODE_ENV || 'development'} mode`);
  console.log(`   Auth: ${config.auth.max} req/${config.auth.windowMs / 60000} min`);
  console.log(`   API: ${config.api.max} req/${config.api.windowMs / 60000} min`);
  console.log(`   Admin: ${config.admin.max} req/${config.admin.windowMs / 60000} min`);
  console.log(`   Localhost bypass: enabled`);
}

module.exports = {
  authLimiter,
  apiLimiter,
  strictLimiter,
  adminLimiter,
  rateLimitConfig,
};
