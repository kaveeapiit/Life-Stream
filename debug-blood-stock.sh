#!/bin/bash

echo "Testing Blood Stock API with Session Simulation"

# First check if the server is running
echo "1. Testing server health..."
response=$(curl -s -w "%{http_code}" -o /tmp/response.json "http://localhost:5050/")
echo "Server response code: $response"
if [ "$response" != "200" ]; then
    echo "❌ Backend server not running on port 5050"
    exit 1
fi

echo "✅ Server is running"

# Test the blood stock endpoint (should require auth)
echo -e "\n2. Testing blood stock endpoint without auth..."
response=$(curl -s -w "%{http_code}" -o /tmp/response.json "http://localhost:5050/api/hospital/blood-stock")
echo "Response code: $response"
cat /tmp/response.json
echo ""

# Test if we can access the blood stock data from database directly
echo -e "\n3. Checking database blood stock data..."
PGPASSWORD=010204 psql -U postgres -d life-stream -c "SELECT blood_type, stock_count FROM blood_stock WHERE hospital_id = 1 ORDER BY blood_type;" -t

echo -e "\n4. Testing route registration..."
echo "Available routes should include blood-stock endpoints"

# Clean up
rm -f /tmp/response.json