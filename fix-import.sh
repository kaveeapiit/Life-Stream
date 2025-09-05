#!/bin/bash

echo "🔧 Fixed Data Import Script"
echo "=========================="
echo ""

echo "This script will import your data with better error handling and constraint management"
echo ""

cd migration_data

# Function to import table with detailed error handling
import_table_safe() {
    local table_name=$1
    local file_name="${table_name}.csv"
    
    if [ -f "$file_name" ] && [ -s "$file_name" ]; then
        echo "📊 Importing $table_name..."
        
        # Show file info
        local line_count=$(wc -l < "$file_name")
        echo "   File has $line_count lines (including header)"
        
        # Try to import with detailed error output
        PGPASSWORD="AmmoEka1234" psql \
          -h life-stream-postgres.postgres.database.azure.com \
          -p 5432 -U lifestream_admin -d postgres \
          -c "\COPY $table_name FROM STDIN WITH CSV HEADER;" < "$file_name"
        
        local exit_code=$?
        if [ $exit_code -eq 0 ]; then
            echo "✅ $table_name imported successfully"
        else
            echo "❌ $table_name import failed with exit code $exit_code"
            echo "   Let's check the table structure and try to diagnose..."
            
            # Show table structure
            echo "   Table structure:"
            PGPASSWORD="AmmoEka1234" psql \
              -h life-stream-postgres.postgres.database.azure.com \
              -p 5432 -U lifestream_admin -d postgres \
              -c "\d $table_name" 2>/dev/null || echo "   Could not describe table"
            
            echo "   Sample data from CSV:"
            head -3 "$file_name"
            echo ""
        fi
    else
        echo "⚠️ $file_name is empty or doesn't exist"
    fi
    echo ""
}

# Before importing, let's disable foreign key constraints temporarily
echo "🔧 Temporarily disabling constraints for import..."
PGPASSWORD="AmmoEka1234" psql \
  -h life-stream-postgres.postgres.database.azure.com \
  -p 5432 -U lifestream_admin -d postgres \
  -c "
    SET session_replication_role = replica;
    SELECT 'Constraints disabled for this session';
  "

echo ""

# Import tables in dependency order
echo "📊 Starting data import..."
echo ""

# First, import independent tables
import_table_safe "admins"
import_table_safe "users"

# Then dependent tables
import_table_safe "donations"
import_table_safe "blood_requests"
import_table_safe "hospital_users"
import_table_safe "blood_inventory"

# Re-enable constraints
echo "🔧 Re-enabling constraints..."
PGPASSWORD="AmmoEka1234" psql \
  -h life-stream-postgres.postgres.database.azure.com \
  -p 5432 -U lifestream_admin -d postgres \
  -c "
    SET session_replication_role = DEFAULT;
    SELECT 'Constraints re-enabled';
  "

echo ""
echo "🧪 Final verification..."
PGPASSWORD="AmmoEka1234" psql \
  -h life-stream-postgres.postgres.database.azure.com \
  -p 5432 -U lifestream_admin -d postgres \
  -c "
    SELECT 
      schemaname,
      tablename,
      n_tup_ins as inserted_rows,
      n_tup_upd as updated_rows,
      n_tup_del as deleted_rows
    FROM pg_stat_user_tables 
    WHERE schemaname = 'public'
    ORDER BY tablename;
  "

echo ""
echo "📊 Row counts per table:"
PGPASSWORD="AmmoEka1234" psql \
  -h life-stream-postgres.postgres.database.azure.com \
  -p 5432 -U lifestream_admin -d postgres \
  -c "
    SELECT 'users' as table_name, COUNT(*) as row_count FROM users
    UNION ALL
    SELECT 'donations', COUNT(*) FROM donations  
    UNION ALL
    SELECT 'admins', COUNT(*) FROM admins
    UNION ALL
    SELECT 'blood_requests', COUNT(*) FROM blood_requests
    UNION ALL
    SELECT 'hospital_users', COUNT(*) FROM hospital_users
    UNION ALL
    SELECT 'blood_inventory', COUNT(*) FROM blood_inventory
    ORDER BY table_name;
  "

cd ..

echo ""
echo "🎉 Import process completed!"
echo ""
echo "If you still see 0 rows for some tables, let's check the actual errors:"
echo "1. The CSV files have the correct data format"
echo "2. There might be constraint violations we need to fix"
echo "3. Data types might need adjustment"
