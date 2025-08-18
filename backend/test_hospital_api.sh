#!/bin/bash

echo "Testing hospital login and available donors endpoint..."

# Step 1: Login as hospital
echo "1. Logging in as hospital..."
LOGIN_RESPONSE=$(curl -s -c cookies.txt -X POST "http://localhost:5050/api/hospital/login" \
  -H "Content-Type: application/json" \
  -d '{"username": "Hospital", "password": "1234"}')

echo "Login response: $LOGIN_RESPONSE"

# Step 2: Test available donors endpoint
echo "2. Testing available donors endpoint..."
DONORS_RESPONSE=$(curl -s -b cookies.txt -X GET "http://localhost:5050/api/hospital/donors/available" \
  -H "Content-Type: application/json")

echo "Donors response: $DONORS_RESPONSE"

# Cleanup
rm -f cookies.txt
