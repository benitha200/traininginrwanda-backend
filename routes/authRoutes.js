const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// Public Routes
// router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

// Protected Routes
// router.get('/profile', 
//   authMiddleware.protect, 
//   authController.getUserProfile
// );

// router.put('/profile', 
//   authMiddleware.protect, 
//   authController.updateProfile
// );

// router.patch('/change-password', 
//   authMiddleware.protect, 
//   authController.changePassword
// );

// Admin-only route
router.get('/users', 
  authMiddleware.protect, 
  authMiddleware.restrictTo('admin'), 
  authController.getAllUsers
);

module.exports = router;