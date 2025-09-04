import pool from "./config/db.js";

async function checkBloodInventory() {
  try {
    console.log("Checking blood_inventory table...");

    // Get sample inventory data with hospital info
    const result = await pool.query(`
      SELECT DISTINCT hospital_id, COUNT(*) as inventory_count 
      FROM blood_inventory 
      GROUP BY hospital_id 
      ORDER BY hospital_id
    `);
    console.log("Blood inventory by hospital:", result.rows);

    // Also check first few inventory items
    const sampleResult = await pool.query(
      "SELECT * FROM blood_inventory LIMIT 5"
    );
    console.log("Sample inventory items:", sampleResult.rows);
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    await pool.end();
  }
}

checkBloodInventory();
