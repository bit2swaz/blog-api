# Blog API Backend

A RESTful API for a blog application built with Express.js and Prisma ORM.

## Tech Stack

- Node.js
- Express.js
- PostgreSQL
- Prisma ORM
- JWT Authentication
- Helmet (Security headers)
- Morgan (Request logging)

## Project Structure

```
backend/
├── controllers/    # Request handlers
├── middleware/     # Custom middleware functions
├── prisma/         # Prisma schema and migrations
├── routes/         # API routes
├── tests/          # Test files
├── utils/          # Utility functions
├── .env            # Environment variables
├── .env.test       # Test environment variables
├── server.js       # Entry point
└── package.json    # Dependencies and scripts
```

## Setup Instructions

1. Install dependencies:
   ```
   npm install
   ```

2. Configure environment variables:
   - Create a `.env` file in the root directory
   - Add the following variables:
     ```
     DATABASE_URL="postgresql://username:password@localhost:5432/blogapi?schema=public"
     JWT_SECRET="your-secret-key-here"
     PORT=3000
     NODE_ENV="development"
     FRONTEND_AUTHOR_URL="http://localhost:3000"
     FRONTEND_READER_URL="http://localhost:3001"
     ```

3. Run database migrations:
   ```
   npx prisma migrate dev
   ```

4. Start the server:
   ```
   npm run dev
   ```

## Testing

The API includes a comprehensive test suite using Jest and Supertest. Tests are organized by feature and cover authentication, posts, comments, and error handling.

### Test Setup

1. Create a test database:
   ```
   psql -U your_username -c "CREATE DATABASE blogapi_test;"
   ```

2. Configure test environment:
   - Ensure `.env.test` file is set up with the test database connection string
   - Test environment variables are loaded automatically when running tests

### Running Tests

- Run all tests:
  ```
  npm test
  ```

- Run specific test files:
  ```
  npm test -- --testMatch="**/tests/auth.test.js"
  ```

- Run tests with coverage report:
  ```
  npm run test:coverage
  ```

- Run tests in watch mode (for development):
  ```
  npm run test:watch
  ```

### Test Files

- `auth.test.js`: Tests for user registration and login
- `post.test.js`: Tests for post creation, retrieval, update, and deletion
- `comment.test.js`: Tests for comment creation, nested replies, and deletion
- `error.test.js`: Tests for error handling, security headers, and authentication errors

## Security Features

1. **JWT Authentication**:
   - Tokens are verified for validity and expiration
   - Users are authenticated before accessing protected routes

2. **CORS Protection**:
   - Configured to allow only specific frontend origins
   - Prevents unauthorized cross-origin requests

3. **Security Headers (Helmet)**:
   - Sets various HTTP headers to enhance security
   - Protects against common web vulnerabilities

4. **Request Logging**:
   - Development mode: Concise logs with Morgan 'dev' format
   - Production mode: Detailed logs with Morgan 'combined' format

5. **Error Handling**:
   - Global error handler for consistent error responses
   - Different error details in development vs. production
   - Custom error classes for operational errors

## Authentication

The API uses JWT (JSON Web Token) for authentication:

1. **Signup**: `POST /api/auth/signup`
   - Request body: `{ "name": "User Name", "email": "user@example.com", "password": "password123", "role": "USER" }`
   - Response: User object and JWT token

2. **Login**: `POST /api/auth/login`
   - Request body: `{ "email": "user@example.com", "password": "password123" }`
   - Response: User object and JWT token

3. **Authentication**:
   - Store the JWT token in localStorage
   - Include it in requests: `Authorization: Bearer YOUR_JWT_TOKEN`
   - Protected routes require valid JWT

## API Endpoints

### Auth

- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login a user

### Users

- `GET /api/users/profile` - Get user profile (protected)

### Posts

- `GET /api/posts` - Get all published posts
- `GET /api/posts/:id` - Get a specific published post with details
- `GET /api/posts/unpublished` - Get all posts by logged-in author (protected)
- `POST /api/posts` - Create a new post (protected)
  - Request body: `{ "title": "Post Title", "content": "Post content", "tags": ["tag1", "tag2"] }`
  - New posts are created with `published: false` by default
- `PUT /api/posts/:id` - Update a post's title, content, or tags (protected, author only)
  - Request body: `{ "title": "Updated Title", "content": "Updated content", "tags": ["tag1", "tag3"] }`
- `PATCH /api/posts/:id/publish` - Toggle publish status (protected, author only)
- `DELETE /api/posts/:id` - Delete a post (protected, author only)

### Comments

- `GET /api/posts/:postId/comments` - Get all comments for a post with nested replies
- `POST /api/posts/:postId/comments` - Create a new comment or reply (protected)
  - Request body: `{ "content": "Comment text", "parentId": "optional-parent-comment-id" }`
  - If `parentId` is provided, the comment will be a reply to that comment
- `DELETE /api/comments/:id` - Delete a comment (protected)
  - Users can delete their own comments
  - Users with AUTHOR role can delete any comment

### Tags

- `GET /api/tags` - Get all tags
- `POST /api/tags` - Create a new tag (protected, author only)
- `DELETE /api/tags/:id` - Delete a tag (protected, author only) 