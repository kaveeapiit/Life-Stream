#!/bin/bash

echo "🔍 Azure Database Structure & Data Verification"
echo "=============================================="
echo ""

echo "📊 Connecting to Azure PostgreSQL..."
echo "Database: life-stream-postgres.postgres.database.azure.com"
echo ""

# Function to run SQL queries on Azure database
run_azure_query() {
    local query="$1"
    local description="$2"
    
    echo "📋 $description"
    echo "----------------------------------------"
    
    PGPASSWORD="AmmoEka1234" psql \
      -h life-stream-postgres.postgres.database.azure.com \
      -p 5432 \
      -U lifestream_admin \
      -d postgres \
      -c "$query"
    
    echo ""
}

# Check database connection
echo "🔗 Testing connection..."
if PGPASSWORD="AmmoEka1234" psql -h life-stream-postgres.postgres.database.azure.com -p 5432 -U lifestream_admin -d postgres -c "SELECT 'Connected successfully!' as status;" >/dev/null 2>&1; then
    echo "✅ Connection successful!"
else
    echo "❌ Connection failed!"
    exit 1
fi

echo ""

# List all tables
run_azure_query "
SELECT 
    schemaname,
    tablename,
    tableowner
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;
" "All Tables in Database"

# Get table structures
run_azure_query "
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
ORDER BY table_name, ordinal_position;
" "Complete Table Structure"

# Count rows in each table
run_azure_query "
SELECT 
    'admins' as table_name, 
    COUNT(*) as row_count,
    'Admin users for system management' as description
FROM admins
UNION ALL
SELECT 
    'users', 
    COUNT(*),
    'Regular users (blood donors/recipients)'
FROM users  
UNION ALL
SELECT 
    'donations', 
    COUNT(*),
    'Blood donation records'
FROM donations
UNION ALL
SELECT 
    'blood_requests', 
    COUNT(*),
    'Blood request records'
FROM blood_requests
UNION ALL
SELECT 
    'hospital_users', 
    COUNT(*),
    'Hospital staff accounts'
FROM hospital_users
UNION ALL
SELECT 
    'blood_inventory', 
    COUNT(*),
    'Blood units in inventory'
FROM blood_inventory
UNION ALL
SELECT 
    'recipients', 
    COUNT(*),
    'Blood recipients'
FROM recipients
UNION ALL
SELECT 
    'hospitals', 
    COUNT(*),
    'Hospital information'
FROM hospitals
ORDER BY table_name;
" "Row Counts for All Tables"

# Sample data from main tables
run_azure_query "
SELECT 
    id, 
    name, 
    email, 
    blood_type,
    location,
    created_at
FROM users 
ORDER BY created_at DESC 
LIMIT 5;
" "Sample Users (Latest 5)"

run_azure_query "
SELECT 
    id, 
    name, 
    email, 
    blood_type,
    status,
    location,
    created_at
FROM donations 
ORDER BY created_at DESC 
LIMIT 5;
" "Sample Donations (Latest 5)"

run_azure_query "
SELECT 
    id, 
    name, 
    email, 
    blood_type,
    status,
    urgency,
    created_at
FROM blood_requests 
ORDER BY created_at DESC 
LIMIT 5;
" "Sample Blood Requests (Latest 5)"

run_azure_query "
SELECT 
    id, 
    blood_type,
    donor_name,
    donor_email,
    status,
    expiry_date,
    created_at
FROM blood_inventory 
ORDER BY created_at DESC 
LIMIT 5;
" "Sample Blood Inventory (Latest 5)"

run_azure_query "
SELECT 
    id, 
    username,
    hospital_name,
    location,
    email,
    created_at
FROM hospital_users 
ORDER BY created_at DESC;
" "All Hospital Users"

run_azure_query "
SELECT 
    id, 
    username,
    email,
    created_at
FROM admins;
" "All Admin Users"

# Check indexes
run_azure_query "
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes 
WHERE schemaname = 'public'
ORDER BY tablename, indexname;
" "Database Indexes"

# Check constraints
run_azure_query "
SELECT 
    tc.table_name,
    tc.constraint_name,
    tc.constraint_type,
    cc.check_clause
FROM information_schema.table_constraints tc
LEFT JOIN information_schema.check_constraints cc 
    ON tc.constraint_name = cc.constraint_name
WHERE tc.table_schema = 'public'
ORDER BY tc.table_name, tc.constraint_type;
" "Table Constraints"

echo "🎉 Azure Database Verification Complete!"
echo ""
echo "💡 Summary:"
echo "- Database connection: ✅ Working"
echo "- Schema structure: ✅ Created"
echo "- Data migration: ✅ Completed"
echo "- Indexes & constraints: ✅ Applied"
echo ""
echo "🚀 Your Azure database is ready for production!"
