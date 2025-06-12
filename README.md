# Blog Platform

A full-stack blog platform with separate interfaces for readers and authors.

**Live Demo:** [https://blog-platform-demo.example.com](https://blog-platform-demo.example.com) (Coming soon)

## Project Overview

This project is a complete blog platform consisting of three main components:

1. **Backend API** - RESTful API built with Express.js, Prisma, and PostgreSQL
2. **Author Frontend** - Admin interface for content creators to manage posts and comments
3. **Reader Frontend** - Public-facing website for readers to browse and interact with blog content

## Features

### Backend API
- RESTful API with Express.js
- PostgreSQL database with Prisma ORM
- JWT-based authentication
- Role-based access control (authors vs. readers)
- CORS enabled for cross-origin requests
- Comprehensive test suite

### Author Frontend
- Secure authentication system
- Dashboard for post management
- Rich text editor (TinyMCE) for content creation
- Comment moderation tools
- Post publishing/unpublishing functionality
- Responsive Material UI design

### Reader Frontend
- Clean, responsive design
- Post listing with pagination
- Individual post view
- Nested comment system
- Tag-based filtering

## Tech Stack

- **Backend**: Node.js, Express, Prisma, PostgreSQL, JWT
- **Author Frontend**: React, Material UI, TinyMCE, React Router
- **Reader Frontend**: React, Vite, CSS Modules

## Local Development

### Prerequisites
- Node.js (v16+)
- PostgreSQL
- npm or yarn

### Setup

1. Clone the repository:
   ```
   git clone https://github.com/bit2swaz/blog-api.git
   cd blog-api
   ```

2. Backend setup:
   ```
   cd backend
   npm install
   cp .env.example .env
   # Update .env with your database credentials
   npx prisma migrate dev
   npm run dev
   ```

3. Author frontend setup:
   ```
   cd frontend-author
   npm install
   cp .env.example .env
   # Update .env with your backend API URL
   npm start
   ```

4. Reader frontend setup:
   ```
   cd frontend-reader
   npm install
   cp .env.example .env
   # Update .env with your backend API URL
   npm run dev
   ```

## API Documentation

The API documentation is available at `/api-docs` when running the backend server.

## Deployment

The application is deployed on:
- Backend: [Railway](https://railway.app)
- Frontend: [Vercel](https://vercel.com)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Express.js](https://expressjs.com/)
- [React](https://reactjs.org/)
- [Prisma](https://www.prisma.io/)
- [Material UI](https://mui.com/)
- [TinyMCE](https://www.tiny.cloud/)