#!/bin/bash

echo "🩸 AZURE BLOOD STOCK TABLE SETUP"
echo "================================="
echo ""

echo "This script will help you create the missing blood_stock table in Azure PostgreSQL"
echo ""

echo "STEP 1: Test Azure PostgreSQL Connection"
echo "========================================"
echo ""
echo "Run this command to connect to Azure PostgreSQL:"
echo ""
echo "PGPASSWORD='AmmoEka1234' psql -h life-stream-postgres.postgres.database.azure.com -U lifestream_admin -d postgres"
echo ""

echo "STEP 2: Check if blood_stock table exists"
echo "========================================="
echo ""
echo "Once connected, run:"
echo "\\dt blood_stock"
echo ""
echo "If you see 'Did not find any relation named \"blood_stock\"', the table is missing!"
echo ""

echo "STEP 3: Create the blood_stock table"
echo "===================================="
echo ""
echo "If the table is missing, run this SQL:"
echo ""

cat << 'SQL'
-- Create blood_stock table
CREATE TABLE IF NOT EXISTS blood_stock (
    id SERIAL PRIMARY KEY,
    hospital_id INTEGER NOT NULL REFERENCES hospital_users(id),
    blood_type VARCHAR(3) NOT NULL CHECK (blood_type IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
    stock_count INTEGER NOT NULL DEFAULT 0 CHECK (stock_count >= 0 AND stock_count <= 9999),
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(255),
    UNIQUE(hospital_id, blood_type)
);

-- Create trigger function
CREATE OR REPLACE FUNCTION update_blood_stock_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_updated = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger
DROP TRIGGER IF EXISTS update_blood_stock_timestamp ON blood_stock;
CREATE TRIGGER update_blood_stock_timestamp
    BEFORE UPDATE ON blood_stock
    FOR EACH ROW
    EXECUTE FUNCTION update_blood_stock_timestamp();

-- Insert sample data
INSERT INTO blood_stock (hospital_id, blood_type, stock_count, updated_by) VALUES
(1, 'A+', 45, 'azure_setup'),
(1, 'A-', 12, 'azure_setup'),
(1, 'B+', 38, 'azure_setup'),
(1, 'B-', 8, 'azure_setup'),
(1, 'AB+', 15, 'azure_setup'),
(1, 'AB-', 5, 'azure_setup'),
(1, 'O+', 67, 'azure_setup'),
(1, 'O-', 23, 'azure_setup')
ON CONFLICT (hospital_id, blood_type) DO NOTHING;

-- Verify table was created
SELECT * FROM blood_stock ORDER BY hospital_id, blood_type;
SQL

echo ""
echo "STEP 4: Verify the fix"
echo "======================"
echo ""
echo "After creating the table:"
echo "1. Go to your hosted app: https://polite-coast-092204100.1.azurestaticapps.net"
echo "2. Login to hospital dashboard"
echo "3. Navigate to Blood Inventory"
echo "4. Try updating blood stock counts"
echo "5. Should work without 401 errors!"
echo ""

echo "🚀 ALTERNATIVE: Run the complete setup file"
echo "==========================================="
echo ""
echo "You can also run the complete setup by loading the file:"
echo "\\i azure-blood-stock-setup.sql"
echo ""

echo "💡 WHY THIS FIXES THE ISSUE:"
echo "=========================="
echo "- Blood stock API tries to query blood_stock table"
echo "- Table doesn't exist in Azure → SQL error"
echo "- Backend catches error → returns 401 (incorrectly)"
echo "- Frontend sees 401 → shows 'login required'"
echo "- After creating table → queries work → no more 401s!"