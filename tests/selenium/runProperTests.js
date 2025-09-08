#!/usr/bin/env node

import { ProperFunctionalTests } from "./ProperFunctionalTests.js";

async function runProperFunctionalTests() {
  console.log(" Starting Life Stream Proper Functional Tests...\n");
  console.log(
    "This test understands the actual React form structure and will:"
  );
  console.log("• Use correct field names (name, email, password, bloodType)");
  console.log("• Properly interact with the MagneticBtn submit button");
  console.log("• Check database for actual user creation");
  console.log("• Handle success/error messages appropriately\n");

  try {
    const tests = new ProperFunctionalTests("chrome");
    await tests.runAllTests();

    console.log("\n Proper functional test suite completed successfully!");
  } catch (error) {
    console.error("\n Proper functional test suite failed:", error);
    process.exit(1);
  }
}

// Run the tests
runProperFunctionalTests();
