-- Life Stream Complete Database Schema
-- Run this on Azure PostgreSQL if you need to create the schema manually

-- =============================================
-- Core User Tables
-- =============================================

-- Users table (donors/recipients)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    blood_type TEXT CHECK (blood_type IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
    location TEXT,
    phone TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Hospital users table
CREATE TABLE IF NOT EXISTS hospital_users (
    id SERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    hospital_name TEXT,
    location TEXT,
    contact_number TEXT,
    email TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admin users table
CREATE TABLE IF NOT EXISTS admins (
    id SERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    email TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- Donation Management
-- =============================================

-- Donations table
CREATE TABLE IF NOT EXISTS donations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    blood_type TEXT NOT NULL CHECK (blood_type IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
    location TEXT,
    status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Declined', 'Collected')),
    notes TEXT,
    approved_by TEXT,
    approved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- Blood Request Management
-- =============================================

-- Blood requests table
CREATE TABLE IF NOT EXISTS blood_requests (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    blood_type TEXT NOT NULL CHECK (blood_type IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
    location TEXT,
    urgency BOOLEAN DEFAULT FALSE,
    medical_condition TEXT,
    contact_number TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'declined', 'fulfilled', 'cancelled')),
    approved BOOLEAN DEFAULT FALSE,
    assigned_hospital VARCHAR(100),
    hospital_notes TEXT,
    priority_level VARCHAR(20) DEFAULT 'normal',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- Blood Inventory Management
-- =============================================

-- Blood inventory table
CREATE TABLE IF NOT EXISTS blood_inventory (
    id SERIAL PRIMARY KEY,
    donation_id INTEGER REFERENCES donations(id) ON DELETE SET NULL,
    blood_type TEXT NOT NULL CHECK (blood_type IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
    donor_name TEXT NOT NULL,
    donor_email TEXT NOT NULL,
    hospital_id INTEGER NOT NULL, -- References hospital_users.id
    expiry_date DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'Available' CHECK (status IN ('Available', 'Used', 'Expired')),
    used_date TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- Hospital-to-Hospital Requests
-- =============================================

-- Hospital blood requests table
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
    preferred_hospitals TEXT[], -- Array of preferred hospitals
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

-- =============================================
-- Donor Request Matching
-- =============================================

-- Donor request matches table
CREATE TABLE IF NOT EXISTS donor_request_matches (
    id SERIAL PRIMARY KEY,
    request_id INTEGER REFERENCES blood_requests(id),
    donor_id INTEGER REFERENCES users(id),
    match_type VARCHAR(50), -- 'exact', 'compatible', 'location'
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'confirmed', 'declined')),
    match_score DECIMAL(3,2), -- Compatibility score
    distance_km DECIMAL(10,2), -- Distance in kilometers
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- Indexes for Performance
-- =============================================

-- Users indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_blood_type ON users(blood_type);
CREATE INDEX IF NOT EXISTS idx_users_location ON users(location);

-- Donations indexes
CREATE INDEX IF NOT EXISTS idx_donations_status ON donations(status);
CREATE INDEX IF NOT EXISTS idx_donations_blood_type ON donations(blood_type);
CREATE INDEX IF NOT EXISTS idx_donations_email ON donations(email);
CREATE INDEX IF NOT EXISTS idx_donations_location ON donations(location);
CREATE INDEX IF NOT EXISTS idx_donations_created_at ON donations(created_at);

-- Blood requests indexes
CREATE INDEX IF NOT EXISTS idx_blood_requests_status ON blood_requests(status);
CREATE INDEX IF NOT EXISTS idx_blood_requests_blood_type ON blood_requests(blood_type);
CREATE INDEX IF NOT EXISTS idx_blood_requests_urgency ON blood_requests(urgency);
CREATE INDEX IF NOT EXISTS idx_blood_requests_assigned_hospital ON blood_requests(assigned_hospital);
CREATE INDEX IF NOT EXISTS idx_blood_requests_created_at ON blood_requests(created_at);

-- Blood inventory indexes
CREATE INDEX IF NOT EXISTS idx_blood_inventory_hospital_id ON blood_inventory(hospital_id);
CREATE INDEX IF NOT EXISTS idx_blood_inventory_blood_type ON blood_inventory(blood_type);
CREATE INDEX IF NOT EXISTS idx_blood_inventory_status ON blood_inventory(status);
CREATE INDEX IF NOT EXISTS idx_blood_inventory_expiry_date ON blood_inventory(expiry_date);
CREATE INDEX IF NOT EXISTS idx_blood_inventory_donation_id ON blood_inventory(donation_id);

-- Hospital blood requests indexes
CREATE INDEX IF NOT EXISTS idx_hospital_requests_requesting_hospital ON hospital_blood_requests(requesting_hospital);
CREATE INDEX IF NOT EXISTS idx_hospital_requests_blood_type ON hospital_blood_requests(blood_type);
CREATE INDEX IF NOT EXISTS idx_hospital_requests_status ON hospital_blood_requests(status);
CREATE INDEX IF NOT EXISTS idx_hospital_requests_urgency ON hospital_blood_requests(urgency_level);
CREATE INDEX IF NOT EXISTS idx_hospital_requests_created_at ON hospital_blood_requests(created_at);

-- =============================================
-- Triggers for Auto-Update Timestamps
-- =============================================

-- Function to update timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER trigger_blood_requests_updated_at
    BEFORE UPDATE ON blood_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_blood_inventory_updated_at
    BEFORE UPDATE ON blood_inventory
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_hospital_blood_requests_updated_at
    BEFORE UPDATE ON hospital_blood_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- Sample Data (Optional - for testing)
-- =============================================

-- Insert sample admin (password: admin123, hashed with bcrypt)
INSERT INTO admins (username, password, email) VALUES 
('admin', '$2b$10$8K1p/a0drtbs6bfygfsCOOXMONQJNgRpbtL8gGjzjvhqGNnCM8aYe', 'admin@lifestream.com')
ON CONFLICT (username) DO NOTHING;

-- Insert sample hospital (password: hospital123, hashed with bcrypt)
INSERT INTO hospital_users (username, password, hospital_name, location, email) VALUES 
('kandy_general', '$2b$10$8K1p/a0drtbs6bfygfsCOOXMONQJNgRpbtL8gGjzjvhqGNnCM8aYe', 'Kandy General Hospital', 'Kandy', 'kandy@hospital.lk')
ON CONFLICT (username) DO NOTHING;

-- =============================================
-- Constraints and Data Validation
-- =============================================

-- Add constraint to ensure expiry_date is in the future for blood inventory
ALTER TABLE blood_inventory 
ADD CONSTRAINT check_expiry_date_future 
CHECK (expiry_date > created_at::date);

-- Add constraint for hospital blood requests expiry
ALTER TABLE hospital_blood_requests 
ADD CONSTRAINT check_expires_at_future 
CHECK (expires_at IS NULL OR expires_at > created_at);

-- =============================================
-- Views for Common Queries (Optional)
-- =============================================

-- View for available blood inventory
CREATE OR REPLACE VIEW available_blood_inventory AS
SELECT 
    bi.*,
    hu.hospital_name,
    hu.location as hospital_location
FROM blood_inventory bi
JOIN hospital_users hu ON bi.hospital_id = hu.id
WHERE bi.status = 'Available' 
AND bi.expiry_date > CURRENT_DATE;

-- View for pending donations with hospital info
CREATE OR REPLACE VIEW pending_donations_with_hospital AS
SELECT 
    d.*,
    hu.hospital_name,
    hu.location as hospital_location
FROM donations d
LEFT JOIN hospital_users hu ON LOWER(d.location) LIKE LOWER('%' || hu.username || '%')
WHERE d.status = 'Pending';

-- =============================================
-- Comments for Documentation
-- =============================================

COMMENT ON TABLE users IS 'Registered users who can donate or request blood';
COMMENT ON TABLE hospital_users IS 'Hospital staff accounts';
COMMENT ON TABLE admins IS 'System administrators';
COMMENT ON TABLE donations IS 'Blood donation requests and their status';
COMMENT ON TABLE blood_requests IS 'Requests for blood from patients/hospitals';
COMMENT ON TABLE blood_inventory IS 'Physical blood units stored in hospitals';
COMMENT ON TABLE hospital_blood_requests IS 'Hospital-to-hospital blood requests';
COMMENT ON TABLE donor_request_matches IS 'Matching system between donors and requests';

-- Schema creation completed successfully
SELECT 'Life Stream database schema created successfully!' as message;
