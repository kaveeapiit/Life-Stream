import { By } from "selenium-webdriver";
import { SeleniumTestBase } from "./BaseTest.js";

class LoginTests extends SeleniumTestBase {
  constructor(browser = "chrome") {
    super(browser);
  }

  async runAllTests() {
    await this.setUp();

    try {
      console.log("🔐 Starting Login Test Suite...\n");

      // Login functionality tests
      await this.testLoginPageAccess();
      await this.testLoginFormElements();
      await this.testEmptyFormSubmission();
      await this.testInvalidEmailFormat();
      await this.testInvalidCredentials();
      await this.testPasswordVisibilityToggle();
      await this.testNavigationToRegister();
      await this.testLoginFormInteraction();

      console.log("✅ Login tests completed successfully");
    } catch (error) {
      console.error("❌ Login test suite failed:", error);
      this.reporter.addResult(
        "Login Test Suite Error",
        "Login test suite should complete without errors",
        `Suite Error: ${error.message}`,
        "FAIL",
        error.message
      );
    } finally {
      await this.tearDown();
      this.reporter.generateReport();
      this.generateLoginTabularReport();
    }
  }

  async testLoginPageAccess() {
    try {
      // Navigate to homepage first
      await this.navigateTo("/");

      // Find and click login link
      let loginLink;
      try {
        loginLink = await this.driver.findElement(By.linkText("Login"));
      } catch {
        try {
          loginLink = await this.driver.findElement(By.css('a[href="/login"]'));
        } catch {
          loginLink = await this.driver.findElement(By.css('a[href*="login"]'));
        }
      }

      await loginLink.click();
      await this.waitForPageLoad();

      const currentUrl = await this.driver.getCurrentUrl();
      const pageTitle = await this.driver.getTitle();

      const expectedResult = "Successfully access login page";
      const actualResult = `URL: ${currentUrl}, Title: ${pageTitle}`;

      if (currentUrl.includes("login")) {
        this.reporter.addResult(
          "Login Page Access",
          expectedResult,
          actualResult,
          "PASS"
        );
      } else {
        this.reporter.addResult(
          "Login Page Access",
          expectedResult,
          actualResult,
          "FAIL"
        );
      }
    } catch (error) {
      this.reporter.addResult(
        "Login Page Access",
        "Access login page from homepage",
        `Error: ${error.message}`,
        "FAIL",
        error.message
      );
    }
  }

  async testLoginFormElements() {
    try {
      await this.navigateTo("/login");

      // Check for required form elements
      const elements = {
        emailInput: await this.findElement(
          By.css('input[type="email"], input[name="email"]')
        ),
        passwordInput: await this.findElement(
          By.css('input[type="password"], input[name="password"]')
        ),
        submitButton: await this.findElement(
          By.css('button[type="submit"], input[type="submit"]')
        ),
        logo: await this.findElement(
          By.css('img[alt*="logo" i], img[alt*="life stream" i]')
        ),
        title: await this.findElement(By.css("h1, h2")),
      };

      const foundElements = Object.entries(elements)
        .filter(([, element]) => element !== null)
        .map(([name]) => name);

      const expectedResult = "Login form contains all required elements";
      const actualResult = `Found elements: ${foundElements.join(", ")}`;

      if (
        elements.emailInput &&
        elements.passwordInput &&
        elements.submitButton
      ) {
        this.reporter.addResult(
          "Login Form Elements",
          expectedResult,
          actualResult,
          "PASS"
        );
      } else {
        this.reporter.addResult(
          "Login Form Elements",
          expectedResult,
          actualResult,
          "FAIL"
        );
      }
    } catch (error) {
      this.reporter.addResult(
        "Login Form Elements",
        "Check login form has required elements",
        `Error: ${error.message}`,
        "FAIL",
        error.message
      );
    }
  }

