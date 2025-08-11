import dotenv from "dotenv";
dotenv.config();

import pkg from "pg";
const { Pool } = pkg;

// Use DATABASE_URL from environment variables
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Use the full database URL
  ssl: {
    rejectUnauthorized: false, // Required for Railway's PostgreSQL service
  },
});

export default pool;
