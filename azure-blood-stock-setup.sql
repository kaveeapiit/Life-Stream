-- Azure PostgreSQL Blood Stock Table Creation Script
-- Run this in your Azure PostgreSQL database

\echo 'Creating blood_stock table in Azure PostgreSQL...'

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

\echo 'Blood stock table created successfully!'

-- Check if hospital_users table exists and get hospital IDs
\echo 'Available hospitals in the system:'
SELECT id, username FROM hospital_users LIMIT 5;

-- Initialize sample data for first hospital
\echo 'Inserting sample blood stock data...'
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

-- Verify table was created and populated
\echo 'Verifying blood_stock table:'
SELECT 
    hospital_id, 
    blood_type, 
    stock_count, 
    last_updated 
FROM blood_stock 
ORDER BY hospital_id, blood_type;

\echo 'Setup complete! Blood inventory system should now work in Azure.'