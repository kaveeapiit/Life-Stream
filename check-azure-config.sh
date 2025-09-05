#!/bin/bash

echo "=== Life Stream Azure Deployment Diagnostics ==="
echo

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Run this script from the Life-Stream root directory"
    exit 1
fi

echo "📁 Project Structure:"
echo "✅ Found package.json"
[ -f ".env" ] && echo "✅ Found .env" || echo "❌ Missing .env"
[ -f ".env.production" ] && echo "✅ Found .env.production" || echo "❌ Missing .env.production"
[ -f "backend/.env" ] && echo "✅ Found backend/.env" || echo "❌ Missing backend/.env"
[ -f "backend/.env.production" ] && echo "✅ Found backend/.env.production" || echo "❌ Missing backend/.env.production"

echo
echo "🔧 Frontend Configuration:"
echo "Current VITE_API_BASE_URL in .env:"
grep "VITE_API_BASE_URL" .env 2>/dev/null || echo "❌ Not found"

if [ -f ".env.production" ]; then
    echo "Production VITE_API_BASE_URL in .env.production:"
    grep "VITE_API_BASE_URL" .env.production
else
    echo "❌ No .env.production file found"
fi

echo
echo "🔧 Backend Configuration:"
if [ -f "backend/.env" ]; then
    echo "Development FRONTEND_URL:"
    grep "FRONTEND_URL" backend/.env
    echo "Development PORT:"
    grep "PORT" backend/.env
else
    echo "❌ No backend/.env file found"
fi

if [ -f "backend/.env.production" ]; then
    echo "Production FRONTEND_URL:"
    grep "FRONTEND_URL" backend/.env.production
    echo "Production PORT:"
    grep "PORT" backend/.env.production
else
    echo "❌ No backend/.env.production file found"
fi

echo
echo "📋 Next Steps:"
echo "1. Replace YOUR_BACKEND_URL and YOUR_FRONTEND_URL with actual Azure URLs"
echo "2. Update Azure App Service environment variables"
echo "3. Ensure both frontend and backend are using HTTPS in production"
echo "4. Verify database connection in Azure"

echo
echo "🔗 Useful Azure CLI commands:"
echo "az webapp config appsettings list --name YOUR_APP_NAME --resource-group YOUR_RESOURCE_GROUP"
echo "az webapp config appsettings set --name YOUR_APP_NAME --resource-group YOUR_RESOURCE_GROUP --settings VITE_API_BASE_URL=https://YOUR_BACKEND_URL.azurewebsites.net"
