# Blog API Backend

A RESTful API for a blog application built with Express.js and Prisma ORM.

## Tech Stack

- Node.js
- Express.js
- PostgreSQL
- Prisma ORM
- JWT Authentication

## Project Structure

```
backend/
├── controllers/    # Request handlers
├── middleware/     # Custom middleware functions
├── prisma/         # Prisma schema and migrations
├── routes/         # API routes
├── utils/          # Utility functions
├── .env            # Environment variables
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
     ```

3. Run database migrations:
   ```
   npx prisma migrate dev
   ```

4. Start the server:
   ```
   npm run dev
   ```

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

- **Auth**
  - `POST /api/auth/signup` - Register a new user
  - `POST /api/auth/login` - Login a user

- **Users**
  - `GET /api/users/profile` - Get user profile (protected)

- **Posts**
  - `GET /api/posts` - Get all posts
  - `GET /api/posts/:id` - Get a specific post
  - `POST /api/posts` - Create a new post (protected, author only)
  - `PUT /api/posts/:id` - Update a post (protected, author only)
  - `DELETE /api/posts/:id` - Delete a post (protected, author only)

- **Comments**
  - `GET /api/comments/post/:postId` - Get comments for a post
  - `POST /api/comments` - Create a new comment (protected)
  - `PUT /api/comments/:id` - Update a comment (protected)
  - `DELETE /api/comments/:id` - Delete a comment (protected)

- **Tags**
  - `GET /api/tags` - Get all tags
  - `POST /api/tags` - Create a new tag (protected, author only)
  - `DELETE /api/tags/:id` - Delete a tag (protected, author only) 