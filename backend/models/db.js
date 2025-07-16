// backend/models/db.js
import pkg from 'pg';
const { Pool } = pkg;

export const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'lifestream',
  password: '1234',
  port: 5432,
});

export default pool; // ✅ fixed