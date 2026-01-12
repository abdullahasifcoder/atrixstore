require('dotenv').config();

module.exports = {
  JWT_SECRET: process.env.JWT_SECRET || 'your_super_secret_jwt_key',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'your_super_secret_refresh_key',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '30d',

  // Admin cookies - cross-subdomain (admin.atrixstore.tech → atrixstore.tech)
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
  },

  // Customer cookies - same-origin (atrixstore.tech → atrixstore.tech)
  CUSTOMER_COOKIE_OPTIONS: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax', // Same-origin doesn't need 'none'
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/'
  },

  // Legacy export for backwards compatibility
  COOKIE_OPTIONS: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    ...(process.env.NODE_ENV === 'production' && {
      domain: '.atrixstore.tech',
      path: '/'
    })
  },
};
