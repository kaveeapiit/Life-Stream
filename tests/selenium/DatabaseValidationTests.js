import { By } from "selenium-webdriver";
import { SeleniumTestBase } from "./BaseTest.js";

class DatabaseValidationTests extends SeleniumTestBase {
  constructor(browser = "chrome") {
    super(browser);
  }

  async runAllTests() {
    await this.setUp();

    try {
      console.log(" Starting Life Stream Database Validation Tests...\n");

      // Test actual registration that should save to database
      await this.testActualUserRegistration();

      console.log(" All database validation tests completed");
    } catch (error) {
      console.error(" Test suite failed:", error);
      this.reporter.addResult(
        "Test Suite Error",
        "Test suite should complete without errors",
        `Suite Error: ${error.message}`,
        "FAIL",
        error.message
      );
    } finally {
      await this.tearDown();
      this.reporter.generateReport();
      this.generateTabularReport();
    }
  }

  async testActualUserRegistration() {
    try {
      console.log(" Starting Actual User Registration test...");
      await this.navigateTo("/register");
      await this.driver.sleep(3000);

      // Get current user count from database first
      await this.navigateTo("http://localhost:5050/api/debug/user-count");
      const initialUserCountText = await this.driver
        .findElement(By.css("body"))
        .getText();
      const initialData = JSON.parse(initialUserCountText);
      const initialUserCount = initialData.count || 0;
      console.log(`Initial user count in database: ${initialUserCount}`);

      // Navigate back to registration page
      await this.navigateTo("/register");
      await this.driver.sleep(2000);

      // Fill registration form properly
      const inputs = await this.driver.findElements(By.css("input"));

      if (inputs.length >= 3) {
        const timestamp = Date.now();
        const testEmail = `realuser${timestamp}@example.com`;

        // Fill name field
        await this.driver.executeScript(
          `arguments[0].value = 'Real Test User'; arguments[0].dispatchEvent(new Event('input', { bubbles: true }));`,
          inputs[0]
        );

        // Fill email field
        await this.driver.executeScript(
          `arguments[0].value = '${testEmail}'; arguments[0].dispatchEvent(new Event('input', { bubbles: true }));`,
          inputs[1]
        );

        // Fill password field
        await this.driver.executeScript(
          `arguments[0].value = 'StrongPassword123!'; arguments[0].dispatchEvent(new Event('input', { bubbles: true }));`,
          inputs[2]
        );

        // Check if there's a phone field
        if (inputs.length >= 4) {
          await this.driver.executeScript(
            `arguments[0].value = '1234567890'; arguments[0].dispatchEvent(new Event('input', { bubbles: true }));`,
            inputs[3]
          );
        }

        await this.driver.sleep(1000);

        // Handle blood type dropdown
        try {
          const bloodTypeSelect = await this.driver.findElement(
            By.css("select")
          );
          const options = await bloodTypeSelect.findElements(By.css("option"));

          console.log(`Found ${options.length} blood type options`);

          if (options.length > 1) {
            // Select the first real option (not placeholder)
            await this.driver.executeScript(
              "arguments[0].selectedIndex = 1; arguments[0].dispatchEvent(new Event('change', { bubbles: true }));",
              bloodTypeSelect
            );
            console.log("Selected blood type from dropdown");
          }
        } catch (error) {
          console.log("Error with blood type dropdown:", error.message);
        }

        await this.driver.sleep(1000);

        // Click submit button
        const submitButton = await this.driver.findElement(
          By.css('button[type="submit"]')
        );
        await this.driver.executeScript("arguments[0].click();", submitButton);
        console.log("Clicked submit button");

        // Wait for registration to process
        await this.driver.sleep(5000);

        // Check if user was actually created in database
        await this.navigateTo("http://localhost:5050/api/debug/user-count");
        const finalUserCountText = await this.driver
          .findElement(By.css("body"))
          .getText();
        const finalData = JSON.parse(finalUserCountText);
        const finalUserCount = finalData.count || 0;

        console.log(`Final user count in database: ${finalUserCount}`);

        const userWasCreated = finalUserCount > initialUserCount;
        const currentUrl = await this.driver.getCurrentUrl();

        console.log(`Registration successful: ${userWasCreated}`);
        console.log(`Current URL: ${currentUrl}`);

        this.reporter.addResult(
          "Actual User Registration",
          "User should be created and saved to database",
          userWasCreated
            ? `User created successfully. Email: ${testEmail}, User count: ${initialUserCount} → ${finalUserCount}`
            : `User not created. Email: ${testEmail}, User count remained: ${finalUserCount}`,
          userWasCreated ? "PASS" : "FAIL"
        );
      } else {
        this.reporter.addResult(
          "Actual User Registration",
          "User should be created and saved to database",
          `Insufficient form elements: ${inputs.length} inputs found`,
          "FAIL"
        );
      }
    } catch (error) {
      this.reporter.addResult(
        "Actual User Registration",
        "User should be created and saved to database",
        `Error: ${error.message}`,
        "FAIL"
      );
    }
  }

  generateTabularReport() {
    console.log("\n" + "═".repeat(120));
    console.log(" LIFE STREAM DATABASE VALIDATION TEST RESULTS");
    console.log("═".repeat(120));

    // Table header
    console.log(
      "┌─────────┬───────────────────────────────────────┬─────────────────────────────────┬───────────────────────────────────┬────────┐"
    );
    console.log(
      "│ TEST ID │ TEST NAME                             │ EXPECTED RESULT                 │ ACTUAL RESULT                     │ STATUS │"
    );
    console.log(
      "├─────────┼───────────────────────────────────────┼─────────────────────────────────┼───────────────────────────────────┼────────┤"
    );

    // Table rows
    this.reporter.testResults.forEach((result) => {
      const testId = result.testId.padEnd(7);
      const testName = this.truncateString(result.testName, 37).padEnd(37);
      const expected = this.truncateString(result.expectedResult, 31).padEnd(
        31
      );
      const actual = this.truncateString(result.actualResult, 33).padEnd(33);
      const status = result.status === "PASS" ? " PASS" : " FAIL";

      console.log(
        `│ ${testId} │ ${testName} │ ${expected} │ ${actual} │ ${status} │`
      );
    });

    console.log(
      "└─────────┴───────────────────────────────────────┴─────────────────────────────────┴───────────────────────────────────┴────────┘"
    );

    // Summary
    const totalTests = this.reporter.testResults.length;
    const passedTests = this.reporter.testResults.filter(
      (result) => result.status === "PASS"
    ).length;
    const failedTests = totalTests - passedTests;
    const successRate =
      totalTests > 0 ? ((passedTests / totalTests) * 100).toFixed(1) : 0;

    console.log(
      `\n TEST SUMMARY: ${passedTests}/${totalTests} tests passed (${successRate}% success rate)`
    );
    console.log(` Passed: ${passedTests}`);
    console.log(` Failed: ${failedTests}`);
    console.log("═".repeat(120));
  }

  truncateString(str, maxLength) {
    return str.length > maxLength
      ? str.substring(0, maxLength - 3) + "..."
      : str;
  }
}

export { DatabaseValidationTests };
