import dotenv from "dotenv";
dotenv.config();

import pkg from "pg";
const { Pool } = pkg;

// Database configuration - handles local, Railway, and Azure environments
export const pool = new Pool({
  // If DATABASE_URL is provided (production), use it
  connectionString: process.env.DATABASE_URL,
  // Otherwise use individual parameters (local development)
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  // SSL configuration for different environments
  ssl:
    process.env.DATABASE_URL || process.env.NODE_ENV === "production"
      ? {
          rejectUnauthorized: false, // Required for cloud PostgreSQL services (Railway, Azure)
        }
      : false,
});

export default pool;
