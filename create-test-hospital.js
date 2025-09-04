import pool from "./backend/config/db.js";
import bcrypt from "bcrypt";

async function createTestHospitalUser() {
  try {
    console.log("🏥 Creating test hospital user...");

    const testUsername = "TestHospital";
    const testPassword = "test123";

    // Hash the password
    const hashedPassword = await bcrypt.hash(testPassword, 10);

    // Check if test user already exists
    const existingUser = await pool.query(
      "SELECT id FROM hospital_users WHERE username = $1",
      [testUsername]
    );

    if (existingUser.rows.length > 0) {
      console.log("✅ Test hospital user already exists");
      console.log(`Username: ${testUsername}`);
      console.log(`Password: ${testPassword}`);
      console.log(`ID: ${existingUser.rows[0].id}`);
    } else {
      // Create new test user
      const newUser = await pool.query(
        "INSERT INTO hospital_users (username, password) VALUES ($1, $2) RETURNING id, username",
        [testUsername, hashedPassword]
      );

      console.log("✅ Test hospital user created successfully!");
      console.log(`Username: ${testUsername}`);
      console.log(`Password: ${testPassword}`);
      console.log(`ID: ${newUser.rows[0].id}`);

      // Add some inventory for this hospital
      const hospitalId = newUser.rows[0].id;
      const sampleInventory = [
        {
          bloodType: "A+",
          donorName: "Test Donor 1",
          donorEmail: "test1@email.com",
          expiryDate: "2025-10-15",
        },
        {
          bloodType: "B+",
          donorName: "Test Donor 2",
          donorEmail: "test2@email.com",
          expiryDate: "2025-10-20",
        },
        {
          bloodType: "O+",
          donorName: "Test Donor 3",
          donorEmail: "test3@email.com",
          expiryDate: "2025-10-25",
        },
        {
          bloodType: "AB+",
          donorName: "Test Donor 4",
          donorEmail: "test4@email.com",
          expiryDate: "2025-10-30",
        },
      ];

      for (const item of sampleInventory) {
        await pool.query(
          `
          INSERT INTO blood_inventory (blood_type, donor_name, donor_email, hospital_id, expiry_date, status, created_at)
          VALUES ($1, $2, $3, $4, $5, 'Available', NOW())
        `,
          [
            item.bloodType,
            item.donorName,
            item.donorEmail,
            hospitalId,
            item.expiryDate,
          ]
        );
      }

      console.log(
        `📊 Added ${sampleInventory.length} blood inventory items for test hospital`
      );
    }

    console.log("\n🔗 Login URL: http://localhost:5173/hospital/login");
    console.log(
      "💡 Use the credentials above to log in and access the blood inventory"
    );
  } catch (error) {
    console.error("❌ Error creating test user:", error);
  } finally {
    await pool.end();
  }
}

createTestHospitalUser();
