import pool from "../config/db.js";

// Debug blood inventory data
async function debugBloodInventory() {
  try {
    console.log("🔍 Debugging blood inventory data...");

    // Check all hospital IDs in blood_inventory
    const hospitalIds = await pool.query(`
      SELECT DISTINCT hospital_id, COUNT(*) as inventory_count
      FROM blood_inventory 
      GROUP BY hospital_id 
      ORDER BY hospital_id
    `);

    console.log("\n🏥 Hospital IDs with inventory:");
    console.table(hospitalIds.rows);

    // Check hospital_users table
    const hospitals = await pool.query(
      "SELECT id, username FROM hospital_users ORDER BY id"
    );
    console.log("\n🏥 Hospital users:");
    console.table(hospitals.rows);

    // Show sample inventory data for each hospital
    for (const hospital of hospitalIds.rows) {
      console.log(`\n📋 Inventory for Hospital ID ${hospital.hospital_id}:`);
      const inventory = await pool.query(
        `
        SELECT blood_type, COUNT(*) as total, 
               COUNT(CASE WHEN status = 'Available' THEN 1 END) as available
        FROM blood_inventory 
        WHERE hospital_id = $1 
        GROUP BY blood_type 
        ORDER BY blood_type
      `,
        [hospital.hospital_id]
      );
      console.table(inventory.rows);
    }

    // Test the exact query used by the API
    console.log("\n🔍 Testing API query for hospital ID 1:");
    const testQuery = await pool.query(
      `
      SELECT * FROM blood_inventory 
      WHERE hospital_id = $1
      ORDER BY created_at DESC
      LIMIT 5
    `,
      [1]
    );

    console.log("Sample results:");
    console.table(testQuery.rows);
  } catch (error) {
    console.error("❌ Error debugging inventory:", error);
  } finally {
    await pool.end();
  }
}

debugBloodInventory();
