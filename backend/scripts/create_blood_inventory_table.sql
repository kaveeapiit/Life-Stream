-- Blood Inventory Management Table
-- This table stores blood units in the hospital's inventory

CREATE TABLE blood_inventory (
  id SERIAL PRIMARY KEY,
  donation_id INTEGER REFERENCES donations(id) ON DELETE SET NULL,
  blood_type TEXT NOT NULL CHECK (blood_type IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
  donor_name TEXT NOT NULL,
  donor_email TEXT NOT NULL,
  hospital_id INTEGER NOT NULL, -- References hospital_users.id but no FK constraint as per existing pattern
  expiry_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'Available' CHECK (status IN ('Available', 'Used', 'Expired')),
  used_date TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_blood_inventory_hospital_id ON blood_inventory(hospital_id);
CREATE INDEX idx_blood_inventory_blood_type ON blood_inventory(blood_type);
CREATE INDEX idx_blood_inventory_status ON blood_inventory(status);
CREATE INDEX idx_blood_inventory_expiry_date ON blood_inventory(expiry_date);
CREATE INDEX idx_blood_inventory_donation_id ON blood_inventory(donation_id);

-- Create a trigger to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_blood_inventory_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_blood_inventory_updated_at
    BEFORE UPDATE ON blood_inventory
    FOR EACH ROW
    EXECUTE FUNCTION update_blood_inventory_updated_at();

-- Add a constraint to ensure expiry_date is in the future when creating
ALTER TABLE blood_inventory 
ADD CONSTRAINT check_expiry_date_future 
CHECK (expiry_date > created_at::date);

-- Insert some sample data for testing (optional, remove in production)
-- INSERT INTO blood_inventory (donation_id, blood_type, donor_name, donor_email, hospital_id, expiry_date, status) VALUES
-- (NULL, 'A+', 'John Doe', 'john@example.com', 1, CURRENT_DATE + INTERVAL '30 days', 'Available'),
-- (NULL, 'O-', 'Jane Smith', 'jane@example.com', 1, CURRENT_DATE + INTERVAL '25 days', 'Available'),
-- (NULL, 'B+', 'Bob Wilson', 'bob@example.com', 1, CURRENT_DATE + INTERVAL '5 days', 'Available');
