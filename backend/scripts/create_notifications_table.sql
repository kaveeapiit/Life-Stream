-- Create notifications table for the notification system
CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,  -- Optional reference to users table
    email VARCHAR(255) NOT NULL,  -- User email for notifications
    type VARCHAR(50) NOT NULL,  -- notification type: 'donation_approved', 'donation_declined', 'blood_request_fulfilled', etc.
    title VARCHAR(255) NOT NULL,  -- Notification title
    message TEXT NOT NULL,  -- Notification message/content
    related_id INTEGER,  -- ID of related entity (donation_id, request_id, etc.)
    related_type VARCHAR(50),  -- Type of related entity ('donation', 'blood_request', etc.)
    is_read BOOLEAN DEFAULT FALSE,  -- Whether notification has been read
    read_at TIMESTAMP NULL,  -- When notification was read
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_notifications_email ON notifications(email);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);

-- Create a function to automatically clean up old notifications (older than 30 days)
CREATE OR REPLACE FUNCTION cleanup_old_notifications()
RETURNS void AS $$
BEGIN
    DELETE FROM notifications 
    WHERE created_at < CURRENT_TIMESTAMP - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql;

-- Add comments for documentation
COMMENT ON TABLE notifications IS 'User notifications for blood donation system events';
COMMENT ON COLUMN notifications.user_id IS 'Optional reference to users table';
COMMENT ON COLUMN notifications.email IS 'User email to receive notifications';
COMMENT ON COLUMN notifications.type IS 'Type of notification (donation_approved, donation_declined, etc.)';
COMMENT ON COLUMN notifications.title IS 'Short notification title';
COMMENT ON COLUMN notifications.message IS 'Full notification message content';
COMMENT ON COLUMN notifications.related_id IS 'ID of the related entity that triggered this notification';
COMMENT ON COLUMN notifications.related_type IS 'Type of the related entity (donation, blood_request, etc.)';
COMMENT ON COLUMN notifications.is_read IS 'Whether the user has read this notification';
COMMENT ON COLUMN notifications.read_at IS 'Timestamp when notification was marked as read';

-- Insert a sample notification for testing (optional - remove in production)
-- INSERT INTO notifications (email, type, title, message, related_id, related_type) 
-- VALUES ('test@example.com', 'donation_approved', 'Donation Approved!', 'Your blood donation request has been approved by Colombo General Hospital. Thank you for your generosity!', 1, 'donation');

SELECT 'Notifications table created successfully!' as message;
