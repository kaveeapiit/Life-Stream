#!/bin/bash

echo "🔍 Azure PostgreSQL Connection Diagnostics"
echo "=========================================="
echo ""

AZURE_DB_HOST="life-stream-postgres.postgres.database.azure.com"
AZURE_DB_USER="lifestream_admin"
AZURE_DB_NAME="postgres"
AZURE_DB_PORT="5432"
AZURE_DB_PASSWORD="AmmoEka1234"

echo "Configuration:"
echo "Host: $AZURE_DB_HOST"
echo "Port: $AZURE_DB_PORT"
echo "User: $AZURE_DB_USER"
echo "Database: $AZURE_DB_NAME"
echo ""

# Step 1: Basic network connectivity
echo "🔍 Step 1: Testing network connectivity..."
if command -v nc >/dev/null 2>&1; then
    echo "Testing if port $AZURE_DB_PORT is reachable..."
    timeout 10 nc -z "$AZURE_DB_HOST" "$AZURE_DB_PORT"
    if [ $? -eq 0 ]; then
        echo "✅ Port $AZURE_DB_PORT is reachable"
    else
        echo "❌ Port $AZURE_DB_PORT is NOT reachable"
        echo "This suggests a firewall or network issue"
    fi
else
    echo "⚠️  nc (netcat) not available, skipping port test"
fi

# Step 2: DNS resolution
echo ""
echo "🔍 Step 2: Testing DNS resolution..."
if command -v nslookup >/dev/null 2>&1; then
    nslookup "$AZURE_DB_HOST"
    if [ $? -eq 0 ]; then
        echo "✅ DNS resolution successful"
    else
        echo "❌ DNS resolution failed"
    fi
else
    echo "⚠️  nslookup not available, skipping DNS test"
fi

# Step 3: Test with shorter timeout
echo ""
echo "🔍 Step 3: Testing PostgreSQL connection with timeout..."
echo "This will timeout after 10 seconds to avoid hanging..."

# Test connection with very short timeout
timeout 10 psql \
  -h "$AZURE_DB_HOST" \
  -p "$AZURE_DB_PORT" \
  -U "$AZURE_DB_USER" \
  -d "$AZURE_DB_NAME" \
  -c "SELECT 1;" \
  --no-password \
  2>&1 <<< "$AZURE_DB_PASSWORD"

CONNECTION_RESULT=$?

if [ $CONNECTION_RESULT -eq 0 ]; then
    echo "✅ PostgreSQL connection successful!"
elif [ $CONNECTION_RESULT -eq 124 ]; then
    echo "⏰ Connection timed out after 10 seconds"
    echo "This suggests the connection is hanging due to firewall rules"
else
    echo "❌ Connection failed with exit code: $CONNECTION_RESULT"
fi

echo ""
echo "🔍 Step 4: Testing with different connection methods..."

# Try with different SSL modes
echo "Testing with SSL required..."
timeout 5 psql "postgresql://$AZURE_DB_USER:$AZURE_DB_PASSWORD@$AZURE_DB_HOST:$AZURE_DB_PORT/$AZURE_DB_NAME?sslmode=require" -c "SELECT 1;" 2>/dev/null
if [ $? -eq 0 ]; then
    echo "✅ SSL connection works"
else
    echo "❌ SSL connection failed or timed out"
fi

echo ""
echo "📋 Diagnostic Summary:"
echo "====================="

if [ $CONNECTION_RESULT -eq 124 ] || [ $CONNECTION_RESULT -ne 0 ]; then
    echo ""
    echo "🚨 LIKELY ISSUES:"
    echo "1. **Azure Firewall Rules**: Your IP address may not be allowed"
    echo "2. **Network Security Group**: Azure NSG might be blocking the connection"
    echo "3. **SSL Configuration**: SSL/TLS handshake issues"
    echo "4. **Azure PostgreSQL Server**: Server might be stopped or having issues"
    echo ""
    echo "🔧 SOLUTIONS TO TRY:"
    echo ""
    echo "A. **Check Azure Firewall (Most Common Issue)**:"
    echo "   1. Go to Azure Portal → PostgreSQL Server → Connection Security"
    echo "   2. Add your public IP address to firewall rules"
    echo "   3. Your current public IP: $(curl -s ifconfig.me 2>/dev/null || echo 'Unable to detect')"
    echo ""
    echo "B. **Allow Azure Services**:"
    echo "   1. In Azure Portal → PostgreSQL Server → Connection Security"
    echo "   2. Turn ON 'Allow access to Azure services'"
    echo ""
    echo "C. **Check Server Status**:"
    echo "   1. Verify the PostgreSQL server is running in Azure Portal"
    echo "   2. Check for any maintenance or issues"
    echo ""
    echo "D. **Try Connection from Azure Cloud Shell**:"
    echo "   1. Open Azure Cloud Shell"
    echo "   2. Run: psql -h $AZURE_DB_HOST -p $AZURE_DB_PORT -U $AZURE_DB_USER $AZURE_DB_NAME"
    echo ""
else
    echo "✅ Connection is working! You can proceed with migration."
fi

echo ""
echo "📞 Next Steps:"
echo "1. Fix the firewall/connectivity issue above"
echo "2. Re-run this diagnostic script to verify the fix"
echo "3. Once connection works, run the migration script"
