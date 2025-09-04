#!/bin/bash

# Azure Infrastructure Setup Script for Life-Stream
# This script creates all necessary Azure resources for the Life-Stream application

set -e  # Exit on any error

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration variables - UPDATE THESE VALUES
RESOURCE_GROUP="life-stream-rg"
LOCATION="East US"
POSTGRES_SERVER="life-stream-postgres"
POSTGRES_ADMIN="lifestream_admin"
POSTGRES_PASSWORD="YourSecurePassword123!"
POSTGRES_DB="life-stream"
APP_SERVICE_PLAN="life-stream-plan"
BACKEND_APP_NAME="life-stream-backend"
FRONTEND_APP_NAME="life-stream-frontend"
GITHUB_REPO="https://github.com/YOUR_USERNAME/Life-Stream"  # Update this!

echo -e "${BLUE}🚀 Starting Azure infrastructure setup for Life-Stream...${NC}"

# Function to check if user is logged in to Azure
check_azure_login() {
    echo -e "${YELLOW}Checking Azure login status...${NC}"
    if ! az account show &>/dev/null; then
        echo -e "${RED}❌ You are not logged in to Azure. Please run 'az login' first.${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ Azure login verified${NC}"
}

# Function to create resource group
create_resource_group() {
    echo -e "${YELLOW}Creating resource group: $RESOURCE_GROUP${NC}"
    if az group show --name $RESOURCE_GROUP &>/dev/null; then
        echo -e "${GREEN}✅ Resource group already exists${NC}"
    else
        az group create --name $RESOURCE_GROUP --location "$LOCATION"
        echo -e "${GREEN}✅ Resource group created${NC}"
    fi
}

# Function to create PostgreSQL server and database
create_database() {
    echo -e "${YELLOW}Creating PostgreSQL server: $POSTGRES_SERVER${NC}"
    
    # Check if server already exists
    if az postgres server show --resource-group $RESOURCE_GROUP --name $POSTGRES_SERVER &>/dev/null; then
        echo -e "${GREEN}✅ PostgreSQL server already exists${NC}"
    else
        az postgres server create \
            --resource-group $RESOURCE_GROUP \
            --name $POSTGRES_SERVER \
            --location "$LOCATION" \
            --admin-user $POSTGRES_ADMIN \
            --admin-password "$POSTGRES_PASSWORD" \
            --sku-name GP_Gen5_2 \
            --version 11 \
            --ssl-enforcement Enabled
        echo -e "${GREEN}✅ PostgreSQL server created${NC}"
    fi
    
    # Configure firewall rules
    echo -e "${YELLOW}Configuring firewall rules...${NC}"
    az postgres server firewall-rule create \
        --resource-group $RESOURCE_GROUP \
        --server $POSTGRES_SERVER \
        --name AllowAzureServices \
        --start-ip-address 0.0.0.0 \
        --end-ip-address 0.0.0.0 &>/dev/null || echo "Firewall rule already exists"
    
    # Create database
    echo -e "${YELLOW}Creating database: $POSTGRES_DB${NC}"
    az postgres db create \
        --resource-group $RESOURCE_GROUP \
        --server-name $POSTGRES_SERVER \
        --name $POSTGRES_DB &>/dev/null || echo "Database already exists"
    
    echo -e "${GREEN}✅ Database setup completed${NC}"
}

# Function to create App Service Plan
create_app_service_plan() {
    echo -e "${YELLOW}Creating App Service Plan: $APP_SERVICE_PLAN${NC}"
    
    if az appservice plan show --resource-group $RESOURCE_GROUP --name $APP_SERVICE_PLAN &>/dev/null; then
        echo -e "${GREEN}✅ App Service Plan already exists${NC}"
    else
        az appservice plan create \
            --name $APP_SERVICE_PLAN \
            --resource-group $RESOURCE_GROUP \
            --sku B1 \
            --is-linux
        echo -e "${GREEN}✅ App Service Plan created${NC}"
    fi
}

