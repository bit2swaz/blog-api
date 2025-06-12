const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const { authenticateJWT } = require('../middleware/authMiddleware');

// TODO: Implement comment routes
// router.get('/post/:postId', commentController.getCommentsByPostId);
// router.post('/', authenticateJWT, commentController.createComment);
// router.put('/:id', authenticateJWT, commentController.updateComment);

// Delete a comment (auth required)
router.delete('/:id', authenticateJWT, commentController.deleteComment);

module.exports = router; 