const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const { AppError } = require('../utils/errorHandler');

const prisma = new PrismaClient();

// Middleware to authenticate JWT
const authenticateJWT = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(new AppError('No token provided, authorization denied', 401));
    }

    // Extract token from Bearer token
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return next(new AppError('No token provided, authorization denied', 401));
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Find user by id
      const user = await prisma.user.findUnique({
        where: { id: decoded.id }
      });
      
      if (!user) {
        return next(new AppError('User not found', 404));
      }
      
      // Add user to request object
      req.user = {
        id: user.id,
        email: user.email,
        role: user.role
      };
      
      next();
    } catch (error) {
      return next(new AppError('Invalid token', 401));
    }
  } catch (error) {
    next(error);
  }
};

// Middleware to check if user is an author
const authorOnly = (req, res, next) => {
  if (req.user && req.user.role === 'AUTHOR') {
    next();
  } else {
    next(new AppError('Not authorized as an author', 403));
  }
};

module.exports = {
  authenticateJWT,
  authorOnly
}; 