  async testEmptyFormSubmission() {
    try {
      await this.navigateTo("/login");

      const submitButton = await this.waitForElementVisible(
        By.css('button[type="submit"], input[type="submit"]'),
        5000
      );

      // Try to submit empty form
      await submitButton.click();
      await this.driver.sleep(2000);

      // Check for validation messages
      const emailInput = await this.driver.findElement(
        By.css('input[type="email"], input[name="email"]')
      );

      const validationMessage = await this.driver.executeScript(
        "return arguments[0].validationMessage;",
        emailInput
      );

      const expectedResult = "Empty form submission shows validation";
      const actualResult = validationMessage
        ? `HTML5 validation: ${validationMessage}`
        : "No validation message found";

      if (validationMessage) {
        this.reporter.addResult(
          "Empty Form Submission",
          expectedResult,
          actualResult,
          "PASS"
        );
      } else {
        this.reporter.addResult(
          "Empty Form Submission",
          expectedResult,
          actualResult,
          "FAIL"
        );
      }
    } catch (error) {
      this.reporter.addResult(
        "Empty Form Submission",
        "Test empty form validation",
        `Error: ${error.message}`,
        "FAIL",
        error.message
      );
    }
  }

  async testInvalidEmailFormat() {
    try {
      await this.navigateTo("/login");

      const emailInput = await this.waitForElementVisible(
        By.css('input[type="email"], input[name="email"]'),
        5000
      );
      const submitButton = await this.waitForElementVisible(
        By.css('button[type="submit"], input[type="submit"]'),
        5000
      );

      // Enter invalid email format
      await emailInput.clear();
      await emailInput.sendKeys("invalid-email");
      await submitButton.click();
      await this.driver.sleep(1000);

      const validationMessage = await this.driver.executeScript(
        "return arguments[0].validationMessage;",
        emailInput
      );

      const expectedResult = "Invalid email format shows validation";
      const actualResult = validationMessage
        ? `Validation: ${validationMessage}`
        : "No email format validation";

      if (validationMessage) {
        this.reporter.addResult(
          "Invalid Email Format",
          expectedResult,
          actualResult,
          "PASS"
        );
      } else {
        this.reporter.addResult(
          "Invalid Email Format",
          expectedResult,
          actualResult,
          "FAIL"
        );
      }
    } catch (error) {
      this.reporter.addResult(
        "Invalid Email Format",
        "Test invalid email format validation",
        `Error: ${error.message}`,
        "FAIL",
        error.message
      );
    }
  }

  async testInvalidCredentials() {
    try {
      await this.navigateTo("/login");

      const emailInput = await this.waitForElementVisible(
        By.css('input[type="email"], input[name="email"]'),
        5000
      );
      const passwordInput = await this.waitForElementVisible(
        By.css('input[type="password"], input[name="password"]'),
        5000
      );
      const submitButton = await this.waitForElementVisible(
        By.css('button[type="submit"], input[type="submit"]'),
        5000
      );

      // Enter invalid credentials
      await emailInput.clear();
      await emailInput.sendKeys("invalid@example.com");
      await passwordInput.clear();
      await passwordInput.sendKeys("wrongpassword123");

      await submitButton.click();

      // Wait for response
      await this.driver.sleep(3000);

      // Check for error message or staying on login page
      let errorFound = false;
      let errorMessage = "";

      try {
        const errorElements = await this.driver.findElements(
          By.css(
            '.error, .text-red-500, .text-red-200, [class*="error"], [class*="red"]'
          )
        );

        for (const element of errorElements) {
          const text = await element.getText();
          if (
            text &&
            (text.toLowerCase().includes("error") ||
              text.toLowerCase().includes("invalid") ||
              text.toLowerCase().includes("failed") ||
              text.toLowerCase().includes("wrong"))
          ) {
            errorFound = true;
            errorMessage = text;
            break;
          }
        }
      } catch {
        // No error elements found
      }

      const currentUrl = await this.driver.getCurrentUrl();

      const expectedResult = "Invalid credentials show error or stay on login";
      const actualResult = errorFound
        ? `Error message: ${errorMessage}`
        : `Stayed on login page: ${currentUrl.includes("login")}`;

      if (errorFound || currentUrl.includes("login")) {
        this.reporter.addResult(
          "Invalid Credentials",
          expectedResult,
          actualResult,
          "PASS"
        );
      } else {
        this.reporter.addResult(
          "Invalid Credentials",
          expectedResult,
          actualResult,
          "FAIL"
        );
      }
    } catch (error) {
      this.reporter.addResult(
        "Invalid Credentials",
        "Test invalid login credentials",
        `Error: ${error.message}`,
        "FAIL",
        error.message
      );
    }
  }

