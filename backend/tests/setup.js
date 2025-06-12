const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Test user data
const testUser = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'password123',
  role: 'AUTHOR'
};

// Test post data
const testPost = {
  title: 'Test Post',
  content: 'This is a test post content',
  published: false,
  tags: ['test', 'jest']
};

// Setup function to create test user and generate token
const setupTestUser = async () => {
  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(testUser.password, salt);

  // Create user in database
  const user = await prisma.user.upsert({
    where: { email: testUser.email },
    update: {},
    create: {
      name: testUser.name,
      email: testUser.email,
      password: hashedPassword,
      role: testUser.role
    }
  });

  // Generate token
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET
  );

  return { user, token };
};

// Setup function to create test post
const setupTestPost = async (authorId) => {
  // Create post in database
  const post = await prisma.post.create({
    data: {
      title: testPost.title,
      content: testPost.content,
      published: testPost.published,
      author: {
        connect: { id: authorId }
      },
      tags: {
        create: testPost.tags.map(tagName => ({
          name: tagName
        }))
      }
    },
    include: {
      tags: true
    }
  });

  return post;
};

// Cleanup function
const cleanupDatabase = async () => {
  // Delete in correct order due to foreign key constraints
  await prisma.comment.deleteMany({});
  await prisma.post.deleteMany({});
  await prisma.tag.deleteMany({});
  await prisma.user.deleteMany({});
};

module.exports = {
  testUser,
  testPost,
  setupTestUser,
  setupTestPost,
  cleanupDatabase,
  prisma
}; 