# Azure Deployment Guide for Life-Stream

This guide will help you deploy your Life-Stream application to Microsoft Azure, replacing Railway and Vercel.

## Azure Services Overview

- **Frontend**: Azure Static Web Apps (replaces Vercel)
- **Backend**: Azure App Service (replaces Railway)
- **Database**: Azure Database for PostgreSQL (replaces Railway PostgreSQL)

## Prerequisites

1. Azure account with an active subscription
2. Azure CLI installed locally
3. GitHub repository (for CI/CD)
4. Node.js 18+ installed locally

## Step 1: Database Setup (Azure Database for PostgreSQL)

### 1.1 Create PostgreSQL Server

```bash
# Login to Azure
az login

# Create resource group
az group create --name life-stream-rg --location "East US"

# Create PostgreSQL server
az postgres server create \
  --resource-group life-stream-rg \
  --name life-stream-postgres \
  --location "East US" \
  --admin-user lifestream_admin \
  --admin-password YourSecurePassword123! \
  --sku-name GP_Gen5_2 \
  --version 11
```

### 1.2 Configure Firewall Rules

```bash
# Allow Azure services
az postgres server firewall-rule create \
  --resource-group life-stream-rg \
  --server life-stream-postgres \
  --name AllowAzureServices \
  --start-ip-address 0.0.0.0 \
  --end-ip-address 0.0.0.0

# Allow your local IP (for initial setup)
az postgres server firewall-rule create \
  --resource-group life-stream-rg \
  --server life-stream-postgres \
  --name AllowMyIP \
  --start-ip-address YOUR_IP \
  --end-ip-address YOUR_IP
```

### 1.3 Create Database

```bash
# Create the life-stream database
az postgres db create \
  --resource-group life-stream-rg \
  --server-name life-stream-postgres \
  --name life-stream
```

### 1.4 Get Connection String

```bash
# Get connection string
az postgres server show-connection-string \
  --server-name life-stream-postgres \
  --database-name life-stream \
  --admin-user lifestream_admin \
  --admin-password YourSecurePassword123!
```

## Step 2: Backend Deployment (Azure App Service)

### 2.1 Create App Service Plan

```bash
# Create App Service Plan
az appservice plan create \
  --name life-stream-plan \
  --resource-group life-stream-rg \
  --sku B1 \
  --is-linux
```

### 2.2 Create Web App

```bash
# Create Web App
az webapp create \
  --resource-group life-stream-rg \
  --plan life-stream-plan \
  --name life-stream-backend \
  --runtime "NODE|18-lts" \
  --deployment-local-git
```

### 2.3 Configure Environment Variables

```bash
# Set environment variables
az webapp config appsettings set \
  --resource-group life-stream-rg \
  --name life-stream-backend \
  --settings \
    NODE_ENV=production \
    PORT=8080 \
    DATABASE_URL="postgresql://lifestream_admin:YourSecurePassword123!@life-stream-postgres.postgres.database.azure.com:5432/life-stream?sslmode=require" \
    SESSION_SECRET="your-secure-session-secret" \
    FRONTEND_URL="https://your-static-web-app.azurestaticapps.net"
```

### 2.4 Deploy Backend Code

Option A: Using Azure CLI

```bash
# Navigate to backend directory
cd backend

# Deploy directly
az webapp up \
  --resource-group life-stream-rg \
  --name life-stream-backend \
  --runtime "NODE|18-lts"
```

Option B: Using GitHub Actions (Recommended)

1. Get publish profile:

```bash
az webapp deployment list-publishing-profiles \
  --resource-group life-stream-rg \
  --name life-stream-backend \
  --xml
```

2. Add the XML content as `AZURE_WEBAPP_PUBLISH_PROFILE` secret in GitHub repository
3. The GitHub Action in `.github/workflows/azure-backend-deploy.yml` will handle deployment

## Step 3: Frontend Deployment (Azure Static Web Apps)

### 3.1 Create Static Web App

```bash
# Create Static Web App
az staticwebapp create \
  --name life-stream-frontend \
  --resource-group life-stream-rg \
  --source https://github.com/YOUR_USERNAME/Life-Stream \
  --location "East US 2" \
  --branch main \
  --app-location "/" \
  --output-location "dist"
```

### 3.2 Configure Environment Variables

In Azure Portal:

1. Go to your Static Web App
2. Navigate to Configuration
3. Add environment variable:
   - `VITE_API_BASE_URL` = `https://life-stream-backend.azurewebsites.net`

### 3.3 Get Deployment Token

```bash
# Get deployment token for GitHub Actions
az staticwebapp secrets list \
  --name life-stream-frontend \
  --resource-group life-stream-rg
```

Add the deployment token as `AZURE_STATIC_WEB_APPS_API_TOKEN` secret in GitHub repository.

## Step 4: Database Migration

### 4.1 Export Local Database

```bash
# Export your local database
pg_dump -U postgres -h localhost -d life-stream > life-stream-backup.sql
```

### 4.2 Import to Azure Database

