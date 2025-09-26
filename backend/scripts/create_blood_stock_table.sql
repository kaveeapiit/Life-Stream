-- Blood Stock Management Table
-- This table stores the current stock count for each blood type per hospital
-- This is separate from blood_inventory which tracks individual donations

CREATE TABLE IF NOT EXISTS blood_stock (
    id SERIAL PRIMARY KEY,
    hospital_id INTEGER NOT NULL,
    blood_type TEXT NOT NULL CHECK (blood_type IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
    stock_count INTEGER NOT NULL DEFAULT 0 CHECK (stock_count >= 0),
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by TEXT,
    UNIQUE(hospital_id, blood_type)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_blood_stock_hospital_id ON blood_stock(hospital_id);
CREATE INDEX IF NOT EXISTS idx_blood_stock_blood_type ON blood_stock(blood_type);

-- Create a trigger to automatically update the last_updated timestamp
CREATE OR REPLACE FUNCTION update_blood_stock_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_updated = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_blood_stock_updated_at
    BEFORE UPDATE ON blood_stock
    FOR EACH ROW
    EXECUTE FUNCTION update_blood_stock_timestamp();

-- Insert initial stock data for all blood types (set to 0 initially)
-- This will be populated when hospitals first access the stock management
-- But we'll add some sample data for existing hospitals

-- Insert sample stock data for hospital_id 1 if it exists
DO $$
DECLARE 
    hospital_count INT;
BEGIN
    -- Check if we have any hospitals
    SELECT COUNT(*) INTO hospital_count FROM hospital_users LIMIT 1;
    
    IF hospital_count > 0 THEN
        -- Insert sample stock for first hospital
        INSERT INTO blood_stock (hospital_id, blood_type, stock_count, updated_by) VALUES
        (1, 'A+', 45, 'system_init'),
        (1, 'A-', 23, 'system_init'),
        (1, 'B+', 67, 'system_init'),
        (1, 'B-', 12, 'system_init'),
        (1, 'AB+', 8, 'system_init'),
        (1, 'AB-', 4, 'system_init'),
        (1, 'O+', 89, 'system_init'),
        (1, 'O-', 34, 'system_init')
        ON CONFLICT (hospital_id, blood_type) DO NOTHING;
        
        -- Add stock for hospital_id 2 if it exists
        IF (SELECT COUNT(*) FROM hospital_users WHERE id = 2) > 0 THEN
            INSERT INTO blood_stock (hospital_id, blood_type, stock_count, updated_by) VALUES
            (2, 'A+', 32, 'system_init'),
            (2, 'A-', 18, 'system_init'),
            (2, 'B+', 41, 'system_init'),
            (2, 'B-', 9, 'system_init'),
            (2, 'AB+', 6, 'system_init'),
            (2, 'AB-', 3, 'system_init'),
            (2, 'O+', 67, 'system_init'),
            (2, 'O-', 25, 'system_init')
            ON CONFLICT (hospital_id, blood_type) DO NOTHING;
        END IF;
    END IF;
END $$;

COMMENT ON TABLE blood_stock IS 'Hospital blood stock counts by blood type - editable by hospital staff';
COMMENT ON COLUMN blood_stock.hospital_id IS 'References hospital_users.id';
COMMENT ON COLUMN blood_stock.blood_type IS 'Blood type (A+, A-, B+, B-, AB+, AB-, O+, O-)';
COMMENT ON COLUMN blood_stock.stock_count IS 'Current stock count for this blood type';
COMMENT ON COLUMN blood_stock.last_updated IS 'Timestamp when stock was last updated';
COMMENT ON COLUMN blood_stock.updated_by IS 'Who updated the stock (username or system)';