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

## API Endpoints

- **Users**
  - `POST /api/users/register` - Register a new user
  - `POST /api/users/login` - Login a user
  - `GET /api/users/profile` - Get user profile

- **Posts**
  - `GET /api/posts` - Get all posts
  - `GET /api/posts/:id` - Get a specific post
  - `POST /api/posts` - Create a new post
  - `PUT /api/posts/:id` - Update a post
  - `DELETE /api/posts/:id` - Delete a post

- **Comments**
  - `GET /api/comments/post/:postId` - Get comments for a post
  - `POST /api/comments` - Create a new comment
  - `PUT /api/comments/:id` - Update a comment
  - `DELETE /api/comments/:id` - Delete a comment

- **Tags**
  - `GET /api/tags` - Get all tags
  - `POST /api/tags` - Create a new tag
  - `DELETE /api/tags/:id` - Delete a tag 