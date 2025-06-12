const express = require('express');
const router = express.Router();
// const userController = require('../controllers/userController');
const { authenticateJWT } = require('../middleware/authMiddleware');

// TODO: Implement user routes
// router.post('/register', userController.register);
// router.post('/login', userController.login);
// router.get('/profile', authenticateJWT, userController.getProfile);
// router.put('/profile', authenticateJWT, userController.updateProfile);

module.exports = router; 