import dotenv from "dotenv";
dotenv.config();

import pkg from "pg";
const { Pool } = pkg;

// Database configuration for local development
export const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: false,
});

export default pool;
