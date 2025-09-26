-- Check if phone column exists in users table
\d users;

-- If phone column doesn't exist, add it
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone TEXT;

-- Verify the column was added
\d users;