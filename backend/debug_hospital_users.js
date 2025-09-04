import pool from "./config/db.js";

async function checkHospitalUsers() {
  try {
    console.log("Checking hospital_users table structure...");

    // First check the table structure
    const tableInfo = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'hospital_users'
    `);
    console.log("Table structure:", tableInfo.rows);

    // Then get the actual data
    const result = await pool.query("SELECT * FROM hospital_users LIMIT 5");
    console.log("Hospital users found:", result.rows);

    if (result.rows.length === 0) {
      console.log("No hospital users found. Let's check the hospitals table:");
      const hospitalsResult = await pool.query(
        "SELECT * FROM hospitals LIMIT 5"
      );
      console.log("Hospitals found:", hospitalsResult.rows);
    }
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    await pool.end();
  }
}

checkHospitalUsers();
