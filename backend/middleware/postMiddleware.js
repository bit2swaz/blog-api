const { PrismaClient } = require('@prisma/client');
const { AppError } = require('../utils/errorHandler');

const prisma = new PrismaClient();

// Middleware to check if the user is the author of the post
const isPostAuthor = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const post = await prisma.post.findUnique({
      where: { id }
    });

    if (!post) {
      return next(new AppError('Post not found', 404));
    }

    if (post.authorId !== userId) {
      return next(new AppError('You are not authorized to perform this action', 403));
    }

    // Add post to request for potential use in controller
    req.post = post;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  isPostAuthor
}; 