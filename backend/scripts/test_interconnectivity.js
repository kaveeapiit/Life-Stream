import pool from "../config/db.js";

// Test script to demonstrate blood interconnectivity features
async function testBloodInterconnectivity() {
  console.log("🩸 Testing Blood Stock Interconnectivity System\n");

  try {
    // 1. Test blood inventory functionality
    console.log("1. Testing Blood Inventory Operations...");

    // Check if enhanced columns exist
    const inventoryCheck = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'blood_inventory' 
      AND column_name IN ('reserved_for_request_id', 'fulfilled_request_id')
    `);

    if (inventoryCheck.rows.length === 2) {
      console.log("✅ Blood inventory table properly enhanced");
    } else {
      console.log("❌ Blood inventory table missing enhanced columns");
      console.log("Run: node scripts/run_interconnectivity_migrations.js");
      return;
    }

    // 2. Test blood requests functionality
    console.log("\n2. Testing Blood Requests Operations...");

    const requestsCheck = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'blood_requests' 
      AND column_name IN ('fulfilled_at', 'assigned_hospital', 'hospital_notes')
    `);

    if (requestsCheck.rows.length === 3) {
      console.log("✅ Blood requests table properly enhanced");
    } else {
      console.log("❌ Blood requests table missing enhanced columns");
      console.log("Run: node scripts/run_interconnectivity_migrations.js");
      return;
    }

    // 3. Test sample data flow
    console.log("\n3. Testing Sample Data Flow...");

    // Check for sample data
    const inventoryCount = await pool.query(
      "SELECT COUNT(*) FROM blood_inventory"
    );
    const requestsCount = await pool.query(
      "SELECT COUNT(*) FROM blood_requests"
    );
    const donationsCount = await pool.query("SELECT COUNT(*) FROM donations");

    console.log(`📊 Current Database State:`);
    console.log(`   Blood Inventory Units: ${inventoryCount.rows[0].count}`);
    console.log(`   Blood Requests: ${requestsCount.rows[0].count}`);
    console.log(`   Donations: ${donationsCount.rows[0].count}`);

    // 4. Test blood type distribution
    console.log("\n4. Testing Blood Type Distribution...");

    const bloodTypeDistribution = await pool.query(`
      SELECT 
        blood_type,
        COUNT(*) as total_units,
        COUNT(CASE WHEN status = 'Available' THEN 1 END) as available_units,
        COUNT(CASE WHEN status = 'Reserved' THEN 1 END) as reserved_units,
        COUNT(CASE WHEN status = 'Used' THEN 1 END) as used_units
      FROM blood_inventory 
      GROUP BY blood_type 
      ORDER BY blood_type
    `);

    if (bloodTypeDistribution.rows.length > 0) {
      console.log("📈 Blood Type Distribution:");
      bloodTypeDistribution.rows.forEach((row) => {
        console.log(
          `   ${row.blood_type}: ${row.available_units} available, ${row.reserved_units} reserved, ${row.used_units} used`
        );
      });
    } else {
      console.log("ℹ️  No blood inventory data found");
    }

    // 5. Test request fulfillment status
    console.log("\n5. Testing Request Fulfillment Status...");

    const requestStatus = await pool.query(`
      SELECT 
        status,
        COUNT(*) as count,
        COUNT(CASE WHEN urgency = true THEN 1 END) as urgent_count
      FROM blood_requests 
      GROUP BY status 
      ORDER BY 
        CASE 
          WHEN status = 'pending' THEN 1
          WHEN status = 'approved' THEN 2
          WHEN status = 'fulfilled' THEN 3
          WHEN status = 'declined' THEN 4
          ELSE 5
        END
    `);

    if (requestStatus.rows.length > 0) {
      console.log("📋 Request Status Distribution:");
      requestStatus.rows.forEach((row) => {
        console.log(
          `   ${row.status}: ${row.count} total (${row.urgent_count} urgent)`
        );
      });
    } else {
      console.log("ℹ️  No blood request data found");
    }

    // 6. Test interconnectivity
    console.log("\n6. Testing Interconnectivity...");

    const interconnectedData = await pool.query(`
      SELECT 
        br.id as request_id,
        br.blood_type,
        br.status as request_status,
        bi.id as blood_unit_id,
        bi.status as unit_status,
        bi.donor_name
      FROM blood_requests br
      LEFT JOIN blood_inventory bi ON (
        bi.reserved_for_request_id = br.id OR 
        bi.fulfilled_request_id = br.id
      )
      WHERE br.status IN ('approved', 'fulfilled')
      LIMIT 5
    `);

    if (interconnectedData.rows.length > 0) {
      console.log("🔗 Interconnected Requests & Inventory:");
      interconnectedData.rows.forEach((row) => {
        console.log(
          `   Request ${row.request_id} (${row.blood_type}) -> Blood Unit ${
            row.blood_unit_id || "None"
          } (${row.unit_status || "N/A"})`
        );
      });
    } else {
      console.log("ℹ️  No interconnected data found yet");
    }

    console.log("\n🎉 Blood Stock Interconnectivity Test Complete!");
    console.log("\n📋 Next Steps:");
    console.log("1. Start the backend server: npm start");
    console.log("2. Test donation submission and approval");
    console.log("3. Test blood request creation and auto-fulfillment");
    console.log("4. Monitor inventory changes in real-time");
  } catch (error) {
    console.error("❌ Error testing interconnectivity:", error.message);
  } finally {
    await pool.end();
  }
}

// Run the test
testBloodInterconnectivity();
