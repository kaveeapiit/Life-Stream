#!/bin/bash

echo "🚀 Setting up Life Stream for Azure deployment..."

# Check if Azure CLI is installed
if ! command -v az &> /dev/null; then
    echo "❌ Azure CLI not found. Please install it first:"
    echo "   brew install azure-cli"
    exit 1
fi

# Variables - UPDATE THESE WITH YOUR ACTUAL RESOURCE NAMES
RESOURCE_GROUP="your-resource-group-name"
BACKEND_APP_NAME="life-stream-backend-e8gmhvdgcmcaaxav"
FRONTEND_APP_NAME="polite-coast-092204100"

echo "📋 Setting Azure Backend Environment Variables..."

# Backend Environment Variables
az webapp config appsettings set \
  --name "$BACKEND_APP_NAME" \
  --resource-group "$RESOURCE_GROUP" \
  --settings \
    NODE_ENV=production \
    PORT=8080 \
    DB_USER=lifestream_admin \
    DB_HOST=life-stream-postgres.postgres.database.azure.com \
    DB_NAME=postgres \
    DB_PASSWORD=AmmoEka1234 \
    DB_PORT=5432 \
    SESSION_SECRET=8653fd521f5f33aa65f51afee46e4a6ff58b564a4cebaed63b0b24ae06abb4b3 \
    FRONTEND_URL=https://polite-coast-092204100.1.azurestaticapps.net

echo "✅ Backend environment variables set!"

echo "📋 Setting Azure Static Web App Environment Variables..."

# Frontend Environment Variables (for Static Web Apps, these go in the GitHub repository secrets or staticwebapp.config.json)
echo "⚠️  For Static Web Apps, add this to your GitHub repository secrets:"
echo "   VITE_API_BASE_URL=https://life-stream-backend-e8gmhvdgcmcaaxav.centralindia-01.azurewebsites.net"

echo "✅ Deployment configuration complete!"
echo ""
echo "📋 Next Steps:"
echo "1. Deploy your backend to Azure App Service"
echo "2. Add VITE_API_BASE_URL to your GitHub repository secrets for the Static Web App"
echo "3. Redeploy your frontend"
echo "4. Test the connection using the azure-test.html file"