# Function to create backend App Service
create_backend_app_service() {
    echo -e "${YELLOW}Creating backend App Service: $BACKEND_APP_NAME${NC}"
    
    if az webapp show --resource-group $RESOURCE_GROUP --name $BACKEND_APP_NAME &>/dev/null; then
        echo -e "${GREEN}✅ Backend App Service already exists${NC}"
    else
        az webapp create \
            --resource-group $RESOURCE_GROUP \
            --plan $APP_SERVICE_PLAN \
            --name $BACKEND_APP_NAME \
            --runtime "NODE|18-lts"
        echo -e "${GREEN}✅ Backend App Service created${NC}"
    fi
    
    # Configure environment variables
    echo -e "${YELLOW}Configuring backend environment variables...${NC}"
    DATABASE_URL="postgresql://$POSTGRES_ADMIN:$POSTGRES_PASSWORD@$POSTGRES_SERVER.postgres.database.azure.com:5432/$POSTGRES_DB?sslmode=require"
    
    az webapp config appsettings set \
        --resource-group $RESOURCE_GROUP \
        --name $BACKEND_APP_NAME \
        --settings \
            NODE_ENV=production \
            PORT=8080 \
            DATABASE_URL="$DATABASE_URL" \
            SESSION_SECRET="life-stream-azure-secret-$(date +%s)" \
            FRONTEND_URL="https://$FRONTEND_APP_NAME.azurestaticapps.net"
    
    echo -e "${GREEN}✅ Backend environment variables configured${NC}"
}

# Function to create frontend Static Web App
create_frontend_static_web_app() {
    echo -e "${YELLOW}Creating frontend Static Web App: $FRONTEND_APP_NAME${NC}"
    
    if az staticwebapp show --resource-group $RESOURCE_GROUP --name $FRONTEND_APP_NAME &>/dev/null; then
        echo -e "${GREEN}✅ Static Web App already exists${NC}"
    else
        echo -e "${BLUE}Note: You'll need to configure GitHub integration manually in the Azure Portal${NC}"
        az staticwebapp create \
            --name $FRONTEND_APP_NAME \
            --resource-group $RESOURCE_GROUP \
            --location "East US 2"
        echo -e "${GREEN}✅ Static Web App created${NC}"
    fi
}

# Function to display connection information
display_connection_info() {
    echo -e "\n${GREEN}🎉 Infrastructure setup completed!${NC}"
    echo -e "\n${BLUE}📋 Connection Information:${NC}"
    echo -e "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    DATABASE_URL="postgresql://$POSTGRES_ADMIN:$POSTGRES_PASSWORD@$POSTGRES_SERVER.postgres.database.azure.com:5432/$POSTGRES_DB?sslmode=require"
    
    echo -e "${YELLOW}Database Connection String:${NC}"
    echo "$DATABASE_URL"
    echo ""
    
    echo -e "${YELLOW}Backend URL:${NC}"
    echo "https://$BACKEND_APP_NAME.azurewebsites.net"
    echo ""
    
    echo -e "${YELLOW}Frontend URL:${NC}"
    echo "https://$FRONTEND_APP_NAME.azurestaticapps.net"
    echo ""
    
    echo -e "${BLUE}📝 Next Steps:${NC}"
    echo "1. Configure GitHub Actions secrets:"
    echo "   - Get publish profile: az webapp deployment list-publishing-profiles --resource-group $RESOURCE_GROUP --name $BACKEND_APP_NAME --xml"
    echo "   - Get SWA token: az staticwebapp secrets list --name $FRONTEND_APP_NAME --resource-group $RESOURCE_GROUP"
    echo ""
    echo "2. Update your GitHub repository with these secrets:"
    echo "   - AZURE_WEBAPP_PUBLISH_PROFILE"
    echo "   - AZURE_STATIC_WEB_APPS_API_TOKEN"
    echo ""
    echo "3. Configure Static Web App environment variable:"
    echo "   - VITE_API_BASE_URL=https://$BACKEND_APP_NAME.azurewebsites.net"
    echo ""
    echo "4. Push your code to trigger GitHub Actions deployment"
    echo ""
    echo "5. Import your database using the connection string above"
    echo ""
    echo -e "${GREEN}🔧 For detailed migration steps, see AZURE_DEPLOYMENT_GUIDE.md${NC}"
    echo -e "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
}

# Main execution
main() {
    echo -e "${BLUE}Life-Stream Azure Infrastructure Setup${NC}"
    echo -e "${BLUE}═══════════════════════════════════════${NC}"
    
    # Validation
    if [ "$GITHUB_REPO" = "https://github.com/YOUR_USERNAME/Life-Stream" ]; then
        echo -e "${RED}⚠️  Please update the GITHUB_REPO variable in this script with your actual repository URL${NC}"
        exit 1
    fi
    
    check_azure_login
    create_resource_group
    create_database
    create_app_service_plan
    create_backend_app_service
    create_frontend_static_web_app
    display_connection_info
    
    echo -e "\n${GREEN}🎯 Infrastructure setup completed successfully!${NC}"
}

# Run the main function
main
