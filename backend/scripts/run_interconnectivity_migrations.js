import pool from "../config/db.js";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function runMigrations() {
  try {
    console.log("Running database migrations for blood interconnectivity...");

    // Run blood inventory enhancement
    console.log("\n1. Enhancing blood inventory table...");
    const inventoryScript = fs.readFileSync(
      join(__dirname, "enhance_blood_inventory_table.sql"),
      "utf8"
    );
    await pool.query(inventoryScript);
    console.log("✅ Blood inventory table enhanced");

    // Run blood requests enhancement
    console.log("\n2. Enhancing blood requests table...");
    const requestsScript = fs.readFileSync(
      join(__dirname, "enhance_blood_requests_fulfillment.sql"),
      "utf8"
    );
    await pool.query(requestsScript);
    console.log("✅ Blood requests table enhanced");

    console.log("\n🎉 All migrations completed successfully!");
    console.log("\nNew features enabled:");
    console.log("- Blood unit reservation system");
    console.log("- Request fulfillment tracking");
    console.log("- Cross-hospital blood sharing");
    console.log("- Automatic blood stock updates");
    console.log("- Auto-fulfillment of requests when blood is available");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error running migrations:", error.message);
    process.exit(1);
  }
}

runMigrations();
