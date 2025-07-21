import pool from '../config/db.js';

// ✅ Insert new donation with status = 'Pending'
export const insertDonation = async ({ userId, name, email, bloodType, location }) => {
  const query = `
    INSERT INTO donations (user_id, name, email, blood_type, location, status)
    VALUES ($1, $2, $3, $4, $5, $6)
  `;
  await pool.query(query, [
    userId || null,
    name,
    email,
    bloodType,
    location,
    'Pending'
  ]);
};

// ✅ Fetch all donations for a user by email, latest first
export const fetchDonationsByEmail = async (email) => {
  const query = `
    SELECT * FROM donations
    WHERE email = $1
    ORDER BY created_at DESC
  `;
  const result = await pool.query(query, [email]);
  return result.rows;
};
