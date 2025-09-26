#!/bin/bash

echo "🔍 CHECKING Azure PostgreSQL Database for Blood Stock Table"
echo "=========================================================="
echo ""

echo "Most likely issue: The blood_stock table doesn't exist in Azure PostgreSQL!"
echo ""

echo "AZURE DATABASE CONNECTION INFO:"
echo "Host: life-stream-postgres.postgres.database.azure.com"
echo "User: lifestream_admin"
echo "Database: postgres"
echo "Password: AmmoEka1234"
echo ""

echo "🧪 TO TEST:"
echo "=========="
echo "1. Connect to Azure PostgreSQL:"
echo "   PGPASSWORD='AmmoEka1234' psql -h life-stream-postgres.postgres.database.azure.com -U lifestream_admin -d postgres"
echo ""
echo "2. Check if blood_stock table exists:"
echo "   \dt blood_stock"
echo ""
echo "3. If table doesn't exist, run this query to create it:"
echo ""

cat << 'SQL'
-- Create blood_stock table in Azure PostgreSQL
CREATE TABLE IF NOT EXISTS blood_stock (
    id SERIAL PRIMARY KEY,
    hospital_id INTEGER NOT NULL REFERENCES hospital_users(id),
    blood_type VARCHAR(3) NOT NULL CHECK (blood_type IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
    stock_count INTEGER NOT NULL DEFAULT 0 CHECK (stock_count >= 0 AND stock_count <= 9999),
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(255),
    UNIQUE(hospital_id, blood_type)
);

-- Create trigger to auto-update last_updated timestamp
CREATE OR REPLACE FUNCTION update_blood_stock_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_updated = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_blood_stock_timestamp
    BEFORE UPDATE ON blood_stock
    FOR EACH ROW
    EXECUTE FUNCTION update_blood_stock_timestamp();

-- Initialize sample data (optional)
INSERT INTO blood_stock (hospital_id, blood_type, stock_count, updated_by) VALUES
(1, 'A+', 45, 'system'),
(1, 'A-', 12, 'system'),
(1, 'B+', 38, 'system'),
(1, 'B-', 8, 'system'),
(1, 'AB+', 15, 'system'),
(1, 'AB-', 5, 'system'),
(1, 'O+', 67, 'system'),
(1, 'O-', 23, 'system')
ON CONFLICT (hospital_id, blood_type) DO NOTHING;
SQL

echo ""
echo "💡 LIKELY ROOT CAUSE:"
echo "===================="
echo "- The blood_stock table was created in your LOCAL database"
echo "- But it was NEVER created in the Azure PostgreSQL database"
echo "- That's why you get 401 errors - the SQL queries are failing"
echo "- Other endpoints work because their tables exist in Azure"
echo ""

echo "🚀 QUICK FIX:"
echo "============"
echo "Run the SQL above in Azure PostgreSQL and the blood stock will work immediately!"