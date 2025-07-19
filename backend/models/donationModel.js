import pool from '../config/db.js'; // ✅ matches your structure

export const insertDonation = async ({ name, email, bloodType, message }) => {
  const query = `
    INSERT INTO donations (name, email, blood_type, message)
    VALUES ($1, $2, $3, $4)
  `;
  await pool.query(query, [name, email, bloodType, message]);
};
