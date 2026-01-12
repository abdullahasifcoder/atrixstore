/**
 * Cookie Configuration Utilities for Production Deployment
 * 
 * This module provides environment-aware cookie options for both
 * admin and customer authentication cookies.
 * 
 * Production Setup:
 * - Admin cookies: cross-subdomain (admin.atrixstore.tech → atrixstore.tech/api)
 * - Customer cookies: same-origin (atrixstore.tech → atrixstore.tech/api)
 * 
 * Development Setup:
 * - Both use localhost with relaxed security
 */

const isProduction = process.env.NODE_ENV === 'production';

/**
 * Get cookie options for admin authentication
 * Admin cookies must work across subdomains (admin.atrixstore.tech → atrixstore.tech)
 * 
 * @returns {Object} Cookie options for res.cookie() and res.clearCookie()
 */
function getAdminCookieOptions() {
  const baseOptions = {
    httpOnly: true,
    secure: isProduction,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/'
  };

  if (isProduction) {
    return {
      ...baseOptions,
      sameSite: 'none', // Required for cross-subdomain in production
      domain: '.atrixstore.tech' // Share cookie across subdomains
    };
  }

  // Development: relaxed settings for localhost
  return {
    ...baseOptions,
    sameSite: 'lax'
    // No domain in dev - browser scopes to current host
  };
}

/**
 * Get cookie options for customer authentication
 * Customer cookies are same-origin (atrixstore.tech → atrixstore.tech)
 * 
 * @returns {Object} Cookie options for res.cookie() and res.clearCookie()
 */
function getCustomerCookieOptions() {
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax', // More secure - CSRF protection for same-origin
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/'
    // No domain attribute - browser scopes to current domain
    // This is more secure than sharing across subdomains
  };
}

/**
 * Get cookie options based on mode
 * 
 * @param {'admin' | 'customer'} mode - Type of authentication
 * @returns {Object} Cookie options
 */
function getCookieOptions(mode = 'customer') {
  if (mode === 'admin') {
    return getAdminCookieOptions();
  }
  return getCustomerCookieOptions();
}

module.exports = {
  getAdminCookieOptions,
  getCustomerCookieOptions,
  getCookieOptions
};
