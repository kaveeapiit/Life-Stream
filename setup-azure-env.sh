#!/bin/bash

echo "🔧 Configuring Azure App Service Environment Variables"
echo "===================================================="
echo ""

echo "Your backend is trying to connect to localhost because the Azure database"
echo "environment variables aren't set in your Azure App Service."
echo ""

echo "📋 Required Steps:"
echo ""

echo "1. Go to Azure Portal: https://portal.azure.com"
echo "2. Navigate to your App Service: life-stream-backend-e8gmhvdgcmcaaxav"
echo "3. Go to Settings > Environment variables"
echo "4. Add these environment variables:"
echo ""

echo "🔑 Database Configuration:"
echo "Name: DB_HOST"
echo "Value: life-stream-postgres.postgres.database.azure.com"
echo ""

echo "Name: DB_USER" 
echo "Value: lifestream_admin"
echo ""

echo "Name: DB_NAME"
echo "Value: postgres"
echo ""

echo "Name: DB_PASSWORD"
echo "Value: AmmoEka1234"
echo ""

echo "Name: DB_PORT"
echo "Value: 5432"
echo ""

echo "🔑 Session Configuration:"
echo "Name: SESSION_SECRET"
echo "Value: your-super-secret-session-key-here-make-it-random"
echo ""

echo "🔑 Node Environment:"
echo "Name: NODE_ENV"
echo "Value: production"
echo ""

echo "📝 Alternative: Use Azure CLI to set these automatically"
echo ""
echo "If you have Azure CLI installed, you can run these commands:"
echo ""

cat << 'EOF'
# Set database configuration
az webapp config appsettings set --resource-group your-resource-group --name life-stream-backend-e8gmhvdgcmcaaxav --settings \
  DB_HOST="life-stream-postgres.postgres.database.azure.com" \
  DB_USER="lifestream_admin" \
  DB_NAME="postgres" \
  DB_PASSWORD="AmmoEka1234" \
  DB_PORT="5432" \
  SESSION_SECRET="your-super-secret-session-key-here-make-it-random" \
  NODE_ENV="production"
EOF

echo ""
echo "🔄 After setting these variables:"
echo "1. Your App Service will automatically restart"
echo "2. Test your application login again"
echo "3. It should now connect to Azure PostgreSQL instead of localhost"
echo ""

echo "🧪 To verify the settings are applied:"
echo "Visit: https://life-stream-backend-e8gmhvdgcmcaaxav.centralindia-01.azurewebsites.net/"
echo "You should see your backend responding without connection errors"
echo ""

echo "📋 Manual steps in Azure Portal:"
echo "1. Login to https://portal.azure.com"
echo "2. Search for 'life-stream-backend' in the search bar"
echo "3. Click on your App Service"
echo "4. In the left menu, click 'Environment variables' under Settings"
echo "5. Click '+ Add' to add each environment variable"
echo "6. Save the configuration"
echo "7. The app will restart automatically"
