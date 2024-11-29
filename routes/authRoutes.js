const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  validateRegistration,
  register,
  login,
  forgotPassword,
  resetPassword,
  changePassword,
  getAllUsers
} = require('../controllers/authController');

// Public Routes (no authentication required)
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Protected Routes (authentication required)
router.use(authMiddleware.protect); // Apply authentication middleware to all routes below

// User routes
router.patch('/change-password', changePassword);

// Admin-only routes
router.get('/users', authMiddleware.restrictTo('ADMIN'), getAllUsers);

module.exports = router;