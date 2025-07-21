import pool from '../config/db.js';

export const getApprovedDonations = async () => {
  const result = await pool.query(`
    SELECT name, email, blood_type, location, created_at
    FROM donations
    WHERE status = 'Approved'
    ORDER BY created_at DESC
  `);
  return result.rows;
};
