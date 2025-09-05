# Azure Deployment Configuration Guide

## Problem: Frontend Not Fetching Backend Data

The issue occurs because your frontend and backend are using localhost URLs instead of Azure URLs. Here's how to fix it:

## Step 1: Configure Frontend for Azure

1. Update your `.env.production` file with your actual Azure backend URL:

```bash
VITE_API_BASE_URL=https://YOUR_BACKEND_URL.azurewebsites.net
```

2. When building for production, use:

```bash
npm run build
```

## Step 2: Configure Backend for Azure

1. Update your `backend/.env.production` file with your Azure URLs:

```bash
# Production Database Configuration
DB_USER=your_azure_db_user
DB_HOST=your_azure_db_host
DB_NAME=life-stream
DB_PASSWORD=your_azure_db_password
DB_PORT=5432

# Session Configuration
SESSION_SECRET=your-production-secret-key

# Server Configuration
PORT=8080
NODE_ENV=production

# Frontend URL for CORS
FRONTEND_URL=https://YOUR_FRONTEND_URL.azurewebsites.net
```

## Step 3: Azure Environment Variables

In your Azure App Service, set these environment variables:

### For Frontend App Service:

- `VITE_API_BASE_URL`: `https://YOUR_BACKEND_URL.azurewebsites.net`

### For Backend App Service:

- `NODE_ENV`: `production`
- `PORT`: `8080`
- `FRONTEND_URL`: `https://YOUR_FRONTEND_URL.azurewebsites.net`
- `DB_USER`: Your Azure database username
- `DB_HOST`: Your Azure database host
- `DB_NAME`: `life-stream`
- `DB_PASSWORD`: Your Azure database password
- `DB_PORT`: `5432`
- `SESSION_SECRET`: A secure random string

## Step 4: Database Setup

If you haven't already, create an Azure Database for PostgreSQL and run your database migrations.

## Step 5: Test the Connection

1. Open your Azure frontend URL
2. Open browser developer tools (F12)
3. Check the Network tab for API requests
4. Verify that requests are going to your Azure backend URL

## Common Issues and Solutions

### CORS Errors

- Ensure `FRONTEND_URL` in backend matches your frontend Azure URL exactly
- Check that both apps are using HTTPS

### Session/Authentication Issues

- Verify that `secure` cookies are enabled in production
- Check that `sameSite: 'none'` is set for cross-site requests

### Database Connection Issues

- Verify database credentials in Azure
- Check firewall rules to allow Azure services
- Test database connection independently

## Verification Steps

1. Visit your frontend URL and check if data loads
2. Check backend health endpoint: `https://YOUR_BACKEND_URL.azurewebsites.net/`
3. Monitor Azure logs for any errors

## Build Commands for Azure

### Frontend:

```bash
npm install
npm run build
```

### Backend:

```bash
npm install
npm start
```

The updated backend code now properly handles:

- HTTPS in production
- Cross-site cookies for Azure
- Multiple allowed origins for flexibility
- Production-specific session configuration
