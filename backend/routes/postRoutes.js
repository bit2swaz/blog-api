const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const commentController = require('../controllers/commentController');
const { authenticateJWT } = require('../middleware/authMiddleware');
const { isPostAuthor } = require('../middleware/postMiddleware');

// Public routes
router.get('/', postController.getAllPublishedPosts);

// Protected routes (auth required)
router.get('/unpublished', authenticateJWT, postController.getAuthorPosts);

// Dynamic route (must come after specific routes)
router.get('/:id', postController.getPublishedPostById);

// Comment routes for posts
router.get('/:postId/comments', commentController.getCommentsByPostId);
router.post('/:postId/comments', authenticateJWT, commentController.createComment);

// Other protected routes
router.post('/', authenticateJWT, postController.createPost);
router.put('/:id', authenticateJWT, isPostAuthor, postController.updatePost);
router.patch('/:id/publish', authenticateJWT, isPostAuthor, postController.togglePublishStatus);
router.delete('/:id', authenticateJWT, isPostAuthor, postController.deletePost);

module.exports = router; 