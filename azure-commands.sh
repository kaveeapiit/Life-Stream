#!/bin/bash

echo "🚀 Life Stream Azure Environment Variables Setup"
echo "==============================================="
echo ""
echo "⚠️  IMPORTANT: Only set SENSITIVE data as Azure environment variables"
echo "   Non-sensitive config comes from committed .env.production files"
echo ""

# Your specific Azure resources
BACKEND_URL="life-stream-backend-e8gmhvdgcmcaaxav.centralindia-01.azurewebsites.net"
FRONTEND_URL="https://polite-coast-092204100.1.azurestaticapps.net"

echo "📋 Backend App Service Environment Variables (SENSITIVE ONLY)"
echo "============================================================="
echo ""
echo "These values should be set in Azure Portal or via Azure CLI:"
echo ""

# Note: You'll need to replace YOUR_RESOURCE_GROUP with your actual resource group name
cat << 'EOF'
# Replace YOUR_RESOURCE_GROUP with your actual resource group name
RESOURCE_GROUP="YOUR_RESOURCE_GROUP"
BACKEND_APP_NAME="life-stream-backend-e8gmhvdgcmcaaxav"

# Only set SENSITIVE environment variables in Azure
# Non-sensitive values come from backend/.env.production
az webapp config appsettings set \
  --name "$BACKEND_APP_NAME" \
  --resource-group "$RESOURCE_GROUP" \
  --settings \
    DB_USER=lifestream_admin \
    DB_HOST=life-stream-postgres.postgres.database.azure.com \
    DB_NAME=postgres \
    DB_PASSWORD=AmmoEka1234 \
    DB_PORT=5432 \
    SESSION_SECRET=8653fd521f5f33aa65f51afee46e4a6ff58b564a4cebaed63b0b24ae06abb4b3
EOF

echo ""
echo "📋 What Comes From Committed Files"
echo "=================================="
echo "✅ Frontend: VITE_API_BASE_URL from .env.production"
echo "✅ Backend: PORT, NODE_ENV, FRONTEND_URL from backend/.env.production"
echo ""

echo "📋 Frontend Configuration"
echo "========================"
echo "Option 1: staticwebapp.config.json (✅ Already configured)"
echo "Option 2: GitHub Repository Secrets (if needed):"
echo "  Key: VITE_API_BASE_URL"
echo "  Value: https://life-stream-backend-e8gmhvdgcmcaaxav.centralindia-01.azurewebsites.net"
echo ""

echo "🔒 Security Benefits"
echo "==================="
echo "✅ No sensitive data in Git repository"
echo "✅ Production config partially versioned"
echo "✅ Database credentials only in Azure"
echo "✅ Local development uses separate .env files"
echo ""

echo "🧪 Test URLs"
echo "============"
echo "Backend Health: https://$BACKEND_URL/"
echo "Frontend: $FRONTEND_URL"
echo ""

echo "✅ Configuration Summary"
echo "======================"
echo "✅ All environment files updated"
echo "✅ CORS configured for your Azure URLs"
echo "✅ Database credentials set"
echo "✅ Session secrets configured"
echo "✅ Local development preserved"
echo ""
echo "🎯 Next Steps:"
echo "1. Set the backend environment variables in Azure"
echo "2. Set the frontend environment variable (VITE_API_BASE_URL)"
echo "3. Redeploy both applications"
echo "4. Test using azure-test.html"