  async testPasswordVisibilityToggle() {
    try {
      await this.navigateTo("/login");

      const passwordInput = await this.waitForElementVisible(
        By.css('input[type="password"], input[name="password"]'),
        5000
      );

      // Fill in some password text
      await passwordInput.sendKeys("testpassword");

      // Look for toggle button
      const toggleButtons = await this.driver.findElements(
        By.css(
          'button[aria-label*="password" i], .fa-eye, .fa-eye-slash, button:has(svg)'
        )
      );

      if (toggleButtons.length > 0) {
        const initialType = await passwordInput.getAttribute("type");

        // Click the toggle button
        await toggleButtons[0].click();
        await this.driver.sleep(500);

        const newType = await passwordInput.getAttribute("type");

        const expectedResult = "Password visibility toggle changes input type";
        const actualResult = `Type changed from ${initialType} to ${newType}`;

        if (initialType !== newType) {
          this.reporter.addResult(
            "Password Visibility Toggle",
            expectedResult,
            actualResult,
            "PASS"
          );
        } else {
          this.reporter.addResult(
            "Password Visibility Toggle",
            expectedResult,
            actualResult,
            "FAIL"
          );
        }
      } else {
        this.reporter.addResult(
          "Password Visibility Toggle",
          "Password toggle button should exist",
          "No toggle button found",
          "FAIL"
        );
      }
    } catch (error) {
      this.reporter.addResult(
        "Password Visibility Toggle",
        "Test password visibility toggle",
        `Error: ${error.message}`,
        "FAIL",
        error.message
      );
    }
  }

  async testNavigationToRegister() {
    try {
      await this.navigateTo("/login");

      // Look for register/sign up link
      let registerLink;
      try {
        registerLink = await this.driver.findElement(By.linkText("Register"));
      } catch {
        try {
          registerLink = await this.driver.findElement(By.linkText("Sign Up"));
        } catch {
          try {
            registerLink = await this.driver.findElement(
              By.css('a[href*="register"], a[href*="signup"]')
            );
          } catch {
            registerLink = await this.driver.findElement(
              By.css('*:contains("Sign Up"), *:contains("Register")')
            );
          }
        }
      }

      if (registerLink) {
        await registerLink.click();
        await this.waitForPageLoad();

        const currentUrl = await this.driver.getCurrentUrl();

        const expectedResult = "Navigate from login to register";
        const actualResult = `Navigated to: ${currentUrl}`;

        if (currentUrl.includes("register") || currentUrl.includes("signup")) {
          this.reporter.addResult(
            "Navigation to Register",
            expectedResult,
            actualResult,
            "PASS"
          );
        } else {
          this.reporter.addResult(
            "Navigation to Register",
            expectedResult,
            actualResult,
            "FAIL"
          );
        }
      } else {
        this.reporter.addResult(
          "Navigation to Register",
          "Register link should be present",
          "No register link found",
          "FAIL"
        );
      }
    } catch (error) {
      this.reporter.addResult(
        "Navigation to Register",
        "Test navigation to register page",
        `Error: ${error.message}`,
        "FAIL",
        error.message
      );
    }
  }

