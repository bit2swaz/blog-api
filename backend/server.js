const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const { globalErrorHandler } = require('./utils/errorHandler');
const { notFound } = require('./middleware/errorMiddleware');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Security middleware
app.use(helmet()); // Set security HTTP headers

// CORS configuration
app.use(cors({
  origin: [
    'http://localhost:3000', // Frontend author
    'http://localhost:3001', // Frontend reader
    process.env.FRONTEND_AUTHOR_URL,
    process.env.FRONTEND_READER_URL
  ].filter(Boolean), // Filter out undefined values
  credentials: true
}));

// Request logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Body parser middleware
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Blog API' });
});

// Import and use route files
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/posts', require('./routes/postRoutes'));
app.use('/api/comments', require('./routes/commentRoutes'));
app.use('/api/tags', require('./routes/tagRoutes'));

// Handle undefined routes (404)
app.use(notFound);

// Global error handling middleware
app.use(globalErrorHandler);

// Start server
const PORT = process.env.PORT || 3000;

// Only start server if not in test mode
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  });
}

// Export app for testing
module.exports = app; 