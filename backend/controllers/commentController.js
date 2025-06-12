const { PrismaClient } = require('@prisma/client');
const { AppError } = require('../utils/errorHandler');

const prisma = new PrismaClient();

// Get all comments for a post with nested replies
const getCommentsByPostId = async (req, res, next) => {
  try {
    const { postId } = req.params;

    // Check if post exists
    const post = await prisma.post.findUnique({
      where: { id: postId }
    });

    if (!post) {
      return next(new AppError('Post not found', 404));
    }

    // Get top-level comments (no parentId)
    const comments = await prisma.comment.findMany({
      where: {
        postId,
        parentId: null
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        // Include nested replies recursively
        replies: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                email: true
              }
            },
            replies: {
              include: {
                author: {
                  select: {
                    id: true,
                    name: true,
                    email: true
                  }
                },
                replies: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.status(200).json({
      status: 'success',
      results: comments.length,
      data: {
        comments
      }
    });
  } catch (error) {
    next(error);
  }
};

// Create a new comment or reply
const createComment = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { content, parentId } = req.body;
    const authorId = req.user.id;

    // Check if post exists
    const post = await prisma.post.findUnique({
      where: { id: postId }
    });

    if (!post) {
      return next(new AppError('Post not found', 404));
    }

    // If parentId is provided, check if parent comment exists
    if (parentId) {
      const parentComment = await prisma.comment.findUnique({
        where: { id: parentId }
      });

      if (!parentComment) {
        return next(new AppError('Parent comment not found', 404));
      }

      // Ensure parent comment belongs to the same post
      if (parentComment.postId !== postId) {
        return next(new AppError('Parent comment does not belong to this post', 400));
      }
    }

    // Create the comment
    const comment = await prisma.comment.create({
      data: {
        content,
        post: {
          connect: { id: postId }
        },
        author: {
          connect: { id: authorId }
        },
        ...(parentId && {
          parent: {
            connect: { id: parentId }
          }
        })
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    res.status(201).json({
      status: 'success',
      data: {
        comment
      }
    });
  } catch (error) {
    next(error);
  }
};

// Delete a comment
const deleteComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Check if comment exists
    const comment = await prisma.comment.findUnique({
      where: { id }
    });

    if (!comment) {
      return next(new AppError('Comment not found', 404));
    }

    // Check if user is the author of the comment or has AUTHOR role
    if (comment.authorId !== userId && userRole !== 'AUTHOR') {
      return next(new AppError('You can only delete your own comments', 403));
    }

    // Delete the comment (cascade will handle replies)
    await prisma.comment.delete({
      where: { id }
    });

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCommentsByPostId,
  createComment,
  deleteComment
}; 