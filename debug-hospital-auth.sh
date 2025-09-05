#!/bin/bash

echo "🔍 Hospital Authentication Debug Test"
echo "===================================="
echo ""

echo "Testing hospital authentication endpoints to diagnose the issue..."
echo ""

echo "🧪 Test 1: Check Azure backend health"
echo "-------------------------------------"
curl -s "https://life-stream-backend-e8gmhvdgcmcaaxav.centralindia-01.azurewebsites.net/" || echo "Backend not responding"

echo ""
echo ""

echo "🧪 Test 2: Test hospital login"
echo "-----------------------------"
echo "Attempting to login with hospital credentials..."

# Test hospital login
LOGIN_RESPONSE=$(curl -s -X POST \
  -H "Content-Type: application/json" \
  -d '{"username":"Hospital","password":"hospital123"}' \
  -c cookies.txt \
  "https://life-stream-backend-e8gmhvdgcmcaaxav.centralindia-01.azurewebsites.net/api/hospital/login")

echo "Login response: $LOGIN_RESPONSE"

echo ""
echo ""

echo "🧪 Test 3: Test authenticated endpoint"
echo "------------------------------------"
echo "Testing if session persists..."

# Test authenticated endpoint using saved cookies
AUTH_RESPONSE=$(curl -s -b cookies.txt \
  "https://life-stream-backend-e8gmhvdgcmcaaxav.centralindia-01.azurewebsites.net/api/hospital/dashboard/stats")

echo "Dashboard stats response: $AUTH_RESPONSE"

echo ""
echo ""

echo "🧪 Test 4: Check Azure environment variables"
echo "-------------------------------------------"
echo "This will show if your Azure App Service has the right environment variables set:"

ENV_CHECK=$(curl -s "https://life-stream-backend-e8gmhvdgcmcaaxav.centralindia-01.azurewebsites.net/api/debug/env")
echo "Environment check: $ENV_CHECK"

echo ""
echo ""

echo "📋 Analysis:"
echo "============"
echo ""
echo "If you see:"
echo "1. 'connect ECONNREFUSED 127.0.0.1:5432' - Environment variables not set in Azure"
echo "2. '401 Unauthorized' - Session/cookie issues"
echo "3. 'Invalid credentials' - Password mismatch"
echo "4. Connection timeout - Azure backend not running"
echo ""

echo "💡 Solutions:"
echo "============="
echo ""
echo "1. **Environment Variables Issue**:"
echo "   - Go to Azure Portal"
echo "   - Set DB_HOST, DB_USER, DB_PASSWORD, etc. in App Service"
echo ""
echo "2. **Session Cookie Issue**:"
echo "   - Session not persisting across domains"
echo "   - Need to update session configuration for cross-site cookies"
echo ""
echo "3. **Password Issue**:"
echo "   - Check actual hospital passwords in Azure database"
echo ""

echo "🔍 Quick Check: What are the actual hospital passwords?"
echo "======================================================"

# Clean up
rm -f cookies.txt

echo ""
echo "To get actual hospital passwords, run:"
echo "PGPASSWORD=\"AmmoEka1234\" psql -h life-stream-postgres.postgres.database.azure.com -p 5432 -U lifestream_admin -d postgres -c \"SELECT id, username, SUBSTRING(password, 1, 10) || '...' as password_hash FROM hospital_users;\""
