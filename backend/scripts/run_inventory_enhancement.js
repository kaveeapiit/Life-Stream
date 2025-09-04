import pool from "../config/db.js";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function runMigration() {
  try {
    console.log("Running blood inventory enhancement migration...");

    const scriptPath = join(__dirname, "enhance_blood_inventory_table.sql");
    const script = fs.readFileSync(scriptPath, "utf8");

    await pool.query(script);

    console.log("✅ Blood inventory table enhanced successfully");
    console.log("Added columns: reserved_for_request_id, fulfilled_request_id");
    console.log('Updated status constraint to include "Reserved" status');

    process.exit(0);
  } catch (error) {
    console.error("❌ Error enhancing blood inventory table:", error.message);
    process.exit(1);
  }
}

runMigration();
