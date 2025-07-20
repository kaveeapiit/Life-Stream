import pool from '../config/db.js';

// ✅ Create a new user with bloodType
export const createUser = async (name, email, hashedPassword, bloodType) => {
  const result = await pool.query(
    'INSERT INTO users (name, email, password, blood_type) VALUES ($1, $2, $3, $4) RETURNING *',
    [name, email, hashedPassword, bloodType]
  );
  return result.rows[0];
};

// ✅ Find a user by email
export const findUserByEmail = async (email) => {
  const result = await pool.query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );
  return result.rows[0];
};
