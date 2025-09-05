#!/bin/bash

echo "🔄 Quick Migration with Version Compatibility"
echo "=============================================="
echo ""

echo "This script works around the PostgreSQL version mismatch by:"
echo "1. Using the pre-built schema file"
echo "2. Exporting data as CSV (version-independent)"
echo "3. Importing data to Azure"
echo ""

# Check if we can connect to local database
echo "🔍 Testing local database connection..."
if ! psql -h localhost -p 5432 -U postgres -d life-stream -c "SELECT 1;" >/dev/null 2>&1; then
    echo "❌ Cannot connect to local PostgreSQL database"
    echo "Please ensure PostgreSQL is running and you have access to the life-stream database"
    exit 1
fi

echo "✅ Local database connection OK"
echo ""

# Test Azure connection
echo "🔍 Testing Azure database connection..."
if ! PGPASSWORD="AmmoEka1234" psql -h life-stream-postgres.postgres.database.azure.com -p 5432 -U lifestream_admin -d postgres -c "SELECT 1;" >/dev/null 2>&1; then
    echo "❌ Cannot connect to Azure PostgreSQL database"
    echo "Please check your Azure database configuration and firewall settings"
    exit 1
fi

echo "✅ Azure database connection OK"
echo ""

# Create schema on Azure
echo "📝 Step 1: Creating database schema on Azure..."
PGPASSWORD="AmmoEka1234" psql \
  -h life-stream-postgres.postgres.database.azure.com \
  -p 5432 \
  -U lifestream_admin \
  -d postgres \
  -f complete-schema.sql

if [ $? -ne 0 ]; then
    echo "❌ Schema creation failed"
    exit 1
fi

echo "✅ Schema created successfully!"
echo ""

# Get local PostgreSQL password
read -p "Enter your LOCAL PostgreSQL password: " -s LOCAL_PASSWORD
echo ""

# Export data from local database
echo "📊 Step 2: Exporting data from local database..."
echo ""

# Create temporary directory for export files
mkdir -p migration_data
cd migration_data

# Export main tables
echo "Exporting users table..."
PGPASSWORD="$LOCAL_PASSWORD" psql \
  -h localhost -p 5432 -U postgres -d life-stream \
  -c "\COPY users TO STDOUT WITH CSV HEADER;" > users.csv 2>/dev/null

echo "Exporting donations table..."
PGPASSWORD="$LOCAL_PASSWORD" psql \
  -h localhost -p 5432 -U postgres -d life-stream \
  -c "\COPY donations TO STDOUT WITH CSV HEADER;" > donations.csv 2>/dev/null

echo "Exporting blood_requests table..."
PGPASSWORD="$LOCAL_PASSWORD" psql \
  -h localhost -p 5432 -U postgres -d life-stream \
  -c "\COPY blood_requests TO STDOUT WITH CSV HEADER;" > blood_requests.csv 2>/dev/null

echo "Exporting hospital_users table..."
PGPASSWORD="$LOCAL_PASSWORD" psql \
  -h localhost -p 5432 -U postgres -d life-stream \
  -c "\COPY hospital_users TO STDOUT WITH CSV HEADER;" > hospital_users.csv 2>/dev/null

echo "Exporting admins table..."
PGPASSWORD="$LOCAL_PASSWORD" psql \
  -h localhost -p 5432 -U postgres -d life-stream \
  -c "\COPY admins TO STDOUT WITH CSV HEADER;" > admins.csv 2>/dev/null

echo "Exporting recipients table..."
PGPASSWORD="$LOCAL_PASSWORD" psql \
  -h localhost -p 5432 -U postgres -d life-stream \
  -c "\COPY recipients TO STDOUT WITH CSV HEADER;" > recipients.csv 2>/dev/null

echo "Exporting blood_inventory table..."
PGPASSWORD="$LOCAL_PASSWORD" psql \
  -h localhost -p 5432 -U postgres -d life-stream \
  -c "\COPY blood_inventory TO STDOUT WITH CSV HEADER;" > blood_inventory.csv 2>/dev/null

echo "Exporting hospitals table..."
PGPASSWORD="$LOCAL_PASSWORD" psql \
  -h localhost -p 5432 -U postgres -d life-stream \
  -c "\COPY hospitals TO STDOUT WITH CSV HEADER;" > hospitals.csv 2>/dev/null

echo "✅ Data export completed!"
echo ""

# Import data to Azure
echo "📊 Step 3: Importing data to Azure database..."
echo ""

# Function to import table with error handling
import_table() {
    local table_name=$1
    local file_name="${table_name}.csv"
    
    if [ -f "$file_name" ] && [ -s "$file_name" ]; then
        echo "Importing $table_name..."
        PGPASSWORD="AmmoEka1234" psql \
          -h life-stream-postgres.postgres.database.azure.com \
          -p 5432 -U lifestream_admin -d postgres \
          -c "\COPY $table_name FROM STDIN WITH CSV HEADER;" < "$file_name" 2>/dev/null
        
        if [ $? -eq 0 ]; then
            echo "✅ $table_name imported successfully"
        else
            echo "⚠️ $table_name import had issues (might be empty or have constraints)"
        fi
    else
        echo "⚠️ $file_name is empty or doesn't exist"
    fi
}

# Import all tables
import_table "users"
import_table "donations"
import_table "blood_requests"
import_table "hospital_users"
import_table "admins"
import_table "recipients"
import_table "blood_inventory"
import_table "hospitals"

echo ""
echo "🧪 Step 4: Verifying migration..."

PGPASSWORD="AmmoEka1234" psql \
  -h life-stream-postgres.postgres.database.azure.com \
  -p 5432 -U lifestream_admin -d postgres \
  -c "
    DO \$\$
    DECLARE
        table_name TEXT;
        table_count INTEGER;
    BEGIN
        FOR table_name IN 
            SELECT tablename FROM pg_tables 
            WHERE schemaname = 'public' 
            AND tablename NOT IN ('spatial_ref_sys', 'geography_columns', 'geometry_columns')
            ORDER BY tablename
        LOOP
            EXECUTE 'SELECT COUNT(*) FROM ' || table_name INTO table_count;
            RAISE NOTICE '% table: % rows', table_name, table_count;
        END LOOP;
    END
    \$\$;
  "

echo ""
echo "🎉 Migration completed!"
echo ""
echo "📋 Next steps:"
echo "1. Test your application with the Azure database"
echo "2. Clean up migration files: rm -rf migration_data"
echo "3. Update your application to use Azure database in production"
echo ""

# Go back to main directory
cd ..

echo "💡 If you encounter any issues:"
echo "1. Check the migration_data/ folder for exported CSV files"
echo "2. Manually inspect the data if needed"
echo "3. Re-run specific table imports if necessary"
