#!/bin/bash

echo "Adding phone column to users table..."

# For local database (if using PostgreSQL locally)
echo "Checking local database..."
if command -v psql &> /dev/null; then
    echo "PostgreSQL found. Updating local database..."
    psql -d lifestream -c "ALTER TABLE users ADD COLUMN IF NOT EXISTS phone TEXT;" 2>/dev/null || echo "Local database update failed or already exists"
fi

# For Azure database
echo "Updating Azure database..."
if [ -f "azure-env-variables.txt" ]; then
    source azure-env-variables.txt
    
    if [ ! -z "$AZURE_DB_CONNECTION_STRING" ]; then
        echo "Using Azure connection string..."
        psql "$AZURE_DB_CONNECTION_STRING" -c "ALTER TABLE users ADD COLUMN IF NOT EXISTS phone TEXT;" || echo "Azure database update failed or already exists"
    else
        echo "Azure connection string not found in azure-env-variables.txt"
    fi
else
    echo "azure-env-variables.txt not found. Please configure Azure database connection."
fi

echo "Phone column update completed!"