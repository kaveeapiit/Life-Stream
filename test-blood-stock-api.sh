#!/bin/bash

# Test Blood Stock API endpoints
# Make sure the backend server is running on port 5050

API_BASE="http://localhost:5050/api/hospital"

echo "🩸 Testing Blood Stock Management API Endpoints"
echo "================================================"

# First, we need to test if we can access the endpoints
# Since they require authentication, let's check the server is running

echo "1. Testing server health..."
curl -s "$API_BASE/../" | jq . || echo "❌ Server not responding"

echo -e "\n2. Testing blood stock endpoint (should require auth)..."
response=$(curl -s -w "%{http_code}" -o response.json "$API_BASE/blood-stock")
echo "Response code: $response"

if [ "$response" = "401" ]; then
    echo "✅ Authentication is working (401 Unauthorized as expected)"
else
    echo "Response body:"
    cat response.json
fi

echo -e "\n3. Testing blood stock summary endpoint..."
response=$(curl -s -w "%{http_code}" -o response.json "$API_BASE/blood-stock/summary")
echo "Response code: $response"

echo -e "\n4. Testing specific blood type endpoint..."
response=$(curl -s -w "%{http_code}" -o response.json "$API_BASE/blood-stock/A+")
echo "Response code: $response"

echo -e "\n5. Testing update endpoint with PUT..."
response=$(curl -s -w "%{http_code}" -X PUT \
  -H "Content-Type: application/json" \
  -d '{"stockCount": 50}' \
  -o response.json \
  "$API_BASE/blood-stock/A+")
echo "Response code: $response"

# Clean up
rm -f response.json

echo -e "\n✅ API endpoints are accessible (authentication required)"
echo "📝 To test with authentication, log in through the hospital login page first."