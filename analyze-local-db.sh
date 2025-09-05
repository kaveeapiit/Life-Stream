#!/bin/bash

echo "🔍 Local Database Analysis"
echo "=========================="
echo ""

LOCAL_DB_NAME="life-stream"
LOCAL_DB_USER="postgres"

read -p "Enter your LOCAL PostgreSQL password: " -s LOCAL_DB_PASSWORD
echo ""

echo "📊 Analyzing local database structure..."

# Get table list and row counts
PGPASSWORD="$LOCAL_DB_PASSWORD" psql \
  -h localhost \
  -p 5432 \
  -U "$LOCAL_DB_USER" \
  -d "$LOCAL_DB_NAME" \
  -c "
    -- List all tables
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_type = 'BASE TABLE'
    ORDER BY table_name;
  "

echo ""
echo "📈 Table row counts:"

PGPASSWORD="$LOCAL_DB_PASSWORD" psql \
  -h localhost \
  -p 5432 \
  -U "$LOCAL_DB_USER" \
  -d "$LOCAL_DB_NAME" \
  -c "
    SELECT 
      'users' as table_name, 
      COUNT(*) as row_count,
      'User accounts' as description
    FROM users
    UNION ALL
    SELECT 
      'donations', 
      COUNT(*), 
      'Blood donations'
    FROM donations
    UNION ALL
    SELECT 
      'blood_requests', 
      COUNT(*), 
      'Blood requests'
    FROM blood_requests
    UNION ALL
    SELECT 
      'hospital_users', 
      COUNT(*), 
      'Hospital accounts'
    FROM hospital_users
    UNION ALL
    SELECT 
      'admins', 
      COUNT(*), 
      'Admin accounts'
    FROM admins
    UNION ALL
    SELECT 
      'blood_inventory', 
      COUNT(*), 
      'Blood inventory units'
    FROM blood_inventory 
    WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'blood_inventory')
    UNION ALL
    SELECT 
      'hospital_blood_requests', 
      COUNT(*), 
      'Hospital-to-hospital requests'
    FROM hospital_blood_requests 
    WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'hospital_blood_requests')
    ORDER BY table_name;
  "

echo ""
echo "🔗 Database size:"

PGPASSWORD="$LOCAL_DB_PASSWORD" psql \
  -h localhost \
  -p 5432 \
  -U "$LOCAL_DB_USER" \
  -d "$LOCAL_DB_NAME" \
  -c "
    SELECT pg_size_pretty(pg_database_size('$LOCAL_DB_NAME')) as database_size;
  "

echo ""
echo "📋 Sample data preview (users table):"

PGPASSWORD="$LOCAL_DB_PASSWORD" psql \
  -h localhost \
  -p 5432 \
  -U "$LOCAL_DB_USER" \
  -d "$LOCAL_DB_NAME" \
  -c "
    SELECT id, name, email, blood_type, created_at
    FROM users 
    ORDER BY created_at DESC 
    LIMIT 5;
  " 2>/dev/null || echo "No users table or no data"

echo ""
echo "📋 Sample data preview (donations table):"

PGPASSWORD="$LOCAL_DB_PASSWORD" psql \
  -h localhost \
  -p 5432 \
  -U "$LOCAL_DB_USER" \
  -d "$LOCAL_DB_NAME" \
  -c "
    SELECT id, name, blood_type, status, created_at
    FROM donations 
    ORDER BY created_at DESC 
    LIMIT 5;
  " 2>/dev/null || echo "No donations table or no data"

echo ""
echo "✅ Local database analysis complete!"
echo ""
echo "📋 Next steps:"
echo "1. Review the table structure and data above"
echo "2. Run the migration script: ./migrate-to-azure.sh"
echo "3. Or follow the manual migration guide: MANUAL_MIGRATION_GUIDE.md"
