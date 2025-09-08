import { By } from "selenium-webdriver";
import { SeleniumTestBase } from "./BaseTest.js";

class SimpleTests extends SeleniumTestBase {
  constructor(browser = "chrome") {
    super(browser);
  }

  async runAllTests() {
    await this.setUp();

    try {
      console.log("🔍 Starting simple test suite...");

      // TC_001: Test Basic Navigation
      await this.testBasicNavigation();

      // TC_002: Test Page Load
      await this.testPageLoad();

      console.log("✅ Simple tests completed successfully");
    } catch (error) {
      console.error("❌ Test suite failed:", error);
      this.reporter.addResult(
        "Test Suite Error",
        "Test suite should complete without errors",
        `Error: ${error.message}`,
        "FAIL",
        error.message
      );
    } finally {
      await this.tearDown();
      this.reporter.generateReport();
      this.reporter.saveToFile();
    }
  }

  async testBasicNavigation() {
    try {
      console.log("🌐 Testing basic navigation...");

      await this.navigateTo("/");

      const currentUrl = await this.driver.getCurrentUrl();
      const title = await this.driver.getTitle();

      console.log(`📍 Current URL: ${currentUrl}`);
      console.log(`📄 Page Title: ${title}`);

      const expectedResult = "Successfully navigate to the application";
      const actualResult = `Navigated to ${currentUrl} with title "${title}"`;

      if (currentUrl.includes("localhost")) {
        this.reporter.addResult(
          "Basic Navigation",
          expectedResult,
          actualResult,
          "PASS"
        );
      } else {
        this.reporter.addResult(
          "Basic Navigation",
          expectedResult,
          actualResult,
          "FAIL"
        );
      }
    } catch (error) {
      console.error("❌ Basic navigation test failed:", error);
      this.reporter.addResult(
        "Basic Navigation",
        "Navigate to application homepage",
        `Error: ${error.message}`,
        "FAIL",
        error.message
      );
    }
  }

  async testPageLoad() {
    try {
      console.log("⏳ Testing page load...");

      await this.navigateTo("/");

      // Wait for page to load and check for any content
      await this.driver.sleep(2000);

      const bodyElement = await this.driver.findElement(By.css("body"));
      const bodyText = await bodyElement.getText();

      console.log(`📝 Page content length: ${bodyText.length} characters`);

      const expectedResult = "Page loads with content";
      const actualResult = `Page loaded with ${bodyText.length} characters of content`;

      if (bodyText.length > 0) {
        this.reporter.addResult(
          "Page Load Test",
          expectedResult,
          actualResult,
          "PASS"
        );
      } else {
        this.reporter.addResult(
          "Page Load Test",
          expectedResult,
          actualResult,
          "FAIL"
        );
      }
    } catch (error) {
      console.error("❌ Page load test failed:", error);
      this.reporter.addResult(
        "Page Load Test",
        "Page should load with content",
        `Error: ${error.message}`,
        "FAIL",
        error.message
      );
    }
  }
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const testSuite = new SimpleTests();
  testSuite
    .runAllTests()
    .then(() => {
      console.log("🎉 Test execution completed");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Test execution failed:", error);
      process.exit(1);
    });
}

export default SimpleTests;
