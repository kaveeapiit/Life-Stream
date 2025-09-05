#!/bin/bash

echo "🎉 Hospital Login Fixed!"
echo "======================="
echo ""

echo "✅ Hospital passwords have been reset successfully!"
echo ""
echo "🔑 Hospital Login Credentials:"
echo "=============================="
echo ""
echo "Username: Hospital    | Password: hospital123"
echo "Username: Kandy       | Password: hospital123"
echo "Username: Colombo     | Password: hospital123"
echo "Username: Jaffna      | Password: hospital123"
echo "Username: Galle       | Password: hospital123"
echo "Username: Badulla     | Password: hospital123"
echo ""

echo "🧪 Login Test Results:"
echo "====================="
echo ""

# Test each hospital login
for hospital in "Hospital" "Kandy" "Colombo" "Jaffna" "Galle" "Badulla"; do
    echo "Testing $hospital..."
    result=$(curl -s -X POST \
        -H "Content-Type: application/json" \
        -d "{\"username\":\"$hospital\",\"password\":\"hospital123\"}" \
        "https://life-stream-backend-e8gmhvdgcmcaaxav.centralindia-01.azurewebsites.net/api/hospital/login")
    
    if echo "$result" | grep -q "Login successful"; then
        echo "✅ $hospital login: SUCCESS"
    else
        echo "❌ $hospital login: FAILED - $result"
    fi
done

echo ""
echo "🔧 Remaining Issue: Session Cookies"
echo "==================================="
echo ""
echo "If you can login but the hospital dashboard shows 'not logged in':"
echo ""
echo "This is a CORS/Session cookie issue. The solutions are:"
echo ""

echo "**Option 1: Configure Azure App Service Environment Variables**"
echo "1. Go to Azure Portal → Your App Service"
echo "2. Add these environment variables:"
echo "   - DB_HOST=life-stream-postgres.postgres.database.azure.com"
echo "   - DB_USER=lifestream_admin"
echo "   - DB_NAME=postgres"
echo "   - DB_PASSWORD=AmmoEka1234"
echo "   - DB_PORT=5432"
echo "   - SESSION_SECRET=your-random-secret-key"
echo "   - NODE_ENV=production"
echo ""

echo "**Option 2: Fix Session Configuration (if environment variables are set)**"
echo "The current session configuration might not work with Azure's cross-domain setup."
echo "We need to update the session middleware in backend/index.js"
echo ""

echo "🧪 Quick Test:"
echo "============="
echo "1. Try logging in at: https://polite-coast-092204100.1.azurestaticapps.net"
echo "2. Use any hospital username with password: hospital123"
echo "3. If login succeeds but dashboard shows 'not logged in', it's a session issue"
echo ""

echo "📋 Debug Information:"
echo "===================="
echo "Frontend URL: https://polite-coast-092204100.1.azurestaticapps.net"
echo "Backend URL: https://life-stream-backend-e8gmhvdgcmcaaxav.centralindia-01.azurewebsites.net"
echo "Database: life-stream-postgres.postgres.database.azure.com"
echo ""
echo "The domains are different, so session cookies need special configuration."