  async testLoginFormInteraction() {
    try {
      await this.navigateTo("/login");

      const emailInput = await this.waitForElementVisible(
        By.css('input[type="email"], input[name="email"]'),
        5000
      );
      const passwordInput = await this.waitForElementVisible(
        By.css('input[type="password"], input[name="password"]'),
        5000
      );

      // Test input interactions
      await emailInput.click();
      await emailInput.sendKeys("test@example.com");

      await passwordInput.click();
      await passwordInput.sendKeys("password123");

      // Check if values were entered
      const emailValue = await emailInput.getAttribute("value");
      const passwordValue = await passwordInput.getAttribute("value");

      const expectedResult = "Form inputs accept and retain values";
      const actualResult = `Email: ${emailValue}, Password: ${
        passwordValue ? "***" : "empty"
      }`;

      if (emailValue && passwordValue) {
        this.reporter.addResult(
          "Login Form Interaction",
          expectedResult,
          actualResult,
          "PASS"
        );
      } else {
        this.reporter.addResult(
          "Login Form Interaction",
          expectedResult,
          actualResult,
          "FAIL"
        );
      }
    } catch (error) {
      this.reporter.addResult(
        "Login Form Interaction",
        "Test form input interactions",
        `Error: ${error.message}`,
        "FAIL",
        error.message
      );
    }
  }

  async findElement(locator) {
    try {
      return await this.driver.findElement(locator);
    } catch {
      return null;
    }
  }

  generateLoginTabularReport() {
    console.log("\n" + "═".repeat(120));
    console.log("🔐 LOGIN FUNCTIONALITY TEST RESULTS");
    console.log("═".repeat(120));

    // Table header
    console.log(
      "┌─────────┬─────────────────────────────────────────┬───────────────────────────────────┬─────────────────────────────────────┬────────┐"
    );
    console.log(
      "│ TEST ID │ TEST NAME                               │ EXPECTED RESULT                   │ ACTUAL RESULT                       │ STATUS │"
    );
    console.log(
      "├─────────┼─────────────────────────────────────────┼───────────────────────────────────┼─────────────────────────────────────┼────────┤"
    );

    // Table rows
    this.reporter.testResults.forEach((result) => {
      const testId = result.testId.padEnd(7);
      const testName = this.truncateString(result.testName, 39).padEnd(39);
      const expected = this.truncateString(result.expectedResult, 33).padEnd(
        33
      );
      const actual = this.truncateString(result.actualResult, 35).padEnd(35);
      const status = result.status === "PASS" ? "✅ PASS" : "❌ FAIL";

      console.log(
        `│ ${testId} │ ${testName} │ ${expected} │ ${actual} │ ${status} │`
      );
    });

    console.log(
      "└─────────┴─────────────────────────────────────────┴───────────────────────────────────┴─────────────────────────────────────┴────────┘"
    );

    // Summary
    const passed = this.reporter.testResults.filter(
      (r) => r.status === "PASS"
    ).length;
    const failed = this.reporter.testResults.filter(
      (r) => r.status === "FAIL"
    ).length;
    const total = this.reporter.testResults.length;

    console.log("\n📊 LOGIN TEST SUMMARY:");
    console.log(`   Total Login Tests: ${total}`);
    console.log(`   ✅ Passed: ${passed}`);
    console.log(`   ❌ Failed: ${failed}`);
    console.log(`   📈 Success Rate: ${((passed / total) * 100).toFixed(1)}%`);
    console.log("═".repeat(120));
  }

  truncateString(str, maxLength) {
    if (str.length <= maxLength) {
      return str;
    }
    return str.substring(0, maxLength - 3) + "...";
  }
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const testSuite = new LoginTests();
  testSuite
    .runAllTests()
    .then(() => {
      console.log("\n🎉 Login test execution completed successfully!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("\n💥 Login test execution failed:", error);
      process.exit(1);
    });
}

export default LoginTests;
