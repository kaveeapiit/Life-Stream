-- Enhanced Blood Request Management Schema Updates
-- Add new columns to support hospital blood request management

-- Add hospital assignment and notes columns
ALTER TABLE blood_requests 
ADD COLUMN IF NOT EXISTS assigned_hospital VARCHAR(100),
ADD COLUMN IF NOT EXISTS hospital_notes TEXT,
ADD COLUMN IF NOT EXISTS priority_level VARCHAR(20) DEFAULT 'normal',
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Update status column to include more statuses
-- Note: This will preserve existing data
-- Possible values: 'pending', 'approved', 'declined', 'fulfilled', 'cancelled'

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_blood_requests_status ON blood_requests(status);
CREATE INDEX IF NOT EXISTS idx_blood_requests_blood_type ON blood_requests(blood_type);
CREATE INDEX IF NOT EXISTS idx_blood_requests_urgency ON blood_requests(urgency);
CREATE INDEX IF NOT EXISTS idx_blood_requests_assigned_hospital ON blood_requests(assigned_hospital);
CREATE INDEX IF NOT EXISTS idx_blood_requests_created_at ON blood_requests(created_at);

-- Add trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_blood_requests_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER blood_requests_updated_at_trigger
    BEFORE UPDATE ON blood_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_blood_requests_updated_at();

COMMENT ON TABLE blood_requests IS 'Enhanced blood requests table with hospital management features';
COMMENT ON COLUMN blood_requests.assigned_hospital IS 'Hospital assigned to handle this request';
COMMENT ON COLUMN blood_requests.hospital_notes IS 'Notes added by hospital staff';
COMMENT ON COLUMN blood_requests.priority_level IS 'Priority level: low, normal, high, critical';
COMMENT ON COLUMN blood_requests.updated_at IS 'Last update timestamp';
