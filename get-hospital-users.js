import pool from "./backend/config/db.js";

// Get hospital users for login
async function getHospitalUsers() {
  try {
    console.log("🏥 Testing database connection...");

    // Test basic connection first
    const testQuery = await pool.query("SELECT NOW()");
    console.log("✅ Database connected at:", testQuery.rows[0].now);

    console.log("🏥 Fetching hospital users...");

    const hospitals = await pool.query(
      "SELECT id, username FROM hospital_users ORDER BY id"
    );

    console.log("\n📋 Available hospital accounts:");
    hospitals.rows.forEach((hospital) => {
      console.log(`- ID: ${hospital.id}, Username: "${hospital.username}"`);
    });

    console.log("\n💡 You can use any of these credentials to log in:");
    console.log("🔗 Hospital Login URL: http://localhost:5173/hospital/login");
    console.log(
      "📝 Note: Try using the same password as the username, or check the hospital authentication controller"
    );
  } catch (error) {
    console.error("❌ Error getting hospital users:", error);
  } finally {
    await pool.end();
  }
}

getHospitalUsers();
