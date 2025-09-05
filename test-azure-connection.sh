#!/bin/bash

echo "🔗 Azure PostgreSQL Connection Test"
echo "===================================="
echo ""

AZURE_DB_HOST="life-stream-postgres.postgres.database.azure.com"
AZURE_DB_USER="lifestream_admin"
AZURE_DB_NAME="postgres"
AZURE_DB_PORT="5432"
AZURE_DB_PASSWORD="AmmoEka1234"

echo "Testing connection to Azure PostgreSQL..."
echo "Host: $AZURE_DB_HOST"
echo "User: $AZURE_DB_USER"
echo "Database: $AZURE_DB_NAME"
echo ""

# Test basic connection
echo "🔍 Testing basic connection..."
PGPASSWORD="$AZURE_DB_PASSWORD" psql \
  -h "$AZURE_DB_HOST" \
  -p "$AZURE_DB_PORT" \
  -U "$AZURE_DB_USER" \
  -d "$AZURE_DB_NAME" \
  -c "SELECT 'Connection successful!' as status, version();" \
  --single-transaction

if [ $? -eq 0 ]; then
    echo "✅ Basic connection successful!"
else
    echo "❌ Connection failed!"
    echo ""
    echo "🔧 Troubleshooting tips:"
    echo "1. Check your internet connection"
    echo "2. Verify Azure PostgreSQL firewall rules"
    echo "3. Ensure your IP is allowed in Azure firewall"
    echo "4. Check if the server is running"
    exit 1
fi

echo ""
echo "📊 Checking existing database structure..."

# Check if tables exist
PGPASSWORD="$AZURE_DB_PASSWORD" psql \
  -h "$AZURE_DB_HOST" \
  -p "$AZURE_DB_PORT" \
  -U "$AZURE_DB_USER" \
  -d "$AZURE_DB_NAME" \
  -c "
    SELECT 
      COUNT(*) as table_count,
      string_agg(table_name, ', ') as existing_tables
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_type = 'BASE TABLE';
  "

echo ""
echo "🧪 Testing write permissions..."

# Test if we can create a test table
PGPASSWORD="$AZURE_DB_PASSWORD" psql \
  -h "$AZURE_DB_HOST" \
  -p "$AZURE_DB_PORT" \
  -U "$AZURE_DB_USER" \
  -d "$AZURE_DB_NAME" \
  -c "
    CREATE TABLE IF NOT EXISTS migration_test (
      id SERIAL PRIMARY KEY,
      test_message TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    
    INSERT INTO migration_test (test_message) 
    VALUES ('Migration test successful');
    
    SELECT * FROM migration_test;
    
    DROP TABLE migration_test;
  "

if [ $? -eq 0 ]; then
    echo "✅ Write permissions confirmed!"
else
    echo "❌ Write permission test failed!"
    exit 1
fi

echo ""
echo "🎉 Azure PostgreSQL is ready for migration!"
echo ""
echo "📋 Next steps:"
echo "1. Run database analysis: ./analyze-local-db.sh"
echo "2. Run migration: ./migrate-to-azure.sh"
echo "3. Or follow manual migration guide"
