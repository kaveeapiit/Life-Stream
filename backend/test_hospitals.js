import pool from "./config/db.js";

async function testHospitals() {
  try {
    console.log("Testing hospital database...");

    // Check if table exists
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'hospital_users'
      );
    `);
    console.log("Hospital_users table exists:", tableCheck.rows[0].exists);

    if (tableCheck.rows[0].exists) {
      // Get table structure
      const structure = await pool.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'hospital_users' 
        ORDER BY ordinal_position;
      `);
      console.log("Table structure:", structure.rows);

      // Get all data
      const data = await pool.query("SELECT * FROM hospital_users ORDER BY id");
      console.log("Hospital data:", data.rows);
      console.log("Row count:", data.rowCount);
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await pool.end();
  }
}

testHospitals();
