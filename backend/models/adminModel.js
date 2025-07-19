import db from '../config/db.js';

export const getAdminByUsername = async (username) => {
  const result = await db.query('SELECT * FROM admins WHERE username = $1', [username]);
  return result.rows[0];
};
