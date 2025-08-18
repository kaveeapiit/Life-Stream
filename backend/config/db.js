import dotenv from "dotenv";
dotenv.config();

import pkg from "pg";
const { Pool } = pkg;

// Database configuration - handles both local and production environments
export const pool = new Pool({
  // If DATABASE_URL is provided (production), use it
  connectionString: process.env.DATABASE_URL,
  // Otherwise use individual parameters (local development)
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  // Only use SSL in production (when DATABASE_URL is provided)
  ssl: process.env.DATABASE_URL
    ? {
        rejectUnauthorized: false, // Required for Railway's PostgreSQL service
      }
    : false,
});

export default pool;
