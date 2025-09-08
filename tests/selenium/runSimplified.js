#!/usr/bin/env node

import { ComprehensiveTests } from "./ComprehensiveTestsSimplified.js";

async function runSimplifiedTests() {
  console.log("🚀 Starting Life Stream Simplified Functional Tests...\n");

  try {
    const tests = new ComprehensiveTests("chrome");
    await tests.runAllTests();

    console.log("\n✅ Simplified test suite completed successfully!");
  } catch (error) {
    console.error("\n❌ Test suite failed:", error);
    process.exit(1);
  }
}

// Run the tests
runSimplifiedTests();
