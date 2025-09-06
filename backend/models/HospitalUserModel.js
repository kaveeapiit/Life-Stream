// backend/models/HospitalUserModel.js
import pool from '../config/db.js';
import bcrypt from 'bcrypt';

const TABLE = 'hospital_users'; // single source

export const listHospitals = async ({ q = '', limit = 10, offset = 0 }) => {
  // Build WHERE + params safely
  const params = [];
  let where = '';
  if (q) {
    where = 'WHERE username ILIKE $1';
    params.push(`%${q}%`);
  }

  // Rows query - select available columns only
  params.push(limit, offset); // push after q (or not) to keep order
  const rowsSql = `
    SELECT id, username
    FROM ${TABLE}
    ${where}
    ORDER BY id DESC
    LIMIT $${params.length - 1} OFFSET $${params.length}
  `;
  const { rows } = await pool.query(rowsSql, params);

  // Count query (separate array)
  const countParams = q ? [`%${q}%`] : [];
  const countSql = `SELECT COUNT(*)::int AS count FROM ${TABLE} ${where}`;
  const { rows: countRows } = await pool.query(countSql, countParams);

  return { rows, total: countRows[0].count };
};

export const getHospital = async (id) => {
  const { rows } = await pool.query(
    `SELECT id, username FROM ${TABLE} WHERE id = $1`,
    [id]
  );
  return rows[0];
};

export const createHospital = async ({ username, password }) => {
  const hashed = await bcrypt.hash(password, 10);
  const { rows } = await pool.query(
    `INSERT INTO ${TABLE} (username, password)
     VALUES ($1, $2)
     RETURNING id, username`,
    [username, hashed]
  );
  return rows[0];
};

export const updateHospital = async (id, { username, password }) => {
  const fields = [];
  const values = [];
  let i = 1;

  if (username) {
    fields.push(`username = $${i++}`);
    values.push(username);
  }
  if (password) {
    const hashed = await bcrypt.hash(password, 10);
    fields.push(`password = $${i++}`);
    values.push(hashed);
  }

  if (!fields.length) return getHospital(id);

  values.push(id);
  const sql = `
    UPDATE ${TABLE}
    SET ${fields.join(', ')}
    WHERE id = $${i}
    RETURNING id, username
  `;
  const { rows } = await pool.query(sql, values);
  return rows[0];
};

export const deleteHospital = async (id) => {
  await pool.query(`DELETE FROM ${TABLE} WHERE id = $1`, [id]);
};
