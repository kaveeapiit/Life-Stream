-- Hospital-to-Hospital Blood Request System
-- Create table for hospitals to request blood from other hospitals

CREATE TABLE IF NOT EXISTS hospital_blood_requests (
    id SERIAL PRIMARY KEY,
    requesting_hospital VARCHAR(100) NOT NULL,
    patient_name VARCHAR(255) NOT NULL,
    patient_id VARCHAR(50),
    blood_type VARCHAR(5) NOT NULL CHECK (blood_type IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
    units_needed INTEGER NOT NULL DEFAULT 1 CHECK (units_needed > 0),
    urgency_level VARCHAR(20) NOT NULL DEFAULT 'normal' CHECK (urgency_level IN ('low', 'normal', 'high', 'critical')),
    medical_condition TEXT,
    contact_details TEXT,
    location VARCHAR(255),
    preferred_hospitals TEXT[], -- Array of preferred hospitals to request from
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'partially_fulfilled', 'fulfilled', 'cancelled', 'expired')),
    
    -- Response tracking
    responding_hospital VARCHAR(100),
    response_status VARCHAR(20) CHECK (response_status IN ('offered', 'confirmed', 'delivered', 'declined')),
    units_offered INTEGER DEFAULT 0,
    response_notes TEXT,
    estimated_delivery_time TIMESTAMP,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_hospital_blood_requests_requesting_hospital ON hospital_blood_requests(requesting_hospital);
CREATE INDEX IF NOT EXISTS idx_hospital_blood_requests_responding_hospital ON hospital_blood_requests(responding_hospital);
CREATE INDEX IF NOT EXISTS idx_hospital_blood_requests_blood_type ON hospital_blood_requests(blood_type);
CREATE INDEX IF NOT EXISTS idx_hospital_blood_requests_status ON hospital_blood_requests(status);
CREATE INDEX IF NOT EXISTS idx_hospital_blood_requests_urgency ON hospital_blood_requests(urgency_level);
CREATE INDEX IF NOT EXISTS idx_hospital_blood_requests_created_at ON hospital_blood_requests(created_at);

-- Add trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_hospital_blood_requests_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER hospital_blood_requests_updated_at_trigger
    BEFORE UPDATE ON hospital_blood_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_hospital_blood_requests_updated_at();

-- Add automatic expiry for critical requests (4 hours) and normal requests (24 hours)
CREATE OR REPLACE FUNCTION set_hospital_blood_request_expiry()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.urgency_level = 'critical' THEN
        NEW.expires_at = NEW.created_at + INTERVAL '4 hours';
    ELSIF NEW.urgency_level = 'high' THEN
        NEW.expires_at = NEW.created_at + INTERVAL '8 hours';
    ELSE
        NEW.expires_at = NEW.created_at + INTERVAL '24 hours';
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER hospital_blood_requests_expiry_trigger
    BEFORE INSERT ON hospital_blood_requests
    FOR EACH ROW
    EXECUTE FUNCTION set_hospital_blood_request_expiry();

-- Add comments for documentation
COMMENT ON TABLE hospital_blood_requests IS 'Hospital-to-hospital blood requests for emergency patient support';
COMMENT ON COLUMN hospital_blood_requests.requesting_hospital IS 'Hospital making the blood request';
COMMENT ON COLUMN hospital_blood_requests.patient_name IS 'Patient name for whom blood is needed';
COMMENT ON COLUMN hospital_blood_requests.patient_id IS 'Patient identifier (optional)';
COMMENT ON COLUMN hospital_blood_requests.blood_type IS 'Required blood type';
COMMENT ON COLUMN hospital_blood_requests.units_needed IS 'Number of blood units needed';
COMMENT ON COLUMN hospital_blood_requests.urgency_level IS 'Urgency: low, normal, high, critical';
COMMENT ON COLUMN hospital_blood_requests.medical_condition IS 'Brief medical condition description';
COMMENT ON COLUMN hospital_blood_requests.preferred_hospitals IS 'Array of preferred hospitals to request from';
COMMENT ON COLUMN hospital_blood_requests.responding_hospital IS 'Hospital that responded to the request';
COMMENT ON COLUMN hospital_blood_requests.response_status IS 'Status of the response: offered, confirmed, delivered, declined';
COMMENT ON COLUMN hospital_blood_requests.units_offered IS 'Number of units offered by responding hospital';
COMMENT ON COLUMN hospital_blood_requests.estimated_delivery_time IS 'When blood units can be delivered';
COMMENT ON COLUMN hospital_blood_requests.expires_at IS 'When this request expires (auto-calculated based on urgency)';
