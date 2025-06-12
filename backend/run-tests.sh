#!/bin/bash

# Set environment variables
export NODE_ENV=test

# Create test database if it doesn't exist
echo "Setting up test database..."
psql -U adityaa -c "CREATE DATABASE blogapi_test;" 2>/dev/null || echo "Database already exists"

# Run migrations on test database
echo "Running migrations..."
npx prisma migrate dev --name test-setup

# Run tests
echo "Running tests..."
npm test

# Show test coverage (if running with coverage)
# npm run test:coverage 