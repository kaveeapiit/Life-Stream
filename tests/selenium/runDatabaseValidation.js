#!/usr/bin/env node

import { DatabaseValidationTests } from "./DatabaseValidationTests.js";

async function runDatabaseValidationTests() {
  console.log(" Starting Life Stream Database Validation Tests...\n");

  try {
    const tests = new DatabaseValidationTests("chrome");
    await tests.runAllTests();

    console.log("\n Database validation test suite completed successfully!");
  } catch (error) {
    console.error("\n Database validation test suite failed:", error);
    process.exit(1);
  }
}

// Run the tests
runDatabaseValidationTests();
