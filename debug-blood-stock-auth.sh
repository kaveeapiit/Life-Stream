#!/bin/bash

echo "🔍 DEBUGGING Blood Stock Authentication Issue"
echo "============================================"
echo ""

echo "Testing different hospital endpoints to compare authentication:"
echo ""

BASE_URL="https://life-stream-backend-e8gmhvdgcmcaaxav.centralindia-01.azurewebsites.net"

echo "1️⃣ Testing Blood Inventory (WORKING):"
echo "GET $BASE_URL/api/hospital/inventory"
echo ""

echo "2️⃣ Testing Blood Stock (NOT WORKING):"
echo "GET $BASE_URL/api/hospital/blood-stock"
echo ""

echo "3️⃣ Testing Hospital Dashboard Stats (WORKING?):"
echo "GET $BASE_URL/api/hospital/dashboard/stats"
echo ""

echo "🧪 Let's test manually with curl to see the exact error:"
echo ""

echo "Testing blood-stock endpoint:"
curl -X GET "$BASE_URL/api/hospital/blood-stock" \
  -H "Content-Type: application/json" \
  -v 2>&1 | head -20

echo ""
echo "Testing inventory endpoint:"
curl -X GET "$BASE_URL/api/hospital/inventory" \
  -H "Content-Type: application/json" \
  -v 2>&1 | head -20

echo ""
echo "🔍 The issue might be:"
echo "1. Blood stock route not deployed properly"
echo "2. Database table doesn't exist in Azure PostgreSQL"
echo "3. Session middleware not working for that specific route"
echo "4. Route registration order conflict"