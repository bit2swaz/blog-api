const express = require('express');
const router = express.Router();
// const postController = require('../controllers/postController');
const { authenticateJWT, authorOnly } = require('../middleware/authMiddleware');

// TODO: Implement post routes
// router.get('/', postController.getAllPosts);
// router.get('/:id', postController.getPostById);
// router.post('/', authenticateJWT, authorOnly, postController.createPost);
// router.put('/:id', authenticateJWT, authorOnly, postController.updatePost);
// router.delete('/:id', authenticateJWT, authorOnly, postController.deletePost);

module.exports = router; 