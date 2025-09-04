-- SQL commands to reset hospital password
-- Run these in your PostgreSQL database

-- First, check existing hospitals
SELECT id, username FROM hospital_users;

-- Reset password for Hospital user (ID: 1) to 'hospital123'
-- You'll need to run this in psql or pgAdmin
-- UPDATE hospital_users SET password = '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' WHERE id = 1;

-- Or create a new simple hospital user
INSERT INTO hospital_users (username, password) 
VALUES ('SimpleHospital', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

-- The password hash above is for 'hello123'
