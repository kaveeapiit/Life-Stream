import { readFileSync } from "fs";
import { pool } from "../config/db.js";

async function runMigration() {
  try {
    console.log("Running hospital blood requests table migration...");

    // Read the SQL file
    const sql = readFileSync(
      "./scripts/create_hospital_blood_requests_table.sql",
      "utf8"
    );

    // Execute the SQL
    await pool.query(sql);

    console.log("✅ Hospital blood requests table created successfully!");

    // Close the pool
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error running migration:", error);
    await pool.end();
    process.exit(1);
  }
}

runMigration();
