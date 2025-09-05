import pool from '../config/db.js';

// ✅ Create a new user with bloodType
export const createUser = async (name, email, hashedPassword, bloodType) => {
  try {
    console.log('Creating user with data:', { name, email, bloodType });
    
    const result = await pool.query(
      'INSERT INTO users (name, email, password, blood_type) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, email, hashedPassword, bloodType]
    );
    
    console.log('User created successfully:', result.rows[0].email);
    return result.rows[0];
  } catch (error) {
    console.error('Database error in createUser:', error);
    if (error.code === '23505') { // PostgreSQL unique violation
      throw new Error('User already exists with this email');
    }
    throw error;
  }
};

// ✅ Find a user by email
export const findUserByEmail = async (email) => {
  const result = await pool.query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );
  return result.rows[0];
};
