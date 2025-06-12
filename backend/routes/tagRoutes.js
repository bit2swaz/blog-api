const express = require('express');
const router = express.Router();
// const tagController = require('../controllers/tagController');
const { authenticateJWT, authorOnly } = require('../middleware/authMiddleware');

// TODO: Implement tag routes
// router.get('/', tagController.getAllTags);
// router.post('/', authenticateJWT, authorOnly, tagController.createTag);
// router.delete('/:id', authenticateJWT, authorOnly, tagController.deleteTag);

module.exports = router; 