# 🚀 Life Stream Azure Deployment Guide

## Your Azure Configuration

- **Frontend**: https://polite-coast-092204100.1.azurestaticapps.net
- **Backend**: https://life-stream-backend-e8gmhvdgcmcaaxav.centralindia-01.azurewebsites.net
- **Database**: life-stream-postgres.postgres.database.azure.com

## ✅ Configuration Complete

I've updated all configuration files with your actual Azure URLs and database credentials:

### Files Updated:

- ✅ `.env.production` - Frontend production config
- ✅ `backend/.env.production` - Backend production config
- ✅ `backend/index.js` - CORS configuration updated
- ✅ `staticwebapp.config.json` - Static Web App config
- ✅ `.env.azure` & `backend/.env.azure` - Azure-specific configs

## 🔧 Deployment Steps

### 1. Backend Deployment (Azure App Service)

Set these environment variables in your Azure Backend App Service:

```bash
NODE_ENV=production
PORT=8080
DB_USER=lifestream_admin
DB_HOST=life-stream-postgres.postgres.database.azure.com
DB_NAME=postgres
DB_PASSWORD=AmmoEka1234
DB_PORT=5432
SESSION_SECRET=8653fd521f5f33aa65f51afee46e4a6ff58b564a4cebaed63b0b24ae06abb4b3
FRONTEND_URL=https://polite-coast-092204100.1.azurestaticapps.net
```

**Via Azure Portal:**

1. Go to your App Service → Configuration → Application settings
2. Add each environment variable above

**Via Azure CLI:**

```bash
./deploy-azure.sh
```

### 2. Frontend Deployment (Azure Static Web Apps)

**Option A: Using staticwebapp.config.json (Recommended)**

- The `staticwebapp.config.json` file is already configured
- Just redeploy your frontend

**Option B: GitHub Repository Secrets**
Add this secret to your GitHub repository:

- Key: `VITE_API_BASE_URL`
- Value: `https://life-stream-backend-e8gmhvdgcmcaaxav.centralindia-01.azurewebsites.net`

### 3. Local Development

Your local development will continue to work with:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5050`
- Database: Your local PostgreSQL

## 🧪 Testing

1. **Test Backend Health**:
   Visit: https://life-stream-backend-e8gmhvdgcmcaaxav.centralindia-01.azurewebsites.net

2. **Test Frontend**:
   Visit: https://polite-coast-092204100.1.azurestaticapps.net

3. **Test API Connection**:
   Open `azure-test.html` in a browser

4. **Check Browser Console**:
   - Open Developer Tools (F12)
   - Look for network requests to your backend URL
   - Check for CORS errors

## 🔍 Troubleshooting

### Common Issues:

1. **CORS Errors**

   - ✅ CORS is configured for your frontend URL
   - Check that both apps use HTTPS

2. **Database Connection**

   - ✅ Credentials are set correctly
   - Verify Azure PostgreSQL firewall allows Azure services

3. **Environment Variables**

   - ✅ All variables are configured
   - Restart App Service after setting variables

4. **Build Issues**
   - Frontend: Use `npm run build` with production env
   - Backend: Use `npm start` with NODE_ENV=production

## 📋 Environment Summary

### Development (.env files)

```bash
# Frontend: VITE_API_BASE_URL=http://localhost:5050
# Backend: FRONTEND_URL=http://localhost:5173
```

### Production (Azure)

```bash
# Frontend: VITE_API_BASE_URL=https://life-stream-backend-e8gmhvdgcmcaaxav.centralindia-01.azurewebsites.net
# Backend: FRONTEND_URL=https://polite-coast-092204100.1.azurestaticapps.net
```

## 🎯 Next Actions

1. ✅ All config files updated
2. 🔄 Deploy backend with new environment variables
3. 🔄 Redeploy frontend
4. 🧪 Test using azure-test.html
5. 🎉 Your app should now work on Azure!

The configuration supports both local development and Azure production deployment seamlessly.
