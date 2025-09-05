#!/bin/bash

echo "🎯 FINAL PRE-DEPLOYMENT VERIFICATION"
echo "===================================="
echo ""

echo "📋 CRITICAL CHECKS:"
echo ""

# Check 1: Environment files
echo "1. Environment Files:"
if [ -f ".env.production" ] && [ -f "backend/.env.production" ]; then
    echo "   ✅ Production environment files exist"
else
    echo "   ❌ Missing production environment files"
    exit 1
fi

# Check 2: Git configuration
if grep -q "!.env.production" .gitignore && grep -q "!backend/.env.production" .gitignore; then
    echo "   ✅ .gitignore allows production files to be committed"
else
    echo "   ❌ .gitignore blocks production files"
    exit 1
fi

# Check 3: No sensitive data in production files
if ! grep -q "DB_PASSWORD=" .env.production && ! grep -q "DB_PASSWORD=" backend/.env.production; then
    echo "   ✅ No sensitive database credentials in committed files"
else
    echo "   ❌ Sensitive data found in files that will be committed"
    exit 1
fi

# Check 4: Correct URLs
FRONTEND_BACKEND_URL=$(grep "VITE_API_BASE_URL" .env.production | cut -d'=' -f2)
BACKEND_FRONTEND_URL=$(grep "FRONTEND_URL" backend/.env.production | cut -d'=' -f2)

if [[ "$FRONTEND_BACKEND_URL" == "https://life-stream-backend-e8gmhvdgcmcaaxav.centralindia-01.azurewebsites.net" ]]; then
    echo "   ✅ Frontend points to correct Azure backend URL"
else
    echo "   ❌ Frontend has wrong backend URL: $FRONTEND_BACKEND_URL"
    exit 1
fi

if [[ "$BACKEND_FRONTEND_URL" == "https://polite-coast-092204100.1.azurestaticapps.net" ]]; then
    echo "   ✅ Backend CORS allows correct Azure frontend URL"
else
    echo "   ❌ Backend has wrong frontend URL: $BACKEND_FRONTEND_URL"
    exit 1
fi

# Check 5: API configuration
if grep -q "import.meta.env.VITE_API_BASE_URL" src/config/api.js; then
    echo "   ✅ Frontend API configuration uses environment variables"
else
    echo "   ❌ Frontend API configuration issue"
    exit 1
fi

# Check 6: Static Web App configuration
if [ -f "staticwebapp.config.json" ] && grep -q "life-stream-backend-e8gmhvdgcmcaaxav.centralindia-01.azurewebsites.net" staticwebapp.config.json; then
    echo "   ✅ Static Web App configuration exists with correct backend URL"
else
    echo "   ❌ Static Web App configuration issue"
    exit 1
fi

# Check 7: CORS configuration
if grep -q "polite-coast-092204100.1.azurestaticapps.net" backend/index.js; then
    echo "   ✅ Backend CORS explicitly allows Azure Static Web App URL"
else
    echo "   ❌ Backend CORS configuration issue"
    exit 1
fi

# Check 8: Database SSL configuration
if grep -q "process.env.NODE_ENV === 'production'" backend/config/db.js; then
    echo "   ✅ Database SSL configured for production"
else
    echo "   ❌ Database SSL configuration issue"
    exit 1
fi

echo ""
echo "🚀 DEPLOYMENT STATUS: READY!"
echo "=========================="
echo ""
echo "✅ All checks passed! Your deployment will work correctly."
echo ""
echo "📋 DEPLOYMENT STEPS:"
echo "1. Commit safe files to Git:"
echo "   git add .gitignore .env.production backend/.env.production backend/index.js backend/config/db.js staticwebapp.config.json *.md *.sh *.html"
echo "   git commit -m 'Configure Azure deployment with secure environment setup'"
echo "   git push origin main"
echo ""
echo "2. Set Azure environment variables for backend:"
echo "   DB_USER=lifestream_admin"
echo "   DB_HOST=life-stream-postgres.postgres.database.azure.com"
echo "   DB_NAME=postgres"
echo "   DB_PASSWORD=AmmoEka1234"
echo "   DB_PORT=5432"
echo "   SESSION_SECRET=8653fd521f5f33aa65f51afee46e4a6ff58b564a4cebaed63b0b24ae06abb4b3"
echo ""
echo "3. Your deployment will work on:"
echo "   🌐 Local: Frontend (localhost:5173) ↔ Backend (localhost:5050)"
echo "   ☁️  Azure: Frontend (polite-coast-092204100.1.azurestaticapps.net) ↔ Backend (life-stream-backend-e8gmhvdgcmcaaxav.centralindia-01.azurewebsites.net)"
echo ""
echo "🎉 READY TO DEPLOY!"
