import pool from '../config/db.js';

export const findHospitalByUsername = async (username) => {
  const result = await pool.query(
    'SELECT * FROM hospital_users WHERE username = $1',
    [username]
  );
  return result.rows[0];
};
