const db = require('../models');
const { generateAccessToken } = require('../utils/jwt');
const { COOKIE_OPTIONS } = require('../config/jwt');
const { asyncHandler } = require('../middleware/error');

const adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const admin = await db.Admin.findOne({ where: { email } });

  if (!admin) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password'
    });
  }

  if (!admin.isActive) {
    return res.status(403).json({
      success: false,
      message: 'Your account has been deactivated'
    });
  }

  const isPasswordValid = await admin.validatePassword(password);

  if (!isPasswordValid) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password'
    });
  }

  await admin.update({ lastLogin: new Date() });

  const token = generateAccessToken({ adminId: admin.id, email: admin.email });

  res.cookie('adminToken', token, COOKIE_OPTIONS);

  res.json({
    success: true,
    message: 'Login successful',
    admin: admin.toSafeObject(),
    token
  });
});

const adminLogout = asyncHandler(async (req, res) => {
  res.clearCookie('adminToken');

  res.json({
    success: true,
    message: 'Logout successful'
  });
});

const getAdminProfile = asyncHandler(async (req, res) => {
  const admin = await db.Admin.findByPk(req.admin.id);

  res.json({
    success: true,
    admin: admin.toSafeObject()
  });
});

const getDashboardStats = asyncHandler(async (req, res) => {
  const { Op } = require('sequelize');

  const totalUsers = await db.User.count();
  const totalProducts = await db.Product.count();
  const totalOrders = await db.Order.count();
  const totalCategories = await db.Category.count();

  const totalRevenue = await db.Order.sum('total', {
    where: { paymentStatus: 'paid' }
  }) || 0;

  const pendingOrders = await db.Order.count({
    where: { status: 'pending' }
  });

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const recentRevenue = await db.Order.sum('total', {
    where: {
      paymentStatus: 'paid',
      createdAt: { [Op.gte]: thirtyDaysAgo }
    }
  }) || 0;

  const lowStockProducts = await db.Product.count({
    where: {
      stock: { [Op.lte]: db.Sequelize.col('lowStockThreshold') }
    }
  });

  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  let monthlyRevenue = [];
  try {
    const rawMonthlyRevenue = await db.Order.findAll({
      attributes: [
        [db.Sequelize.fn('DATE_TRUNC', 'month', db.Sequelize.col('createdAt')), 'month'],
        [db.Sequelize.fn('SUM', db.Sequelize.col('total')), 'revenue'],
        [db.Sequelize.fn('COUNT', db.Sequelize.col('id')), 'orders']
      ],
      where: {
        paymentStatus: 'paid',
        createdAt: { [Op.gte]: sixMonthsAgo }
      },
      group: [db.Sequelize.fn('DATE_TRUNC', 'month', db.Sequelize.col('createdAt'))],
      order: [[db.Sequelize.fn('DATE_TRUNC', 'month', db.Sequelize.col('createdAt')), 'ASC']],
      raw: true
    });

    monthlyRevenue = rawMonthlyRevenue.map(item => ({
      month: item.month ? new Date(item.month).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Unknown',
      revenue: parseFloat(item.revenue || 0).toFixed(2),
      orders: parseInt(item.orders || 0)
    }));
  } catch (error) {
    console.error('Error fetching monthly revenue:', error);
    monthlyRevenue = [];
  }

  const topProducts = await db.Product.findAll({
    attributes: ['id', 'name', 'salesCount', 'price', 'stock'],
    order: [['salesCount', 'DESC']],
    limit: 5
  });

  const orderStatusCounts = await db.Order.findAll({
    attributes: [
      'status',
      [db.Sequelize.fn('COUNT', db.Sequelize.col('id')), 'count']
    ],
    group: ['status'],
    raw: true
  });

  const orderStatus = orderStatusCounts.map(item => ({
    name: item.status.charAt(0).toUpperCase() + item.status.slice(1),
    count: parseInt(item.count)
  }));

  const recentOrders = await db.Order.findAll({
    attributes: ['id', 'orderNumber', 'status', 'createdAt'],
    order: [['createdAt', 'DESC']],
    limit: 5,
    raw: true
  });

  const recentActivity = recentOrders.map(order => ({
    type: 'order',
    message: `Order #${order.orderNumber || order.id} - ${order.status}`,
    time: getTimeAgo(new Date(order.createdAt))
  }));

  res.json({
    success: true,
    stats: {
      totalUsers,
      totalProducts,
      totalOrders,
      totalCategories,
      totalRevenue: parseFloat(totalRevenue).toFixed(2),
      recentRevenue: parseFloat(recentRevenue).toFixed(2),
      pendingOrders,
      lowStockProducts,
      monthlyRevenue,
      topProducts,
      orderStatus,
      recentActivity
    }
  });
});

function getTimeAgo(date) {
  const seconds = Math.floor((new Date() - date) / 1000);

  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  return `${Math.floor(seconds / 86400)} days ago`;
}

module.exports = {
  adminLogin,
  adminLogout,
  getAdminProfile,
  getDashboardStats
};
