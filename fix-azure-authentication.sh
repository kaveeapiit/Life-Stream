#!/bin/bash

echo "🔧 FIXING Azure Authentication Issues for Blood Inventory System"
echo "=============================================================="
echo ""

echo "❌ The authentication issues are caused by missing environment variables in Azure"
echo "🔧 Let's fix this by setting the correct Azure environment variables"
echo ""

echo "📋 REQUIRED AZURE APP SERVICE ENVIRONMENT VARIABLES:"
echo "===================================================="
echo ""

echo "Go to Azure Portal: https://portal.azure.com"
echo "Navigate to: App Services > life-stream-backend-e8gmhvdgcmcaaxav > Environment variables"
echo ""
echo "Add these environment variables:"
echo ""

echo "🔑 DATABASE CONFIGURATION:"
echo "DB_HOST = life-stream-postgres.postgres.database.azure.com"
echo "DB_USER = lifestream_admin"
echo "DB_NAME = postgres"
echo "DB_PASSWORD = AmmoEka1234"
echo "DB_PORT = 5432"
echo ""

echo "🔑 SESSION CONFIGURATION:"
echo "SESSION_SECRET = life-stream-azure-secret-key-2024"
echo "NODE_ENV = production"
echo ""

echo "🌐 CRITICAL: FRONTEND URL FOR CORS (THIS WAS MISSING!):"
echo "FRONTEND_URL = https://polite-coast-092204100.1.azurestaticapps.net"
echo ""

echo "🚀 ALTERNATIVE: Use Azure CLI to set automatically:"
echo "=================================================="
echo ""

cat << 'EOF'
az webapp config appsettings set \
  --resource-group rg-life-stream \
  --name life-stream-backend-e8gmhvdgcmcaaxav \
  --settings \
    DB_HOST="life-stream-postgres.postgres.database.azure.com" \
    DB_USER="lifestream_admin" \
    DB_NAME="postgres" \
    DB_PASSWORD="AmmoEka1234" \
    DB_PORT="5432" \
    SESSION_SECRET="life-stream-azure-secret-key-2024" \
    NODE_ENV="production" \
    FRONTEND_URL="https://polite-coast-092204100.1.azurestaticapps.net"
EOF

echo ""
echo "✅ AFTER SETTING THESE VARIABLES:"
echo "================================"
echo "1. Azure App Service will automatically restart"
echo "2. CORS will allow your frontend domain"
echo "3. Sessions will work properly with secure cookies"
echo "4. Blood inventory endpoints will authenticate correctly"
echo ""

echo "🧪 TEST AFTER CONFIGURATION:"
echo "============================"
echo "1. Visit: https://polite-coast-092204100.1.azurestaticapps.net"
echo "2. Login to hospital dashboard"
echo "3. Navigate to Blood Inventory section"
echo "4. Try to update blood stock counts"
echo "5. Should work without 401 authentication errors!"
echo ""

echo "🔍 DEBUG URLS TO CHECK:"
echo "======================"
echo "Backend health: https://life-stream-backend-e8gmhvdgcmcaaxav.centralindia-01.azurewebsites.net/"
echo "Frontend app: https://polite-coast-092204100.1.azurestaticapps.net"
echo ""

echo "💡 THE ROOT CAUSE:"
echo "=================="
echo "- The FRONTEND_URL environment variable was missing in Azure"
echo "- This caused CORS to block requests from your frontend"
echo "- Even though you were logged in, API calls were rejected"
echo "- Session cookies weren't being sent properly cross-origin"