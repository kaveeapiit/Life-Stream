import pool from '../config/db.js';
import bcrypt from 'bcrypt';

// 1. Get user profile data
export const getUserByEmail = async (email) => {
  const result = await pool.query(
    'SELECT name, blood_type FROM users WHERE email = $1',
    [email]
  );
  return result.rows[0];
};

// 2. Update name and blood type
export const updateUserProfile = async (email, name, bloodType) => {
  await pool.query(
    'UPDATE users SET name = $1, blood_type = $2 WHERE email = $3',
    [name, bloodType, email]
  );
};

// 3. Update password (hashed)
export const updatePassword = async (email, newPassword) => {
  const hashed = await bcrypt.hash(newPassword, 10);
  await pool.query(
    'UPDATE users SET password = $1 WHERE email = $2',
    [hashed, email]
  );
};
