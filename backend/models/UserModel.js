// backend/models/UserModel.js
import pool from "../config/db.js";
import bcrypt from "bcrypt";

const TABLE = "users";
const ALLOW = ["email", "password", "name", "blood_type"]; // Only these can be set/updated

const buildSet = (obj, start = 1) => {
  const keys = Object.keys(obj);
  return {
    clause: keys.map((k, i) => `"${k}" = $${i + start}`).join(", "),
    values: keys.map((k) => obj[k]),
  };
};

// 1. Get user by email (for login, profile, etc)
export async function getUserByEmail(email) {
  const { rows } = await pool.query(
    `SELECT id, email, name, blood_type AS blood_group, created_at FROM ${TABLE} WHERE email = $1`,
    [email]
  );
  return rows[0] || null;
}

// 2. Update only name and blood group by email (profile edit)
export async function updateUserProfile(email, name, bloodType) {
  await pool.query(
    `UPDATE ${TABLE} SET name = $1, blood_type = $2 WHERE email = $3`,
    [name, bloodType, email]
  );
}

// 3. Update password by email (profile security)
export async function updatePassword(email, newPassword) {
  const hashed = await bcrypt.hash(newPassword, 10);
  await pool.query(`UPDATE ${TABLE} SET password = $1 WHERE email = $2`, [
    hashed,
    email,
  ]);
}

// 4. List users with search, pagination, and blood_group alias
export async function listUsers({
  search = "",
  limit = 20,
  offset = 0,
  sort = "created_at",
  dir = "DESC",
}) {
  const where = search ? "WHERE email ILIKE $1 OR name ILIKE $1" : "";
  const params = search ? [`%${search}%`, limit, offset] : [limit, offset];

  const sql = `
    SELECT id, email, name, blood_type AS blood_group, created_at
    FROM ${TABLE}
    ${where}
    ORDER BY "${sort}" ${dir === "ASC" ? "ASC" : "DESC"}
    LIMIT $${params.length - 1} OFFSET $${params.length}
  `;
  const { rows } = await pool.query(sql, params);

  const countSql = `SELECT COUNT(*) FROM ${TABLE} ${where}`;
  const { rows: c } = await pool.query(countSql, search ? [`%${search}%`] : []);
  return { rows, total: Number(c[0].count) };
}

// 5. Get user by ID (for admin/CRUD UI)
export async function getUserById(id) {
  const { rows } = await pool.query(
    `SELECT id, email, name, blood_type AS blood_group, created_at FROM ${TABLE} WHERE id=$1`,
    [id]
  );
  return rows[0] || null;
}

// 6. Create user (password always hashed if present)
export async function createUserRow(data) {
  const body = Object.fromEntries(
    Object.entries(data).filter(
      ([k, v]) => ALLOW.includes(k) && v !== undefined
    )
  );
  if (body.password) {
    body.password = await bcrypt.hash(body.password, 10);
  }
  const cols = Object.keys(body)
    .map((k) => `"${k}"`)
    .join(", ");
  const placeholders = Object.keys(body)
    .map((_, i) => `$${i + 1}`)
    .join(", ");
  const values = Object.values(body);

  const { rows } = await pool.query(
    `INSERT INTO ${TABLE} (${cols}) VALUES (${placeholders}) RETURNING id, email, name, blood_type AS blood_group, created_at`,
    values
  );
  return rows[0];
}

// 7. Update user by ID (hash password if present)
export async function updateUserRow(id, data) {
  const body = Object.fromEntries(
    Object.entries(data).filter(
      ([k, v]) => ALLOW.includes(k) && v !== undefined
    )
  );
  if (body.password) {
    body.password = await bcrypt.hash(body.password, 10);
  }
  if (!Object.keys(body).length) return getUserById(id);

  const { clause, values } = buildSet(body);
  const { rows } = await pool.query(
    `UPDATE ${TABLE} SET ${clause} WHERE id=$${
      values.length + 1
    } RETURNING id, email, name, blood_type AS blood_group, created_at`,
    [...values, id]
  );
  return rows[0];
}

// 8. Delete user by ID
export async function deleteUserRow(id) {
  await pool.query(`DELETE FROM ${TABLE} WHERE id=$1`, [id]);
}

// 9. Get available donors with filtering options for hospitals
export async function getAvailableDonors({
  bloodType = "",
  search = "",
  limit = 50,
  offset = 0,
}) {
  let whereConditions = [];
  let params = [];
  let paramIndex = 1;

  // Filter by blood type if specified
  if (bloodType && bloodType !== "all") {
    whereConditions.push(`blood_type = $${paramIndex}`);
    params.push(bloodType);
    paramIndex++;
  }

  // Search by name or email
  if (search) {
    whereConditions.push(
      `(name ILIKE $${paramIndex} OR email ILIKE $${paramIndex})`
    );
    params.push(`%${search}%`);
    paramIndex++;
  }

  const whereClause =
    whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : "";

  const sql = `
    SELECT id, name, email, blood_type AS blood_group, created_at
    FROM ${TABLE}
    ${whereClause}
    ORDER BY created_at DESC
    LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
  `;

  params.push(limit, offset);
  const { rows } = await pool.query(sql, params);

  // Get total count for pagination
  const countSql = `SELECT COUNT(*) FROM ${TABLE} ${whereClause}`;
  const countParams = params.slice(0, -2); // Remove limit and offset
  const { rows: countRows } = await pool.query(countSql, countParams);

  return {
    donors: rows,
    total: Number(countRows[0].count),
  };
}
