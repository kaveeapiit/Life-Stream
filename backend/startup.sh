#!/bin/bash
# Azure App Service startup script for Life-Stream backend

echo "Starting Life-Stream Backend on Azure App Service..."

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm ci --production
fi

# Run database migrations if needed (uncomment if you have migrations)
# echo "Running database migrations..."
# npm run migrate

# Start the application
echo "Starting the application..."
npm start
