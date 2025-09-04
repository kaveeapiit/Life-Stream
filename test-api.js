// Test the API endpoints
async function testAPI() {
  const baseURL = "http://localhost:5050";

  try {
    console.log("🔍 Testing debug endpoint...");
    const debugResponse = await fetch(`${baseURL}/api/hospital/debug`);
    const debugData = await debugResponse.json();
    console.log("Debug response:", debugData);

    console.log(
      "\n🔍 Testing inventory endpoint (should fail without auth)..."
    );
    const inventoryResponse = await fetch(`${baseURL}/api/hospital/inventory`);
    const inventoryData = await inventoryResponse.json();
    console.log("Inventory response status:", inventoryResponse.status);
    console.log("Inventory response:", inventoryData);

    console.log("\n🔍 Testing summary endpoint (should fail without auth)...");
    const summaryResponse = await fetch(
      `${baseURL}/api/hospital/inventory/summary`
    );
    const summaryData = await summaryResponse.json();
    console.log("Summary response status:", summaryResponse.status);
    console.log("Summary response:", summaryData);
  } catch (error) {
    console.error("Error testing API:", error);
  }
}

testAPI();
