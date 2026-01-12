const { verifyAccessToken } = require('../utils/jwt');
const db = require('../models');

const extractToken = (req, cookieName) => {

  if (req.cookies && req.cookies[cookieName]) {
    return req.cookies[cookieName];
  }

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  return null;
};

const authenticateUser = async (req, res, next) => {
  try {

    const token = extractToken(req, 'token');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    const decoded = verifyAccessToken(token);

    const user = await db.User.findByPk(decoded.userId);

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token or user no longer exists.'
      });
    }

    req.user = user.toSafeObject();
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token.'
    });
  }
};

const authenticateAdmin = async (req, res, next) => {
  try {

    const token = extractToken(req, 'adminToken');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No admin token provided.'
      });
    }

    const decoded = verifyAccessToken(token);

    const admin = await db.Admin.findByPk(decoded.adminId);

    if (!admin || !admin.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token or admin no longer exists.'
      });
    }

    req.admin = admin.toSafeObject();
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired admin token.'
    });
  }
};

const checkAdminRole = (roles) => {
  return (req, res, next) => {
    if (!req.admin) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    if (!roles.includes(req.admin.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions.'
      });
    }

    next();
  };
};

const optionalAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (token) {
      const decoded = verifyAccessToken(token);
      const user = await db.User.findByPk(decoded.userId);

      if (user && user.isActive) {
        req.user = user.toSafeObject();
      }
    }
  } catch (error) {

  }
  next();
};

module.exports = {
  authenticateUser,
  authenticateAdmin,
  checkAdminRole,
  optionalAuth,
};
