#!/bin/bash
echo "=== Life Stream Environment Configuration Test ==="
echo ""

# Check frontend environment variables
echo "Frontend Environment Variables:"
echo "VITE_API_BASE_URL: ${VITE_API_BASE_URL:-"Not set (will use default)"}"
echo ""

# Check backend environment variables
echo "Backend Environment Variables:"
echo "DATABASE_URL: ${DATABASE_URL:-"Not set"}"
echo "FRONTEND_URL: ${FRONTEND_URL:-"Not set (will use default)"}"
echo "NODE_ENV: ${NODE_ENV:-"Not set (will use default)"}"
echo "PORT: ${PORT:-"Not set (will use default)"}"
echo ""

echo "Environment files found:"
ls -la .env* 2>/dev/null || echo "No .env files found"
echo ""

echo "Configuration Summary:"
echo "- For LOCAL development: Use .env.local with VITE_API_BASE_URL=http://localhost:5050"
echo "- For AZURE production: Use Azure Static Web Apps config with VITE_API_BASE_URL=https://life-stream-backend.azurewebsites.net"
echo "- Backend will automatically use FRONTEND_URL from environment for CORS"
