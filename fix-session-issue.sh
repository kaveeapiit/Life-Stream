#!/bin/bash

echo "🔧 Fixing Hospital Dashboard Session Issue"
echo "=========================================="
echo ""

echo "The login works but session doesn't persist to dashboard pages."
echo "This is a cross-domain session cookie issue."
echo ""

echo "🔍 Diagnosing the issue..."
echo ""

# Test if environment variables are set in Azure
echo "1. Testing if Azure environment variables are configured:"
ENV_TEST=$(curl -s "https://life-stream-backend-e8gmhvdgcmcaaxav.centralindia-01.azurewebsites.net/api/debug/env" 2>/dev/null || echo "debug endpoint not available")
echo "Environment variables status: $ENV_TEST"

echo ""

# Test session persistence
echo "2. Testing session persistence:"
echo "   - Logging in..."
LOGIN_RESPONSE=$(curl -s -X POST \
  -H "Content-Type: application/json" \
  -d '{"username":"Hospital","password":"hospital123"}' \
  -c azure_cookies.txt \
  "https://life-stream-backend-e8gmhvdgcmcaaxav.centralindia-01.azurewebsites.net/api/hospital/login")

echo "   Login result: $LOGIN_RESPONSE"

if echo "$LOGIN_RESPONSE" | grep -q "Login successful"; then
    echo "   ✅ Login successful"
    
    echo "   - Testing session with saved cookies..."
    SESSION_TEST=$(curl -s -b azure_cookies.txt \
      "https://life-stream-backend-e8gmhvdgcmcaaxav.centralindia-01.azurewebsites.net/api/hospital/dashboard/stats")
    
    echo "   Session test result: $SESSION_TEST"
    
    if echo "$SESSION_TEST" | grep -q "Unauthorized"; then
        echo "   ❌ Session not persisting - Cookie/CORS issue"
        echo ""
        echo "🔧 SOLUTION NEEDED: Fix session configuration"
    else
        echo "   ✅ Session working with curl"
        echo "   💡 Issue is likely browser cross-domain cookie restrictions"
    fi
else
    echo "   ❌ Login failed"
fi

echo ""

# Clean up
rm -f azure_cookies.txt

echo "📋 Root Cause Analysis:"
echo "======================"
echo ""
echo "The frontend (polite-coast-092204100.1.azurestaticapps.net) and"
echo "backend (life-stream-backend-e8gmhvdgcmcaaxav.centralindia-01.azurewebsites.net)"
echo "are on different domains."
echo ""
echo "Modern browsers block third-party cookies by default."
echo "Even with sameSite: 'none', this can fail if:"
echo "1. Azure App Service environment variables aren't set"
echo "2. SESSION_SECRET isn't consistent"
echo "3. Browser security policies block the cookies"
echo ""

echo "🚀 IMMEDIATE FIXES:"
echo "=================="
echo ""

echo "**Priority 1: Set Azure Environment Variables**"
echo "1. Go to: https://portal.azure.com"
echo "2. Find: life-stream-backend-e8gmhvdgcmcaaxav"
echo "3. Settings → Environment variables"
echo "4. Add these variables:"
echo ""
cat << 'EOF'
DB_HOST=life-stream-postgres.postgres.database.azure.com
DB_USER=lifestream_admin
DB_NAME=postgres
DB_PASSWORD=AmmoEka1234
DB_PORT=5432
SESSION_SECRET=life-stream-azure-secret-key-2025
NODE_ENV=production
EOF

echo ""
echo "**Priority 2: Alternative Authentication Method**"
echo "If session cookies don't work due to browser restrictions,"
echo "we can implement JWT tokens instead of sessions."
echo ""

echo "**Priority 3: Domain Configuration**"
echo "Configure a custom domain so frontend and backend"
echo "can share the same domain for cookies."
echo ""

echo "🧪 QUICK TEST:"
echo "============="
echo ""
echo "After setting Azure environment variables:"
echo "1. Wait 2-3 minutes for app restart"
echo "2. Clear browser cache/cookies"
echo "3. Try hospital login again"
echo "4. Check if dashboard loads properly"
echo ""

echo "If it still doesn't work, we'll implement JWT tokens as backup."
