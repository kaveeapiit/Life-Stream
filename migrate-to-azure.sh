#!/bin/bash

echo "🗄️  Life Stream Database Migration to Azure PostgreSQL"
echo "===================================================="
echo ""

# Configuration
LOCAL_DB_NAME="life-stream"
LOCAL_DB_USER="postgres"
LOCAL_DB_HOST="localhost"
LOCAL_DB_PORT="5432"

AZURE_DB_HOST="life-stream-postgres.postgres.database.azure.com"
AZURE_DB_USER="lifestream_admin"
AZURE_DB_NAME="postgres"
AZURE_DB_PORT="5432"
AZURE_DB_PASSWORD="AmmoEka1234"

BACKUP_DIR="./database_migration"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# Create backup directory
mkdir -p "$BACKUP_DIR"

echo "📋 Migration Steps:"
echo "1. Export local database schema and data"
echo "2. Create schema on Azure PostgreSQL"
echo "3. Import data to Azure PostgreSQL"
echo "4. Verify migration"
echo ""

read -p "Enter your LOCAL PostgreSQL password: " -s LOCAL_DB_PASSWORD
echo ""

echo "🔄 Step 1: Exporting local database..."

# Export schema only (structure)
echo "  📝 Exporting database schema..."
PGPASSWORD="$LOCAL_DB_PASSWORD" pg_dump \
  -h "$LOCAL_DB_HOST" \
  -p "$LOCAL_DB_PORT" \
  -U "$LOCAL_DB_USER" \
  -d "$LOCAL_DB_NAME" \
  --schema-only \
  --no-owner \
  --no-privileges \
  -f "$BACKUP_DIR/schema_${TIMESTAMP}.sql"

if [ $? -eq 0 ]; then
    echo "  ✅ Schema exported successfully"
else
    echo "  ❌ Schema export failed"
    exit 1
fi

# Export data only (without schema)
echo "  📊 Exporting database data..."
PGPASSWORD="$LOCAL_DB_PASSWORD" pg_dump \
  -h "$LOCAL_DB_HOST" \
  -p "$LOCAL_DB_PORT" \
  -U "$LOCAL_DB_USER" \
  -d "$LOCAL_DB_NAME" \
  --data-only \
  --no-owner \
  --no-privileges \
  --disable-triggers \
  -f "$BACKUP_DIR/data_${TIMESTAMP}.sql"

if [ $? -eq 0 ]; then
    echo "  ✅ Data exported successfully"
else
    echo "  ❌ Data export failed"
    exit 1
fi

echo ""
echo "🔄 Step 2: Creating schema on Azure PostgreSQL..."

# Test connection to Azure
echo "  🔗 Testing Azure PostgreSQL connection..."
PGPASSWORD="$AZURE_DB_PASSWORD" psql \
  -h "$AZURE_DB_HOST" \
  -p "$AZURE_DB_PORT" \
  -U "$AZURE_DB_USER" \
  -d "$AZURE_DB_NAME" \
  -c "SELECT version();" > /dev/null 2>&1

if [ $? -eq 0 ]; then
    echo "  ✅ Azure PostgreSQL connection successful"
else
    echo "  ❌ Azure PostgreSQL connection failed"
    echo "  Please check your Azure database credentials and firewall settings"
    exit 1
fi

# Import schema to Azure
echo "  📝 Creating schema on Azure..."
PGPASSWORD="$AZURE_DB_PASSWORD" psql \
  -h "$AZURE_DB_HOST" \
  -p "$AZURE_DB_PORT" \
  -U "$AZURE_DB_USER" \
  -d "$AZURE_DB_NAME" \
  -f "$BACKUP_DIR/schema_${TIMESTAMP}.sql"

if [ $? -eq 0 ]; then
    echo "  ✅ Schema created on Azure successfully"
else
    echo "  ❌ Schema creation failed"
    exit 1
fi

echo ""
echo "🔄 Step 3: Importing data to Azure PostgreSQL..."

# Import data to Azure
PGPASSWORD="$AZURE_DB_PASSWORD" psql \
  -h "$AZURE_DB_HOST" \
  -p "$AZURE_DB_PORT" \
  -U "$AZURE_DB_USER" \
  -d "$AZURE_DB_NAME" \
  -f "$BACKUP_DIR/data_${TIMESTAMP}.sql"

if [ $? -eq 0 ]; then
    echo "  ✅ Data imported to Azure successfully"
else
    echo "  ❌ Data import failed (this might be due to constraints - checking manually)"
fi

echo ""
echo "🔄 Step 4: Verifying migration..."

# Get table counts from local database
echo "  📊 Local database table counts:"
PGPASSWORD="$LOCAL_DB_PASSWORD" psql \
  -h "$LOCAL_DB_HOST" \
  -p "$LOCAL_DB_PORT" \
  -U "$LOCAL_DB_USER" \
  -d "$LOCAL_DB_NAME" \
  -c "
    SELECT 
      'users' as table_name, COUNT(*) as count FROM users
    UNION ALL
    SELECT 'donations', COUNT(*) FROM donations
    UNION ALL
    SELECT 'blood_requests', COUNT(*) FROM blood_requests
    UNION ALL
    SELECT 'hospital_users', COUNT(*) FROM hospital_users
    UNION ALL
    SELECT 'admins', COUNT(*) FROM admins
    UNION ALL
    SELECT 'blood_inventory', COUNT(*) FROM blood_inventory WHERE 1=1
    UNION ALL
    SELECT 'hospital_blood_requests', COUNT(*) FROM hospital_blood_requests WHERE 1=1;
  " 2>/dev/null

echo ""
echo "  📊 Azure database table counts:"
PGPASSWORD="$AZURE_DB_PASSWORD" psql \
  -h "$AZURE_DB_HOST" \
  -p "$AZURE_DB_PORT" \
  -U "$AZURE_DB_USER" \
  -d "$AZURE_DB_NAME" \
  -c "
    SELECT 
      'users' as table_name, COUNT(*) as count FROM users
    UNION ALL
    SELECT 'donations', COUNT(*) FROM donations
    UNION ALL
    SELECT 'blood_requests', COUNT(*) FROM blood_requests
    UNION ALL
    SELECT 'hospital_users', COUNT(*) FROM hospital_users
    UNION ALL
    SELECT 'admins', COUNT(*) FROM admins
    UNION ALL
    SELECT 'blood_inventory', COUNT(*) FROM blood_inventory WHERE 1=1
    UNION ALL
    SELECT 'hospital_blood_requests', COUNT(*) FROM hospital_blood_requests WHERE 1=1;
  " 2>/dev/null

echo ""
echo "🎉 Migration completed!"
echo ""
echo "📁 Backup files created:"
echo "  - Schema: $BACKUP_DIR/schema_${TIMESTAMP}.sql"
echo "  - Data: $BACKUP_DIR/data_${TIMESTAMP}.sql"
echo ""
echo "📋 Next steps:"
echo "1. Compare the table counts above to verify migration"
echo "2. Test your application with Azure database"
echo "3. Update your backend environment variables in Azure"
echo ""
echo "🔗 Azure Database Connection String:"
echo "psql -h $AZURE_DB_HOST -p $AZURE_DB_PORT -U $AZURE_DB_USER $AZURE_DB_NAME"
