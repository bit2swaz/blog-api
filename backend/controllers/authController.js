const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { AppError } = require('../utils/errorHandler');

const prisma = new PrismaClient();

// Sign up a new user
const signup = async (req, res, next) => {
  try {
    const { name, username, email, password, role } = req.body;

    // Use username as name if name is not provided
    const userName = name || username;

    if (!userName) {
      return next(new AppError('Name or username is required', 400));
    }

    if (!email) {
      return next(new AppError('Email is required', 400));
    }

    if (!password) {
      return next(new AppError('Password is required', 400));
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return next(new AppError('User with this email already exists', 400));
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await prisma.user.create({
      data: {
        name: userName,
        email,
        password: hashedPassword,
        role: role || 'USER'
      }
    });

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET
    );

    // Return user without password and token
    const { password: _, ...userWithoutPassword } = user;
    res.status(201).json({
      status: 'success',
      data: {
        user: userWithoutPassword,
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

// Login user
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return next(new AppError('Invalid email or password', 401));
    }

    // Check if password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return next(new AppError('Invalid email or password', 401));
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET
    );

    // Return user without password and token
    const { password: _, ...userWithoutPassword } = user;
    res.status(200).json({
      status: 'success',
      data: {
        user: userWithoutPassword,
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signup,
  login
}; 