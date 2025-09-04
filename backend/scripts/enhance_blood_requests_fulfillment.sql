-- Enhance blood requests table to support fulfillment tracking
-- Add columns for tracking fulfillment status and timestamps

-- Add new columns if they don't exist
ALTER TABLE blood_requests 
ADD COLUMN IF NOT EXISTS fulfilled_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS assigned_hospital VARCHAR(255),
ADD COLUMN IF NOT EXISTS hospital_notes TEXT;

-- Update status values to include new statuses
-- First, we need to check if the constraint exists and drop it
DO $$ 
BEGIN
    -- Check if the constraint exists and drop it
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints 
               WHERE constraint_name = 'blood_requests_status_check' 
               AND table_name = 'blood_requests') THEN
        ALTER TABLE blood_requests DROP CONSTRAINT blood_requests_status_check;
    END IF;
END $$;

-- Add new constraint with additional status values
ALTER TABLE blood_requests 
ADD CONSTRAINT blood_requests_status_check 
CHECK (status IN ('pending', 'approved', 'declined', 'fulfilled', 'cancelled'));

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_blood_requests_status ON blood_requests(status);
CREATE INDEX IF NOT EXISTS idx_blood_requests_assigned_hospital ON blood_requests(assigned_hospital);
CREATE INDEX IF NOT EXISTS idx_blood_requests_fulfilled_at ON blood_requests(fulfilled_at);

-- Add comments for documentation
COMMENT ON COLUMN blood_requests.fulfilled_at IS 'Timestamp when the blood request was fulfilled';
COMMENT ON COLUMN blood_requests.assigned_hospital IS 'Hospital assigned to fulfill this request';
COMMENT ON COLUMN blood_requests.hospital_notes IS 'Notes from the hospital regarding this request';
