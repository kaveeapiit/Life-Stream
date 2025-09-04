import pool from "../config/db.js";

async function addSampleBloodInventory() {
  try {
    console.log("🩸 Adding sample blood inventory data...");

    // First, check if hospital_users table exists and get hospital IDs
    const hospitalCheck = await pool.query(
      "SELECT id, username FROM hospital_users LIMIT 5"
    );

    if (hospitalCheck.rows.length === 0) {
      console.log(
        "❌ No hospitals found in database. Please add hospitals first."
      );
      return;
    }

    console.log(`Found ${hospitalCheck.rows.length} hospitals:`);
    hospitalCheck.rows.forEach((hospital) => {
      console.log(`  - ID: ${hospital.id}, Username: ${hospital.username}`);
    });

    // Check if blood_inventory table exists and has the required columns
    const tableCheck = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'blood_inventory'
    `);

    if (tableCheck.rows.length === 0) {
      console.log(
        "❌ Blood inventory table does not exist. Run migrations first."
      );
      return;
    }

    console.log("\n✅ Blood inventory table exists with columns:");
    tableCheck.rows.forEach((col) => console.log(`  - ${col.column_name}`));

    // Clear existing sample data (optional)
    await pool.query(
      "DELETE FROM blood_inventory WHERE donor_name LIKE 'Sample%'"
    );

    // Add sample blood inventory data for each hospital
    const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
    const sampleDonors = [
      "Sample Donor 1",
      "Sample Donor 2",
      "Sample Donor 3",
      "Sample Donor 4",
      "Sample Donor 5",
      "Sample Donor 6",
    ];

    let totalAdded = 0;

    for (const hospital of hospitalCheck.rows) {
      console.log(`\nAdding inventory for ${hospital.username}...`);

      for (let i = 0; i < bloodTypes.length; i++) {
        const bloodType = bloodTypes[i];

        // Add 2-5 units per blood type per hospital
        const unitsToAdd = Math.floor(Math.random() * 4) + 2;

        for (let j = 0; j < unitsToAdd; j++) {
          const donor =
            sampleDonors[Math.floor(Math.random() * sampleDonors.length)];
          const expiryDate = new Date();
          expiryDate.setDate(
            expiryDate.getDate() + Math.floor(Math.random() * 30) + 5
          ); // 5-35 days from now

          const status =
            Math.random() < 0.8
              ? "Available"
              : Math.random() < 0.5
              ? "Used"
              : "Expired";

          await pool.query(
            `
            INSERT INTO blood_inventory 
            (blood_type, donor_name, donor_email, hospital_id, expiry_date, status, created_at)
            VALUES ($1, $2, $3, $4, $5, $6, NOW())
          `,
            [
              bloodType,
              donor,
              `${donor.toLowerCase().replace(" ", ".")}@email.com`,
              hospital.id,
              expiryDate.toISOString().split("T")[0],
              status,
            ]
          );

          totalAdded++;
        }
      }
    }

    console.log(`\n🎉 Successfully added ${totalAdded} blood inventory units!`);

    // Show summary
    const summary = await pool.query(`
      SELECT 
        h.username as hospital_name,
        bi.blood_type,
        COUNT(*) as total_units,
        COUNT(CASE WHEN bi.status = 'Available' THEN 1 END) as available_units
      FROM blood_inventory bi
      JOIN hospital_users h ON h.id = bi.hospital_id
      WHERE bi.donor_name LIKE 'Sample%'
      GROUP BY h.username, bi.blood_type
      ORDER BY h.username, bi.blood_type
    `);

    console.log("\n📊 Inventory Summary:");
    summary.rows.forEach((row) => {
      console.log(
        `  ${row.hospital_name} - ${row.blood_type}: ${row.available_units}/${row.total_units} available`
      );
    });
  } catch (error) {
    console.error("❌ Error adding sample blood inventory:", error.message);
  } finally {
    await pool.end();
  }
}

addSampleBloodInventory();
