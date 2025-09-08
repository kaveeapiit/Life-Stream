import { Builder, By, until, WebDriver } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";
import firefox from "selenium-webdriver/firefox.js";
import fs from "fs";

class TestReporter {
  constructor() {
    this.testResults = [];
    this.testCounter = 1;
  }

  addResult(testName, expectedResult, actualResult, status, error = null) {
    this.testResults.push({
      testId: `TC_${String(this.testCounter).padStart(3, "0")}`,
      testName,
      expectedResult,
      actualResult,
      status,
      error,
      timestamp: new Date().toISOString(),
    });
    this.testCounter++;
  }

  generateReport() {
    const passedTests = this.testResults.filter(
      (r) => r.status === "PASS"
    ).length;
    const failedTests = this.testResults.filter(
      (r) => r.status === "FAIL"
    ).length;
    const totalTests = this.testResults.length;

    console.log("\n" + "=".repeat(120));
    console.log("                           SELENIUM TEST AUTOMATION RESULTS");
    console.log("=".repeat(120));
    console.log(
      `Total Tests: ${totalTests} | Passed: ${passedTests} | Failed: ${failedTests} | Success Rate: ${(
        (passedTests / totalTests) *
        100
      ).toFixed(1)}%`
    );
    console.log("=".repeat(120));

    // Table header
    console.log(
      "| Test ID | Test Name                                    | Expected Result              | Actual Result                | Status |"
    );
    console.log(
      "|---------|----------------------------------------------|------------------------------|------------------------------|--------|"
    );

    // Table rows
    this.testResults.forEach((result) => {
      const testId = result.testId.padEnd(7);
      const testName = result.testName.substring(0, 44).padEnd(44);
      const expected = result.expectedResult.substring(0, 28).padEnd(28);
      const actual = result.actualResult.substring(0, 28).padEnd(28);
      const status = result.status === "PASS" ? "PASS" : "FAIL";

      console.log(
        `| ${testId} | ${testName} | ${expected} | ${actual} | ${status.padEnd(
          6
        )} |`
      );

      if (result.error) {
        console.log(
          `|         | Error: ${result.error.substring(0, 100).padEnd(100)} |`
        );
      }
    });

    console.log("=".repeat(120));
    return this.testResults;
  }

  saveToFile() {
    const reportData = {
      summary: {
        totalTests: this.testResults.length,
        passedTests: this.testResults.filter((r) => r.status === "PASS").length,
        failedTests: this.testResults.filter((r) => r.status === "FAIL").length,
        executionDate: new Date().toISOString(),
      },
      testResults: this.testResults,
    };

    fs.writeFileSync("test-results.json", JSON.stringify(reportData, null, 2));
    console.log("\n📄 Test results saved to: test-results.json");
  }
}

class SeleniumTestBase {
  constructor(browser = "chrome") {
    this.driver = null;
    this.browser = browser;
    this.baseUrl = "http://localhost:5173"; // Vite dev server URL
    this.reporter = new TestReporter();
    this.screenshotCounter = 0;
  }

  async setUp() {
    try {
      let options;

      if (this.browser === "chrome") {
        options = new chrome.Options();
        // Remove headless mode for debugging
        // options.addArguments('--headless');
        options.addArguments("--no-sandbox");
        options.addArguments("--disable-dev-shm-usage");
        options.addArguments("--disable-web-security");
        options.addArguments("--window-size=1920,1080");
        this.driver = await new Builder()
          .forBrowser("chrome")
          .setChromeOptions(options)
          .build();
      } else if (this.browser === "firefox") {
        options = new firefox.Options();
        // options.addArguments('--headless');
        this.driver = await new Builder()
          .forBrowser("firefox")
          .setFirefoxOptions(options)
          .build();
      }

      await this.driver
        .manage()
        .window()
        .setRect({ width: 1920, height: 1080 });
      await this.driver.manage().setTimeouts({ implicit: 10000 });

      console.log(` ${this.browser} browser started successfully`);
    } catch (error) {
      console.error("❌ Failed to start browser:", error.message);
      throw error;
    }
  }

  async tearDown() {
    if (this.driver) {
      await this.driver.quit();
      console.log(` ${this.browserName} browser closed`);
    }
  }

  async navigateTo(url) {
    const fullUrl = url.startsWith("http") ? url : `${this.baseUrl}${url}`;
    await this.driver.get(fullUrl);
    await this.waitForPageLoad();
  }

  async waitForPageLoad() {
    await this.driver.wait(
      () =>
        this.driver
          .executeScript("return document.readyState")
          .then((state) => state === "complete"),
      10000
    );
  }

  async waitForElement(locator, timeout = 10000) {
    return await this.driver.wait(until.elementLocated(locator), timeout);
  }

  async waitForElementVisible(locator, timeout = 10000) {
    const element = await this.waitForElement(locator, timeout);
    await this.driver.wait(until.elementIsVisible(element), timeout);
    return element;
  }

  async takeScreenshot(filename) {
    const screenshot = await this.driver.takeScreenshot();
    fs.writeFileSync(`screenshots/${filename}`, screenshot, "base64");
  }

  async executeTest(testName, testFunction) {
    try {
      console.log(`\n🧪 Executing: ${testName}`);
      const result = await testFunction.call(this);
      console.log(`✅ ${testName} - PASSED`);
      return result;
    } catch (error) {
      console.log(`❌ ${testName} - FAILED: ${error.message}`);
      await this.takeScreenshot(`${testName.replace(/\s+/g, "_")}_failure.png`);
      throw error;
    }
  }
}

export { SeleniumTestBase, TestReporter };
