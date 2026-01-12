const db = require('../models');
const { generateAccessToken } = require('../utils/jwt');
const { CUSTOMER_COOKIE_OPTIONS } = require('../config/jwt');
const { asyncHandler } = require('../middleware/error');
const { createWelcomeNotification } = require('./messageController');

const register = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, phone } = req.body;

  const existingUser = await db.User.findOne({ where: { email } });
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'User with this email already exists'
    });
  }

  const user = await db.User.create({
    firstName,
    lastName,
    email,
    password,
    phone
  });

  // Send welcome notification
  try {
    await createWelcomeNotification(user.id, firstName);
  } catch (error) {
    console.error('Failed to create welcome notification:', error);
  }

  const token = generateAccessToken({ userId: user.id, email: user.email });

  res.cookie('token', token, CUSTOMER_COOKIE_OPTIONS);

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    user: user.toSafeObject(),
    token
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await db.User.findOne({ where: { email } });

  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password'
    });
  }

  if (!user.isActive) {
    return res.status(403).json({
      success: false,
      message: 'Your account has been deactivated'
    });
  }

  const isPasswordValid = await user.validatePassword(password);

  if (!isPasswordValid) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password'
    });
  }

  await user.update({ lastLogin: new Date() });

  const token = generateAccessToken({ userId: user.id, email: user.email });

  res.cookie('token', token, CUSTOMER_COOKIE_OPTIONS);

  res.json({
    success: true,
    message: 'Login successful',
    user: user.toSafeObject(),
    token
  });
});

const logout = asyncHandler(async (req, res) => {
  // Clear cookie with same options as when it was set
  res.clearCookie('token', CUSTOMER_COOKIE_OPTIONS);

  res.json({
    success: true,
    message: 'Logout successful'
  });
});

const getMe = asyncHandler(async (req, res) => {
  const user = await db.User.findByPk(req.user.id);

  res.json({
    success: true,
    user: user.toSafeObject()
  });
});

const updateProfile = asyncHandler(async (req, res) => {
  const { firstName, lastName, phone, shippingAddress, city, state, postalCode, country } = req.body;

  const user = await db.User.findByPk(req.user.id);

  await user.update({
    firstName: firstName || user.firstName,
    lastName: lastName || user.lastName,
    phone: phone || user.phone,
    shippingAddress: shippingAddress || user.shippingAddress,
    city: city || user.city,
    state: state || user.state,
    postalCode: postalCode || user.postalCode,
    country: country || user.country
  });

  res.json({
    success: true,
    message: 'Profile updated successfully',
    user: user.toSafeObject()
  });
});

module.exports = {
  register,
  login,
  logout,
  getMe,
  updateProfile
};
