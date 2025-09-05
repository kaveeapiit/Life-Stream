#!/bin/bash

echo "🔧 PostgreSQL Version Mismatch Fix"
echo "=================================="
echo ""

echo "🚨 ISSUE: pg_dump version (14.18) doesn't match your PostgreSQL server (17.5)"
echo ""

# Check current versions
echo "📊 Current Version Information:"
echo ""

echo "PostgreSQL Server Version:"
psql -h localhost -p 5432 -U postgres -d life-stream -c "SELECT version();" 2>/dev/null || echo "❌ Cannot connect to local PostgreSQL"

echo ""
echo "pg_dump Version:"
pg_dump --version

echo ""
echo "psql Version:"
psql --version

echo ""
echo "🔧 SOLUTIONS:"
echo ""

echo "Option 1: Upgrade pg_dump to match your PostgreSQL server"
echo "========================================================="
echo ""
echo "# Update PostgreSQL client tools to version 17"
echo "brew update"
echo "brew upgrade postgresql"
echo ""
echo "# Or install PostgreSQL 17 specifically"
echo "brew install postgresql@17"
echo ""
echo "# Add to PATH if needed"
echo "export PATH=\"/opt/homebrew/opt/postgresql@17/bin:\$PATH\""
echo ""

echo "Option 2: Use Docker for consistent versions"
echo "============================================"
echo ""
echo "# Use PostgreSQL 17 Docker container for pg_dump"
echo "docker run --rm -it --network host postgres:17 pg_dump \\"
echo "  -h localhost -p 5432 -U postgres -d life-stream \\"
echo "  --schema-only --no-owner --no-privileges \\"
echo "  > schema.sql"
echo ""

echo "Option 3: Downgrade PostgreSQL server (not recommended)"
echo "======================================================="
echo ""
echo "# This would require reinstalling PostgreSQL"
echo "# Not recommended as it might break existing data"
echo ""

echo "Option 4: Manual schema export (recommended for now)"
echo "==================================================="
echo ""
echo "# We can create the schema manually using the complete-schema.sql file"
echo "# This avoids version compatibility issues"
echo ""

echo "🎯 RECOMMENDED QUICK FIX:"
echo ""
echo "Let's use the pre-built schema file and export only the data:"
echo ""

read -p "Would you like to try the manual schema approach? (y/n): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "🔄 Using manual schema approach..."
    echo ""
    
    # Create the schema on Azure using our complete schema file
    echo "📝 Step 1: Creating schema on Azure using complete-schema.sql..."
    PGPASSWORD="AmmoEka1234" psql \
      -h life-stream-postgres.postgres.database.azure.com \
      -p 5432 \
      -U lifestream_admin \
      -d postgres \
      -f complete-schema.sql
    
    if [ $? -eq 0 ]; then
        echo "✅ Schema created successfully on Azure!"
        echo ""
        
        echo "📊 Step 2: Exporting data from local database..."
        
        # Try to export data with current pg_dump version
        read -p "Enter your LOCAL PostgreSQL password: " -s LOCAL_PASSWORD
        echo ""
        
        # Export each table individually to avoid version issues
        echo "Exporting users table..."
        PGPASSWORD="$LOCAL_PASSWORD" psql \
          -h localhost -p 5432 -U postgres -d life-stream \
          -c "\COPY users TO 'users_data.csv' WITH CSV HEADER;"
        
        echo "Exporting donations table..."
        PGPASSWORD="$LOCAL_PASSWORD" psql \
          -h localhost -p 5432 -U postgres -d life-stream \
          -c "\COPY donations TO 'donations_data.csv' WITH CSV HEADER;"
        
        echo "Exporting other tables..."
        PGPASSWORD="$LOCAL_PASSWORD" psql \
          -h localhost -p 5432 -U postgres -d life-stream \
          -c "\COPY blood_requests TO 'blood_requests_data.csv' WITH CSV HEADER;" 2>/dev/null
        
        PGPASSWORD="$LOCAL_PASSWORD" psql \
          -h localhost -p 5432 -U postgres -d life-stream \
          -c "\COPY hospital_users TO 'hospital_users_data.csv' WITH CSV HEADER;" 2>/dev/null
        
        PGPASSWORD="$LOCAL_PASSWORD" psql \
          -h localhost -p 5432 -U postgres -d life-stream \
          -c "\COPY admins TO 'admins_data.csv' WITH CSV HEADER;" 2>/dev/null
        
        echo ""
        echo "📊 Step 3: Importing data to Azure..."
        
        # Import data to Azure
        echo "Importing users..."
        PGPASSWORD="AmmoEka1234" psql \
          -h life-stream-postgres.postgres.database.azure.com \
          -p 5432 -U lifestream_admin -d postgres \
          -c "\COPY users FROM 'users_data.csv' WITH CSV HEADER;" 2>/dev/null
        
        echo "Importing donations..."
        PGPASSWORD="AmmoEka1234" psql \
          -h life-stream-postgres.postgres.database.azure.com \
          -p 5432 -U lifestream_admin -d postgres \
          -c "\COPY donations FROM 'donations_data.csv' WITH CSV HEADER;" 2>/dev/null
        
        echo "Importing other tables..."
        PGPASSWORD="AmmoEka1234" psql \
          -h life-stream-postgres.postgres.database.azure.com \
          -p 5432 -U lifestream_admin -d postgres \
          -c "\COPY blood_requests FROM 'blood_requests_data.csv' WITH CSV HEADER;" 2>/dev/null
        
        PGPASSWORD="AmmoEka1234" psql \
          -h life-stream-postgres.postgres.database.azure.com \
          -p 5432 -U lifestream_admin -d postgres \
          -c "\COPY hospital_users FROM 'hospital_users_data.csv' WITH CSV HEADER;" 2>/dev/null
        
        PGPASSWORD="AmmoEka1234" psql \
          -h life-stream-postgres.postgres.database.azure.com \
          -p 5432 -U lifestream_admin -d postgres \
          -c "\COPY admins FROM 'admins_data.csv' WITH CSV HEADER;" 2>/dev/null
        
        echo ""
        echo "🧪 Verifying migration..."
        PGPASSWORD="AmmoEka1234" psql \
          -h life-stream-postgres.postgres.database.azure.com \
          -p 5432 -U lifestream_admin -d postgres \
          -c "
            SELECT 'users' as table_name, COUNT(*) as count FROM users
            UNION ALL
            SELECT 'donations', COUNT(*) FROM donations
            UNION ALL
            SELECT 'blood_requests', COUNT(*) FROM blood_requests WHERE EXISTS (SELECT 1 FROM blood_requests LIMIT 1)
            UNION ALL
            SELECT 'hospital_users', COUNT(*) FROM hospital_users WHERE EXISTS (SELECT 1 FROM hospital_users LIMIT 1)
            UNION ALL
            SELECT 'admins', COUNT(*) FROM admins WHERE EXISTS (SELECT 1 FROM admins LIMIT 1)
            ORDER BY table_name;
          "
        
        echo ""
        echo "🎉 Manual migration completed!"
        echo ""
        echo "📋 Cleanup (optional):"
        echo "rm *.csv  # Remove exported CSV files"
        
    else
        echo "❌ Schema creation failed"
    fi
else
    echo ""
    echo "📋 Alternative solutions:"
    echo "1. Upgrade PostgreSQL client tools: brew upgrade postgresql"
    echo "2. Use Docker for migration"
    echo "3. Follow the manual migration guide"
fi

echo ""
echo "💡 For future reference:"
echo "To avoid version mismatches, keep your PostgreSQL client tools updated:"
echo "brew upgrade postgresql"
