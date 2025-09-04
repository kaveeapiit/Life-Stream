-- Enhance blood inventory table to support request fulfillment tracking
-- Add columns for tracking blood unit reservations and fulfillment

-- Add new columns
ALTER TABLE blood_inventory 
ADD COLUMN IF NOT EXISTS reserved_for_request_id INTEGER,
ADD COLUMN IF NOT EXISTS fulfilled_request_id INTEGER;

-- Update status check constraint to include 'Reserved'
ALTER TABLE blood_inventory 
DROP CONSTRAINT IF EXISTS blood_inventory_status_check;

ALTER TABLE blood_inventory 
ADD CONSTRAINT blood_inventory_status_check 
CHECK (status IN ('Available', 'Reserved', 'Used', 'Expired'));

-- Create indexes for the new columns
CREATE INDEX IF NOT EXISTS idx_blood_inventory_reserved_for_request_id 
ON blood_inventory(reserved_for_request_id);

CREATE INDEX IF NOT EXISTS idx_blood_inventory_fulfilled_request_id 
ON blood_inventory(fulfilled_request_id);

-- Add comments for documentation
COMMENT ON COLUMN blood_inventory.reserved_for_request_id IS 'ID of the blood request this unit is reserved for';
COMMENT ON COLUMN blood_inventory.fulfilled_request_id IS 'ID of the blood request this unit was used to fulfill';
