import pool from "../config/db.js";

// Test database connection and add sample blood inventory data
async function setupBloodInventory() {
  try {
    console.log("🔍 Testing database connection...");

    // Test connection
    const testQuery = await pool.query("SELECT NOW()");
    console.log(
      "✅ Database connected successfully at:",
      testQuery.rows[0].now
    );

    // Check if blood_inventory table exists
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'blood_inventory'
      );
    `);

    if (!tableCheck.rows[0].exists) {
      console.log("❌ blood_inventory table does not exist. Creating it...");

      // Create blood_inventory table
      await pool.query(`
        CREATE TABLE blood_inventory (
          id SERIAL PRIMARY KEY,
          donation_id INTEGER REFERENCES donations(id) ON DELETE SET NULL,
          blood_type TEXT NOT NULL CHECK (blood_type IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
          donor_name TEXT NOT NULL,
          donor_email TEXT NOT NULL,
          hospital_id INTEGER NOT NULL,
          expiry_date DATE NOT NULL,
          status TEXT NOT NULL DEFAULT 'Available' CHECK (status IN ('Available', 'Used', 'Expired', 'Reserved')),
          used_date TIMESTAMP NULL,
          reserved_for_request_id INTEGER NULL,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );
      `);

      // Create indexes
      await pool.query(`
        CREATE INDEX idx_blood_inventory_hospital_id ON blood_inventory(hospital_id);
        CREATE INDEX idx_blood_inventory_blood_type ON blood_inventory(blood_type);
        CREATE INDEX idx_blood_inventory_status ON blood_inventory(status);
        CREATE INDEX idx_blood_inventory_expiry_date ON blood_inventory(expiry_date);
      `);

      console.log("✅ blood_inventory table created successfully");
    } else {
      console.log("✅ blood_inventory table already exists");
    }

    // Check current inventory count
    const inventoryCount = await pool.query(
      "SELECT COUNT(*) FROM blood_inventory"
    );
    console.log(`📊 Current inventory count: ${inventoryCount.rows[0].count}`);

    // If no inventory data, add sample data
    if (parseInt(inventoryCount.rows[0].count) === 0) {
      console.log("📝 Adding sample blood inventory data...");

      // Get a hospital ID (assuming hospital_users table exists)
      const hospitalQuery = await pool.query(
        "SELECT id FROM hospital_users LIMIT 1"
      );
      let hospitalId = 1; // Default hospital ID

      if (hospitalQuery.rows.length > 0) {
        hospitalId = hospitalQuery.rows[0].id;
        console.log(`🏥 Using hospital ID: ${hospitalId}`);
      } else {
        console.log("⚠️ No hospitals found, using default hospital ID: 1");
      }

      // Sample blood inventory data
      const sampleInventory = [
        {
          bloodType: "A+",
          donorName: "John Doe",
          donorEmail: "john.doe@email.com",
          expiryDate: "2025-10-15",
        },
        {
          bloodType: "A+",
          donorName: "Jane Smith",
          donorEmail: "jane.smith@email.com",
          expiryDate: "2025-10-20",
        },
        {
          bloodType: "A-",
          donorName: "Bob Johnson",
          donorEmail: "bob.johnson@email.com",
          expiryDate: "2025-10-18",
        },
        {
          bloodType: "B+",
          donorName: "Alice Brown",
          donorEmail: "alice.brown@email.com",
          expiryDate: "2025-10-25",
        },
        {
          bloodType: "B+",
          donorName: "Charlie Wilson",
          donorEmail: "charlie.wilson@email.com",
          expiryDate: "2025-10-12",
        },
        {
          bloodType: "B-",
          donorName: "Diana Garcia",
          donorEmail: "diana.garcia@email.com",
          expiryDate: "2025-10-30",
        },
        {
          bloodType: "AB+",
          donorName: "Edward Miller",
          donorEmail: "edward.miller@email.com",
          expiryDate: "2025-10-22",
        },
        {
          bloodType: "AB-",
          donorName: "Fiona Davis",
          donorEmail: "fiona.davis@email.com",
          expiryDate: "2025-10-28",
        },
        {
          bloodType: "O+",
          donorName: "George Martinez",
          donorEmail: "george.martinez@email.com",
          expiryDate: "2025-10-16",
        },
        {
          bloodType: "O+",
          donorName: "Helen Rodriguez",
          donorEmail: "helen.rodriguez@email.com",
          expiryDate: "2025-10-19",
        },
        {
          bloodType: "O+",
          donorName: "Ian Lopez",
          donorEmail: "ian.lopez@email.com",
          expiryDate: "2025-10-24",
        },
        {
          bloodType: "O-",
          donorName: "Julia Gonzalez",
          donorEmail: "julia.gonzalez@email.com",
          expiryDate: "2025-10-21",
        },
        {
          bloodType: "O-",
          donorName: "Kevin Anderson",
          donorEmail: "kevin.anderson@email.com",
          expiryDate: "2025-10-26",
        },

        // Add some expiring soon units (within 7 days)
        {
          bloodType: "A+",
          donorName: "Laura Thomas",
          donorEmail: "laura.thomas@email.com",
          expiryDate: "2025-09-08",
        },
        {
          bloodType: "B+",
          donorName: "Michael Taylor",
          donorEmail: "michael.taylor@email.com",
          expiryDate: "2025-09-09",
        },
        {
          bloodType: "O+",
          donorName: "Nancy Moore",
          donorEmail: "nancy.moore@email.com",
          expiryDate: "2025-09-10",
        },
      ];

      // Insert sample data
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
        `✅ Added ${sampleInventory.length} sample blood inventory items`
      );
    }

    // Display final inventory summary
    const finalSummary = await pool.query(`
      SELECT 
        blood_type,
        COUNT(*) as total_units,
        COUNT(CASE WHEN status = 'Available' AND expiry_date > CURRENT_DATE THEN 1 END) as available_units,
        COUNT(CASE WHEN status = 'Available' AND expiry_date <= CURRENT_DATE + INTERVAL '7 days' AND expiry_date > CURRENT_DATE THEN 1 END) as expiring_soon
      FROM blood_inventory 
      GROUP BY blood_type 
      ORDER BY blood_type
    `);

    console.log("\n📊 Blood Inventory Summary:");
    console.table(finalSummary.rows);
  } catch (error) {
    console.error("❌ Error setting up blood inventory:", error);
  } finally {
    await pool.end();
  }
}

// Run the setup
setupBloodInventory();
