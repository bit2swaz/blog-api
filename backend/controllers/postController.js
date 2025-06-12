const { PrismaClient } = require('@prisma/client');
const { AppError } = require('../utils/errorHandler');

const prisma = new PrismaClient();

// Get all published posts
const getAllPublishedPosts = async (req, res, next) => {
  try {
    const posts = await prisma.post.findMany({
      where: {
        published: true
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        },
        tags: true,
        _count: {
          select: { comments: true }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.status(200).json({
      status: 'success',
      results: posts.length,
      data: {
        posts
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get a specific published post
const getPublishedPostById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const post = await prisma.post.findFirst({
      where: {
        id,
        published: true
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        },
        tags: true,
        comments: {
          include: {
            author: {
              select: {
                id: true,
                name: true
              }
            },
            replies: {
              include: {
                author: {
                  select: {
                    id: true,
                    name: true
                  }
                }
              }
            }
          },
          where: {
            parentId: null
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });

    if (!post) {
      return next(new AppError('Post not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        post
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get all posts by logged-in author (published and unpublished)
const getAuthorPosts = async (req, res, next) => {
  try {
    const authorId = req.user.id;

    const posts = await prisma.post.findMany({
      where: {
        authorId
      },
      include: {
        tags: true,
        _count: {
          select: { comments: true }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.status(200).json({
      status: 'success',
      results: posts.length,
      data: {
        posts
      }
    });
  } catch (error) {
    next(error);
  }
};

// Create a new post
const createPost = async (req, res, next) => {
  try {
    const { title, content, tags } = req.body;
    const authorId = req.user.id;

    // Process tags - create any new ones and connect existing ones
    const tagObjects = [];
    if (tags && tags.length > 0) {
      for (const tagName of tags) {
        // Find or create tag
        const tag = await prisma.tag.upsert({
          where: { name: tagName },
          update: {},
          create: { name: tagName }
        });
        tagObjects.push({ id: tag.id });
      }
    }

    // Create post with tags
    const post = await prisma.post.create({
      data: {
        title,
        content,
        published: false,
        author: {
          connect: { id: authorId }
        },
        tags: {
          connect: tagObjects
        }
      },
      include: {
        tags: true
      }
    });

    res.status(201).json({
      status: 'success',
      data: {
        post
      }
    });
  } catch (error) {
    next(error);
  }
};

// Update a post
const updatePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, content, tags } = req.body;
    
    // Post exists and user is author (verified by middleware)
    const existingPost = req.post;

    // Process tags if provided
    let tagUpdates = {};
    if (tags && tags.length > 0) {
      // Get existing tags
      const postWithTags = await prisma.post.findUnique({
        where: { id },
        include: { tags: true }
      });
      
      // Disconnect all existing tags
      tagUpdates.disconnect = postWithTags.tags.map(tag => ({ id: tag.id }));
      
      // Connect new tags (creating them if they don't exist)
      const tagObjects = [];
      for (const tagName of tags) {
        const tag = await prisma.tag.upsert({
          where: { name: tagName },
          update: {},
          create: { name: tagName }
        });
        tagObjects.push({ id: tag.id });
      }
      tagUpdates.connect = tagObjects;
    }

    // Update the post
    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(content && { content }),
        ...(tags && { tags: tagUpdates })
      },
      include: {
        tags: true
      }
    });

    res.status(200).json({
      status: 'success',
      data: {
        post: updatedPost
      }
    });
  } catch (error) {
    next(error);
  }
};

// Toggle post published status
const togglePublishStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Post exists and user is author (verified by middleware)
    const post = req.post;

    // Toggle published status
    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        published: !post.published
      },
      include: {
        tags: true
      }
    });

    res.status(200).json({
      status: 'success',
      data: {
        post: updatedPost
      }
    });
  } catch (error) {
    next(error);
  }
};

// Delete a post
const deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Post exists and user is author (verified by middleware)
    
    // Delete the post (comments will be cascade deleted due to Prisma relation)
    await prisma.post.delete({
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
  getAllPublishedPosts,
  getPublishedPostById,
  getAuthorPosts,
  createPost,
  updatePost,
  togglePublishStatus,
  deletePost
}; 