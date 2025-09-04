#!/bin/bash
echo "=== Life Stream Environment Configuration Test ==="
echo ""

# Check frontend environment variables
echo "Frontend Environment Variables:"
echo "VITE_API_BASE_URL: ${VITE_API_BASE_URL:-"Not set (will use default)"}"
echo ""

# Check backend environment variables
echo "Backend Environment Variables:"
echo "DB_HOST: ${DB_HOST:-"Not set"}"
echo "DB_PORT: ${DB_PORT:-"Not set"}"
echo "DB_NAME: ${DB_NAME:-"Not set"}"
echo "DB_USER: ${DB_USER:-"Not set"}"
echo "DB_PASSWORD: ${DB_PASSWORD:-"Not set"}"
echo "FRONTEND_URL: ${FRONTEND_URL:-"Not set (will use default)"}"
echo "NODE_ENV: ${NODE_ENV:-"Not set (will use default)"}"
echo "PORT: ${PORT:-"Not set (will use default)"}"
echo ""

echo "Environment files found:"
ls -la .env* 2>/dev/null || echo "No .env files found"
echo ""

echo "Configuration Summary:"
echo "- For LOCAL development: Use .env.local with VITE_API_BASE_URL=http://localhost:5050"
echo "- Backend will automatically use FRONTEND_URL from environment for CORS"
