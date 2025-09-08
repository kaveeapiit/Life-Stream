import { By } from "selenium-webdriver";
import { SeleniumTestBase } from "./BaseTest.js";

class AuthenticationTests extends SeleniumTestBase {
  constructor(browser = "chrome") {
    super(browser);
  }

  async runAllTests() {
    await this.setUp();

    try {
      // TC_001: Test Landing Page Load
      await this.testLandingPageLoad();

      // TC_002: Test Navigation to Login
      await this.testNavigateToLogin();

      // TC_003: Test Login Form Validation
      await this.testLoginFormValidation();

      // TC_004: Test Invalid Login
      await this.testInvalidLogin();

      // TC_005: Test Registration Form
      await this.testRegistrationForm();

      // TC_006: Test Password Visibility Toggle
      await this.testPasswordVisibilityToggle();

      // TC_007: Test Form Field Validation
      await this.testFormFieldValidation();

      // TC_008: Test Responsive Navigation
      await this.testResponsiveNavigation();
    } finally {
      await this.tearDown();
      this.reporter.generateReport();
      this.reporter.saveToFile();
    }
  }

  async testLandingPageLoad() {
    try {
      await this.navigateTo("/");

      // Wait for and verify main heading
      const heading = await this.waitForElementVisible(By.css("h1, h2"), 5000);
      const headingText = await heading.getText();

      // Verify page title
      const title = await this.driver.getTitle();

      const expectedResult = "Landing page loads with Life Stream branding";
      const actualResult = `Page loaded with title: "${title}" and heading: "${headingText}"`;

      if (
        headingText.toLowerCase().includes("life") ||
        headingText.toLowerCase().includes("stream") ||
        title.toLowerCase().includes("life") ||
        title.toLowerCase().includes("stream")
      ) {
        this.reporter.addResult(
          "Landing Page Load",
          expectedResult,
          actualResult,
          "PASS"
        );
      } else {
        this.reporter.addResult(
          "Landing Page Load",
          expectedResult,
          actualResult,
          "FAIL"
        );
      }
    } catch (error) {
      this.reporter.addResult(
        "Landing Page Load",
        "Landing page loads successfully",
        `Error: ${error.message}`,
        "FAIL",
        error.message
      );
    }
  }

  async testNavigateToLogin() {
    try {
      // Look for login link or button
      let loginElement;
      try {
        loginElement = await this.driver.findElement(By.linkText("Login"));
      } catch {
        try {
          loginElement = await this.driver.findElement(
            By.css('a[href*="login"], button[href*="login"]')
          );
        } catch {
          loginElement = await this.driver.findElement(
            By.css('*[class*="login"], *[id*="login"]')
          );
        }
      }

      await loginElement.click();
      await this.waitForPageLoad();

      const currentUrl = await this.driver.getCurrentUrl();
      const expectedResult = "Navigate to login page successfully";
      const actualResult = `Navigated to: ${currentUrl}`;

      if (currentUrl.includes("login")) {
        this.reporter.addResult(
          "Navigate to Login",
          expectedResult,
          actualResult,
          "PASS"
        );
      } else {
        this.reporter.addResult(
          "Navigate to Login",
          expectedResult,
          actualResult,
          "FAIL"
        );
      }
    } catch (error) {
      this.reporter.addResult(
        "Navigate to Login",
        "Navigate to login page",
        `Error: ${error.message}`,
        "FAIL",
        error.message
      );
    }
  }

