// Test script for blood inventory management system
import fetch from "node-fetch";

const API_BASE_URL = "http://localhost:5050";

// Test functions
const testBloodInventorySystem = async () => {
  console.log("🧪 Testing Blood Inventory Management System\n");

  try {
    // 1. Test inventory summary endpoint
    console.log("1. Testing inventory summary...");
    const summaryRes = await fetch(
      `${API_BASE_URL}/api/hospital/inventory/summary`,
      {
        credentials: "include",
        headers: {
          Cookie: "connect.sid=test-session", // This would be a real session in practice
        },
      }
    );

    if (summaryRes.ok) {
      const summary = await summaryRes.json();
      console.log(
        "✅ Inventory summary retrieved:",
        summary.length,
        "blood types"
      );
    } else {
      console.log("❌ Inventory summary failed:", summaryRes.status);
    }

    // 2. Test inventory alerts
    console.log("\n2. Testing inventory alerts...");
    const alertsRes = await fetch(
      `${API_BASE_URL}/api/hospital/inventory/alerts`,
      {
        credentials: "include",
        headers: {
          Cookie: "connect.sid=test-session",
        },
      }
    );

    if (alertsRes.ok) {
      const alerts = await alertsRes.json();
      console.log(
        "✅ Alerts retrieved - Low stock:",
        alerts.lowStock?.length || 0,
        "Expiring:",
        alerts.expiringUnits?.length || 0
      );
    } else {
      console.log("❌ Alerts failed:", alertsRes.status);
    }

    // 3. Test inventory listing
    console.log("\n3. Testing inventory listing...");
    const inventoryRes = await fetch(`${API_BASE_URL}/api/hospital/inventory`, {
      credentials: "include",
      headers: {
        Cookie: "connect.sid=test-session",
      },
    });

    if (inventoryRes.ok) {
      const inventory = await inventoryRes.json();
      console.log("✅ Inventory listing retrieved:", inventory.length, "units");
    } else {
      console.log("❌ Inventory listing failed:", inventoryRes.status);
    }
  } catch (error) {
    console.log("❌ Test failed with error:", error.message);
  }

  console.log("\n🏁 Blood Inventory System test completed!");
};

// Run the test
testBloodInventorySystem();