```bash
# Import to Azure PostgreSQL
psql "host=life-stream-postgres.postgres.database.azure.com port=5432 dbname=life-stream user=lifestream_admin password=YourSecurePassword123! sslmode=require" < life-stream-backup.sql
```

## Step 5: Update Application Configuration

### 5.1 Update API Configuration

The API configuration is already set up to use environment variables. Ensure your Azure Static Web App has the correct `VITE_API_BASE_URL`.

### 5.2 Update CORS Configuration

The backend CORS is already configured to use the `FRONTEND_URL` environment variable.

## Step 6: GitHub Secrets Configuration

Add these secrets to your GitHub repository:

1. `AZURE_STATIC_WEB_APPS_API_TOKEN` - From Step 3.3
2. `AZURE_WEBAPP_PUBLISH_PROFILE` - From Step 2.4

## Step 7: Domain Configuration (Optional)

### 7.1 Custom Domain for Frontend

```bash
# Add custom domain to Static Web App
az staticwebapp hostname set \
  --name life-stream-frontend \
  --resource-group life-stream-rg \
  --hostname your-domain.com
```

### 7.2 Custom Domain for Backend

```bash
# Add custom domain to App Service
az webapp config hostname add \
  --resource-group life-stream-rg \
  --webapp-name life-stream-backend \
  --hostname api.your-domain.com
```

## Step 8: Testing Deployment

### 8.1 Test Backend

```bash
curl https://life-stream-backend.azurewebsites.net/
```

### 8.2 Test Frontend

Visit your Static Web App URL in browser.

### 8.3 Test Database Connection

Check Azure App Service logs for database connection status.

## Step 9: Monitoring and Scaling

### 9.1 Enable Application Insights

```bash
# Create Application Insights
az monitor app-insights component create \
  --app life-stream-insights \
  --location "East US" \
  --resource-group life-stream-rg

# Link to App Service
az webapp config appsettings set \
  --resource-group life-stream-rg \
  --name life-stream-backend \
  --settings APPINSIGHTS_INSTRUMENTATIONKEY="your-insights-key"
```

### 9.2 Set up Auto-scaling (Optional)

```bash
# Enable auto-scaling
az monitor autoscale create \
  --resource-group life-stream-rg \
  --resource life-stream-backend \
  --resource-type Microsoft.Web/serverfarms \
  --name life-stream-autoscale \
  --min-count 1 \
  --max-count 3 \
  --count 1
```

## Environment Variables Summary

### Frontend (Azure Static Web Apps)

```
VITE_API_BASE_URL=https://life-stream-backend.azurewebsites.net
```

### Backend (Azure App Service)

```
NODE_ENV=production
PORT=8080
DATABASE_URL=postgresql://username:password@server.postgres.database.azure.com:5432/database?sslmode=require
FRONTEND_URL=https://your-static-web-app.azurestaticapps.net
SESSION_SECRET=your-secure-secret
```

## Cost Optimization Tips

1. **Use B1 App Service Plan** for development/testing
2. **Basic PostgreSQL tier** for small applications
3. **Monitor usage** with Azure Cost Management
4. **Set up budget alerts** to avoid unexpected charges

## Security Considerations

1. **Enable HTTPS only** on App Service
2. **Use Azure Key Vault** for sensitive configuration
3. **Enable Azure AD authentication** (optional)
4. **Configure Content Security Policy** headers
5. **Regular security updates** for dependencies

## Troubleshooting

### Common Issues

1. **Database Connection Issues**

   - Check firewall rules
   - Verify SSL configuration
   - Validate connection string

2. **CORS Errors**

   - Verify FRONTEND_URL environment variable
   - Check Azure Static Web Apps URL

3. **Build Failures**
   - Check Node.js version compatibility
   - Verify package.json scripts
   - Review GitHub Actions logs

### Useful Commands

```bash
# View App Service logs
az webapp log tail --name life-stream-backend --resource-group life-stream-rg

# Restart App Service
az webapp restart --name life-stream-backend --resource-group life-stream-rg

# View Static Web App build logs
az staticwebapp show --name life-stream-frontend --resource-group life-stream-rg
```

## Migration Checklist

- [ ] Azure Database for PostgreSQL created and configured
- [ ] Data migrated from Railway to Azure Database
- [ ] Azure App Service created and deployed
- [ ] Azure Static Web App created and deployed
- [ ] Environment variables configured
- [ ] GitHub Actions secrets added
- [ ] DNS updated (if using custom domains)
- [ ] SSL certificates configured
- [ ] Application tested end-to-end
- [ ] Monitoring and alerts set up
- [ ] Railway and Vercel services decommissioned

## Support and Resources

- [Azure App Service Documentation](https://docs.microsoft.com/en-us/azure/app-service/)
- [Azure Static Web Apps Documentation](https://docs.microsoft.com/en-us/azure/static-web-apps/)
- [Azure Database for PostgreSQL Documentation](https://docs.microsoft.com/en-us/azure/postgresql/)

This completes your migration from Railway + Vercel to Azure. Your local development environment remains unchanged, and you can now host your entire application on Azure.
