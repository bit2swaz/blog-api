const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const { AppError, handleJWTError, handleJWTExpiredError } = require('../utils/errorHandler');

const prisma = new PrismaClient();

// Middleware to authenticate JWT
const authenticateJWT = async (req, res, next) => {
  try {
    // 1) Get token from header or cookies
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.jwt) {
      token = req.cookies.jwt;
    }
    
    if (!token) {
      return next(new AppError('You are not logged in. Please log in to get access.', 401));
    }

    // 2) Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err.name === 'JsonWebTokenError') {
        return next(handleJWTError());
      }
      if (err.name === 'TokenExpiredError') {
        return next(handleJWTExpiredError());
      }
      return next(new AppError('Authentication failed', 401));
    }
    
    // 3) Check if user still exists
    const user = await prisma.user.findUnique({
      where: { id: decoded.id }
    });
    
    if (!user) {
      return next(new AppError('The user belonging to this token no longer exists.', 401));
    }
    
    // 4) Add user to request object
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    };
    
    next();
  } catch (error) {
    next(error);
  }
};

// Middleware to check if user is an author
const authorOnly = (req, res, next) => {
  if (req.user && req.user.role === 'AUTHOR') {
    next();
  } else {
    next(new AppError('Access denied. Author privileges required.', 403));
  }
};

// Middleware to restrict access based on user roles
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }
    next();
  };
};

module.exports = {
  authenticateJWT,
  authorOnly,
  restrictTo
}; 