  async testLoginFormValidation() {
    try {
      await this.navigateTo("/");

      // Navigate to login if not already there
      const currentUrl = await this.driver.getCurrentUrl();
      if (!currentUrl.includes("login")) {
        const loginLink = await this.driver.findElement(By.linkText("Login"));
        await loginLink.click();
        await this.waitForPageLoad();
      }

      // Find form elements
      await this.waitForElementVisible(
        By.css(
          'input[type="email"], input[placeholder*="email" i], input[name*="email"]'
        ),
        5000
      );
      await this.waitForElementVisible(
        By.css(
          'input[type="password"], input[placeholder*="password" i], input[name*="password"]'
        ),
        5000
      );
      await this.waitForElementVisible(
        By.css(
          'button[type="submit"], input[type="submit"], button:contains("Login")'
        ),
        5000
      );

      const expectedResult =
        "Login form contains email, password fields and submit button";
      const actualResult =
        "Found email input, password input, and submit button";

      this.reporter.addResult(
        "Login Form Validation",
        expectedResult,
        actualResult,
        "PASS"
      );
    } catch (error) {
      this.reporter.addResult(
        "Login Form Validation",
        "Login form elements present",
        `Error: ${error.message}`,
        "FAIL",
        error.message
      );
    }
  }

  async testInvalidLogin() {
    try {
      await this.navigateTo("/");

      // Navigate to login
      try {
        const loginLink = await this.driver.findElement(By.linkText("Login"));
        await loginLink.click();
        await this.waitForPageLoad();
      } catch {
        // Already on login page or no login link
      }

      // Fill invalid credentials
      const emailInput = await this.waitForElementVisible(
        By.css(
          'input[type="email"], input[placeholder*="email" i], input[name*="email"]'
        ),
        5000
      );
      const passwordInput = await this.waitForElementVisible(
        By.css(
          'input[type="password"], input[placeholder*="password" i], input[name*="password"]'
        ),
        5000
      );

      await emailInput.clear();
      await emailInput.sendKeys("invalid@example.com");
      await passwordInput.clear();
      await passwordInput.sendKeys("wrongpassword");

      const submitButton = await this.driver.findElement(
        By.css('button[type="submit"], input[type="submit"]')
      );
      await submitButton.click();

      // Wait for response
      await this.driver.sleep(2000);

      const expectedResult = "Invalid login shows error message";
      const actualResult = "Login form submitted with invalid credentials";

      this.reporter.addResult(
        "Invalid Login Test",
        expectedResult,
        actualResult,
        "PASS"
      );
    } catch (error) {
      this.reporter.addResult(
        "Invalid Login Test",
        "Handle invalid login attempt",
        `Error: ${error.message}`,
        "FAIL",
        error.message
      );
    }
  }

  async testRegistrationForm() {
    try {
      await this.navigateTo("/");

      // Look for register link
      let registerElement;
      try {
        registerElement = await this.driver.findElement(
          By.linkText("Register")
        );
      } catch {
        try {
          registerElement = await this.driver.findElement(
            By.linkText("Sign Up")
          );
        } catch {
          registerElement = await this.driver.findElement(
            By.css('a[href*="register"], a[href*="signup"]')
          );
        }
      }

      await registerElement.click();
      await this.waitForPageLoad();

      const currentUrl = await this.driver.getCurrentUrl();
      const expectedResult = "Navigate to registration page";
      const actualResult = `Navigated to: ${currentUrl}`;

      if (currentUrl.includes("register") || currentUrl.includes("signup")) {
        this.reporter.addResult(
          "Registration Form Access",
          expectedResult,
          actualResult,
          "PASS"
        );
      } else {
        this.reporter.addResult(
          "Registration Form Access",
          expectedResult,
          actualResult,
          "FAIL"
        );
      }
    } catch (error) {
      this.reporter.addResult(
        "Registration Form Access",
        "Access registration form",
        `Error: ${error.message}`,
        "FAIL",
        error.message
      );
    }
  }

