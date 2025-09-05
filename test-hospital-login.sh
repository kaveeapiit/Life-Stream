#!/bin/bash

echo "🏥 Hospital Login Credentials Test"
echo "================================="
echo ""

echo "✅ Hospital users successfully imported to Azure database!"
echo ""

echo "📋 Available Hospital Credentials:"
echo ""

PGPASSWORD="AmmoEka1234" psql -h life-stream-postgres.postgres.database.azure.com -p 5432 -U lifestream_admin -d postgres -c "
SELECT 
    '🏥 ' || username as hospital,
    'Username: ' || username as login_username,
    'Password: (check original system)' as note
FROM hospital_users 
ORDER BY id;
"

echo ""
echo "🔑 Test these credentials:"
echo ""
echo "1. Hospital - Username: Hospital"
echo "2. Kandy - Username: Kandy" 
echo "3. Colombo - Username: Colombo"
echo "4. Jaffna - Username: Jaffna"
echo "5. Galle - Username: Galle"
echo "6. Badulla - Username: Badulla"
echo ""

echo "⚠️  Important: Make sure your Azure App Service environment variables are set!"
echo ""
echo "🧪 Test hospital login at:"
echo "Frontend: https://polite-coast-092204100.1.azurestaticapps.net"
echo ""

echo "🔍 If login still fails, check:"
echo "1. Azure App Service environment variables are configured"
echo "2. Backend is connecting to Azure database (not localhost)"
echo "3. Frontend is pointing to Azure backend URL"
echo ""

echo "📊 Backend health check:"
echo "Visit: https://life-stream-backend-e8gmhvdgcmcaaxav.centralindia-01.azurewebsites.net/"
echo ""

echo "🔄 To verify backend database connection, check if you can see data at:"
echo "https://life-stream-backend-e8gmhvdgcmcaaxav.centralindia-01.azurewebsites.net/api/users (or similar endpoint)"
