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

// ✅ Fetch all donations for a user by email
export const fetchDonationsByEmail = async (email) => {
  const query = `
    SELECT * FROM donations
    WHERE email = $1
    ORDER BY created_at DESC
  `;
  const result = await pool.query(query, [email]);
  return result.rows;
};

// ✅ Get all pending donations (for admin view)
export const getPendingDonations = async () => {
  const result = await pool.query(
    'SELECT * FROM donations WHERE status = $1 ORDER BY created_at DESC',
    ['Pending']
  );
  return result.rows;
};

// ✅ Update donation status to Approved or Declined
export const updateDonationStatus = async (id, status) => {
  const result = await pool.query(
    'UPDATE donations SET status = $1 WHERE id = $2 RETURNING *',
    [status, id]
  );
  return result.rows[0];
};

// ✅ Get pending donations for a specific hospital based on username/location
export const getPendingDonationsForHospital = async (hospitalUsername) => {
  const query = `
    SELECT * FROM donations
    WHERE status = 'Pending' AND LOWER(location) LIKE LOWER($1)
    ORDER BY created_at DESC
  `;
  const keyword = `%${hospitalUsername}%`; // e.g., "Kandy" matches "Kandy General Hospital"
  const result = await pool.query(query, [keyword]);
  return result.rows;
};