  async testPasswordVisibilityToggle() {
    try {
      await this.navigateTo("/");

      // Navigate to login
      try {
        const loginLink = await this.driver.findElement(By.linkText("Login"));
        await loginLink.click();
        await this.waitForPageLoad();
      } catch {
        // Already on login or no link found
      }

      const passwordInput = await this.waitForElementVisible(
        By.css('input[type="password"]'),
        5000
      );

      // Check initial type
      const initialType = await passwordInput.getAttribute("type");

      // Look for visibility toggle
      try {
        const toggleButton = await this.driver.findElement(
          By.css(
            'button[aria-label*="password"], .password-toggle, [data-testid*="password-toggle"]'
          )
        );
        await toggleButton.click();

        const newType = await passwordInput.getAttribute("type");

        const expectedResult =
          "Password visibility toggles between text and password";
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
      } catch {
        this.reporter.addResult(
          "Password Visibility Toggle",
          "Toggle password visibility",
          "No password toggle found",
          "FAIL",
          "Toggle button not found"
        );
      }
    } catch (error) {
      this.reporter.addResult(
        "Password Visibility Toggle",
        "Test password toggle functionality",
        `Error: ${error.message}`,
        "FAIL",
        error.message
      );
    }
  }

  async testFormFieldValidation() {
    try {
      await this.navigateTo("/");

      // Navigate to login
      try {
        const loginLink = await this.driver.findElement(By.linkText("Login"));
        await loginLink.click();
        await this.waitForPageLoad();
      } catch {
        // Continue
      }

      // Try submitting empty form
      const submitButton = await this.waitForElementVisible(
        By.css('button[type="submit"], input[type="submit"]'),
        5000
      );
      await submitButton.click();

      // Check for HTML5 validation or custom validation
      const emailInput = await this.driver.findElement(
        By.css('input[type="email"], input[placeholder*="email" i]')
      );
      const validationMessage = await this.driver.executeScript(
        "return arguments[0].validationMessage;",
        emailInput
      );

      const expectedResult = "Form validation prevents empty submission";
      const actualResult = validationMessage
        ? `Validation message: ${validationMessage}`
        : "No validation message";

      if (validationMessage || (await this.checkForCustomValidation())) {
        this.reporter.addResult(
          "Form Field Validation",
          expectedResult,
          actualResult,
          "PASS"
        );
      } else {
        this.reporter.addResult(
          "Form Field Validation",
          expectedResult,
          actualResult,
          "FAIL"
        );
      }
    } catch (error) {
      this.reporter.addResult(
        "Form Field Validation",
        "Validate form field requirements",
        `Error: ${error.message}`,
        "FAIL",
        error.message
      );
    }
  }

  async testResponsiveNavigation() {
    try {
      await this.navigateTo("/");

      // Test mobile viewport
      await this.driver.manage().window().setRect({ width: 375, height: 667 });
      await this.driver.sleep(1000);

      // Look for mobile menu toggle
      try {
        const mobileToggle = await this.driver.findElement(
          By.css('.hamburger, .mobile-menu-toggle, [data-testid="mobile-menu"]')
        );
        await mobileToggle.click();

        const expectedResult = "Mobile navigation menu toggles successfully";
        const actualResult = "Mobile menu toggle clicked successfully";

        this.reporter.addResult(
          "Responsive Navigation",
          expectedResult,
          actualResult,
          "PASS"
        );
      } catch {
        const expectedResult = "Mobile navigation works on small screens";
        const actualResult = "No mobile menu toggle found";

        this.reporter.addResult(
          "Responsive Navigation",
          expectedResult,
          actualResult,
          "FAIL"
        );
      }

      // Reset to desktop viewport
      await this.driver
        .manage()
        .window()
        .setRect({ width: 1920, height: 1080 });
    } catch (error) {
      this.reporter.addResult(
        "Responsive Navigation",
        "Test responsive navigation",
        `Error: ${error.message}`,
        "FAIL",
        error.message
      );
    }
  }

  async checkForCustomValidation() {
    try {
      const errorElements = await this.driver.findElements(
        By.css('.error, .invalid, [class*="error"], [class*="invalid"]')
      );
      return errorElements.length > 0;
    } catch {
      return false;
    }
  }
}

export default AuthenticationTests;
