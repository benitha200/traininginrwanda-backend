// const express = require('express');
// const router = express.Router();
// const authController = require('../controllers/authController');
// const authMiddleware = require('../middleware/authMiddleware');

// // Public Routes
// router.post('/register', authController.register);
// router.post('/login', authController.login);
// router.post('/forgot-password', authController.forgotPassword);
// router.post('/reset-password', authController.resetPassword);

// // Protected Routes
// // router.get('/profile', 
// //   authMiddleware.protect, 
// //   authController.getUserProfile
// // );

// // router.put('/profile', 
// //   authMiddleware.protect, 
// //   authController.updateProfile
// // );

// // router.patch('/change-password', 
// //   authMiddleware.protect, 
// //   authController.changePassword
// // );

// // Admin-only route
// router.get('/users', 
//   authMiddleware.protect, 
//   authMiddleware.restrictTo('admin'), 
//   authController.getAllUsers
// );

// module.exports = router;


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