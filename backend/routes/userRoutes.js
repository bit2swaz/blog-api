const express = require('express');
const router = express.Router();
// const userController = require('../controllers/userController');
const { authenticateJWT, restrictTo } = require('../middleware/authMiddleware');

// Protected routes
router.use(authenticateJWT); // All routes below require authentication

// User routes
// router.get('/profile', userController.getProfile);
// router.put('/profile', userController.updateProfile);

// Admin routes (example of role-based access control)
// router.get('/admin/users', restrictTo('ADMIN'), userController.getAllUsers);

module.exports = router; 