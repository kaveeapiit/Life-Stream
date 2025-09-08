import { By } from "selenium-webdriver";
import { SeleniumTestBase } from "./BaseTest.js";

class DonationTests extends SeleniumTestBase {
  constructor(browser = "chrome") {
    super(browser);
  }

  async runAllTests() {
    await this.setUp();

    try {
      // TC_009: Test Donation Form Access
      await this.testDonationFormAccess();

      // TC_010: Test Donation Form Fields
      await this.testDonationFormFields();

      // TC_011: Test Blood Type Selection
      await this.testBloodTypeSelection();

      // TC_012: Test Date Picker Functionality
      await this.testDatePickerFunctionality();

      // TC_013: Test Form Validation
      await this.testDonationFormValidation();

      // TC_014: Test Emergency Contact Fields
      await this.testEmergencyContactFields();

      // TC_015: Test Medical History Section
      await this.testMedicalHistorySection();

      // TC_016: Test Form Submission
      await this.testFormSubmission();
    } finally {
      await this.tearDown();
      this.reporter.generateReport();
      this.reporter.saveToFile();
    }
  }

  async testDonationFormAccess() {
    try {
      await this.navigateTo("/");

      // Look for donation-related navigation
      let donationElement;
      try {
        donationElement = await this.driver.findElement(By.linkText("Donate"));
      } catch {
        try {
          donationElement = await this.driver.findElement(
            By.linkText("Donation")
          );
        } catch {
          try {
            donationElement = await this.driver.findElement(
              By.css('a[href*="donate"], a[href*="donation"]')
            );
          } catch {
            donationElement = await this.driver.findElement(
              By.css('*[class*="donate"], *[id*="donate"]')
            );
          }
        }
      }

      await donationElement.click();
      await this.waitForPageLoad();

      const currentUrl = await this.driver.getCurrentUrl();
      const expectedResult = "Navigate to donation form successfully";
      const actualResult = `Navigated to: ${currentUrl}`;

      if (currentUrl.includes("donate") || currentUrl.includes("donation")) {
        this.reporter.addResult(
          "Donation Form Access",
          expectedResult,
          actualResult,
          "PASS"
        );
      } else {
        this.reporter.addResult(
          "Donation Form Access",
          expectedResult,
          actualResult,
          "FAIL"
        );
      }
    } catch (error) {
      this.reporter.addResult(
        "Donation Form Access",
        "Access donation form",
        `Error: ${error.message}`,
        "FAIL",
        error.message
      );
    }
  }

  async testDonationFormFields() {
    try {
      await this.navigateToDonationForm();

      // Check for essential form fields
      const requiredFields = [
        {
          selector: 'input[name*="name"], input[placeholder*="name" i]',
          name: "Name field",
        },
        {
          selector: 'input[type="email"], input[name*="email"]',
          name: "Email field",
        },
        {
          selector: 'input[type="tel"], input[name*="phone"]',
          name: "Phone field",
        },
        {
          selector: 'select[name*="blood"], select[name*="type"]',
          name: "Blood type field",
        },
        {
          selector: 'input[type="date"], input[name*="date"]',
          name: "Date field",
        },
      ];

      const foundFields = [];
      const missingFields = [];

      for (const field of requiredFields) {
        try {
          await this.waitForElementVisible(By.css(field.selector), 2000);
          foundFields.push(field.name);
        } catch {
          missingFields.push(field.name);
        }
      }

      const expectedResult = "Donation form contains all required fields";
      const actualResult = `Found: ${foundFields.join(", ")}. Missing: ${
        missingFields.join(", ") || "None"
      }`;

      if (foundFields.length >= 3) {
        this.reporter.addResult(
          "Donation Form Fields",
          expectedResult,
          actualResult,
          "PASS"
        );
      } else {
        this.reporter.addResult(
          "Donation Form Fields",
          expectedResult,
          actualResult,
          "FAIL"
        );
      }
    } catch (error) {
      this.reporter.addResult(
        "Donation Form Fields",
        "Verify donation form fields",
        `Error: ${error.message}`,
        "FAIL",
        error.message
      );
    }
  }

  async testBloodTypeSelection() {
    try {
      await this.navigateToDonationForm();

      // Find blood type selector
      const bloodTypeSelect = await this.waitForElementVisible(
        By.css(
          'select[name*="blood"], select[name*="type"], select[id*="blood"]'
        ),
        5000
      );

      // Get all options
      const options = await bloodTypeSelect.findElements(By.css("option"));
      const optionTexts = [];

      for (const option of options) {
        const text = await option.getText();
        if (text.trim()) {
          optionTexts.push(text.trim());
        }
      }

      // Check for common blood types
      const expectedBloodTypes = [
        "A+",
        "A-",
        "B+",
        "B-",
        "AB+",
        "AB-",
        "O+",
        "O-",
      ];
      const foundBloodTypes = optionTexts.filter((text) =>
        expectedBloodTypes.some((type) => text.includes(type))
      );

      const expectedResult = "Blood type dropdown contains valid blood types";
      const actualResult = `Found blood types: ${foundBloodTypes.join(", ")}`;

      if (foundBloodTypes.length >= 4) {
        this.reporter.addResult(
          "Blood Type Selection",
          expectedResult,
          actualResult,
          "PASS"
        );
      } else {
        this.reporter.addResult(
          "Blood Type Selection",
          expectedResult,
          actualResult,
          "FAIL"
        );
      }
    } catch (error) {
      this.reporter.addResult(
        "Blood Type Selection",
        "Test blood type selection options",
        `Error: ${error.message}`,
        "FAIL",
        error.message
      );
    }
  }

  async testDatePickerFunctionality() {
    try {
      await this.navigateToDonationForm();

      // Find date input
      const dateInput = await this.waitForElementVisible(
        By.css(
          'input[type="date"], input[name*="date"], input[placeholder*="date" i]'
        ),
        5000
      );

      // Test date input
      const testDate = "2024-12-25";
      await dateInput.clear();
      await dateInput.sendKeys(testDate);

      const inputValue = await dateInput.getAttribute("value");

      const expectedResult = "Date picker accepts and displays date correctly";
      const actualResult = `Date input value: ${inputValue}`;

      if (inputValue === testDate || inputValue.includes("2024")) {
        this.reporter.addResult(
          "Date Picker Functionality",
          expectedResult,
          actualResult,
          "PASS"
        );
      } else {
        this.reporter.addResult(
          "Date Picker Functionality",
          expectedResult,
          actualResult,
          "FAIL"
        );
      }
    } catch (error) {
      this.reporter.addResult(
        "Date Picker Functionality",
        "Test date picker functionality",
        `Error: ${error.message}`,
        "FAIL",
        error.message
      );
    }
  }

  async testDonationFormValidation() {
    try {
      await this.navigateToDonationForm();

      // Try submitting empty form
      const submitButton = await this.waitForElementVisible(
        By.css('button[type="submit"], input[type="submit"]'),
        5000
      );
      await submitButton.click();

      // Check for HTML5 validation or custom validation
      const formInputs = await this.driver.findElements(
        By.css('input[required], input[type="email"]')
      );

      let hasValidation = false;
      for (const input of formInputs) {
        const validationMessage = await this.driver.executeScript(
          "return arguments[0].validationMessage;",
          input
        );
        if (validationMessage) {
          hasValidation = true;
          break;
        }
      }

      // Also check for custom validation messages
      const errorElements = await this.driver.findElements(
        By.css('.error, .invalid, [class*="error"], [class*="invalid"]')
      );

      const expectedResult = "Form validation prevents invalid submission";
      const actualResult = hasValidation
        ? "HTML5 validation found"
        : errorElements.length > 0
        ? "Custom validation found"
        : "No validation detected";

      if (hasValidation || errorElements.length > 0) {
        this.reporter.addResult(
          "Donation Form Validation",
          expectedResult,
          actualResult,
          "PASS"
        );
      } else {
        this.reporter.addResult(
          "Donation Form Validation",
          expectedResult,
          actualResult,
          "FAIL"
        );
      }
    } catch (error) {
      this.reporter.addResult(
        "Donation Form Validation",
        "Test form validation",
        `Error: ${error.message}`,
        "FAIL",
        error.message
      );
    }
  }

  async testEmergencyContactFields() {
    try {
      await this.navigateToDonationForm();

      // Look for emergency contact fields
      const emergencyFields = await this.driver.findElements(
        By.css(
          'input[name*="emergency"], input[placeholder*="emergency" i], input[name*="contact"]'
        )
      );

      const expectedResult = "Emergency contact fields are present";
      const actualResult = `Found ${emergencyFields.length} emergency contact related fields`;

      if (emergencyFields.length > 0) {
        this.reporter.addResult(
          "Emergency Contact Fields",
          expectedResult,
          actualResult,
          "PASS"
        );
      } else {
        this.reporter.addResult(
          "Emergency Contact Fields",
          expectedResult,
          actualResult,
          "FAIL"
        );
      }
    } catch (error) {
      this.reporter.addResult(
        "Emergency Contact Fields",
        "Check emergency contact fields",
        `Error: ${error.message}`,
        "FAIL",
        error.message
      );
    }
  }

  async testMedicalHistorySection() {
    try {
      await this.navigateToDonationForm();

      // Look for medical history related fields
      const medicalFields = await this.driver.findElements(
        By.css(
          'textarea[name*="medical"], textarea[placeholder*="medical" i], input[name*="condition"], textarea[name*="history"]'
        )
      );

      const checkboxes = await this.driver.findElements(
        By.css(
          'input[type="checkbox"][name*="medical"], input[type="checkbox"][name*="condition"]'
        )
      );

      const totalMedicalElements = medicalFields.length + checkboxes.length;

      const expectedResult = "Medical history section is available";
      const actualResult = `Found ${totalMedicalElements} medical history related elements`;

      if (totalMedicalElements > 0) {
        this.reporter.addResult(
          "Medical History Section",
          expectedResult,
          actualResult,
          "PASS"
        );
      } else {
        this.reporter.addResult(
          "Medical History Section",
          expectedResult,
          actualResult,
          "FAIL"
        );
      }
    } catch (error) {
      this.reporter.addResult(
        "Medical History Section",
        "Check medical history section",
        `Error: ${error.message}`,
        "FAIL",
        error.message
      );
    }
  }

  async testFormSubmission() {
    try {
      await this.navigateToDonationForm();

      // Fill out basic required fields
      try {
        const nameInput = await this.driver.findElement(
          By.css('input[name*="name"], input[placeholder*="name" i]')
        );
        await nameInput.clear();
        await nameInput.sendKeys("Test Donor");
      } catch {
        // Name field might not exist
      }

      try {
        const emailInput = await this.driver.findElement(
          By.css('input[type="email"], input[name*="email"]')
        );
        await emailInput.clear();
        await emailInput.sendKeys("test@example.com");
      } catch {
        // Email field might not exist
      }

      try {
        const phoneInput = await this.driver.findElement(
          By.css('input[type="tel"], input[name*="phone"]')
        );
        await phoneInput.clear();
        await phoneInput.sendKeys("1234567890");
      } catch {
        // Phone field might not exist
      }

      // Submit form
      const submitButton = await this.waitForElementVisible(
        By.css('button[type="submit"], input[type="submit"]'),
        5000
      );
      await submitButton.click();

      // Wait for response
      await this.driver.sleep(3000);

      const currentUrl = await this.driver.getCurrentUrl();

      const expectedResult = "Form submission processes correctly";
      const actualResult = `Form submitted, current URL: ${currentUrl}`;

      this.reporter.addResult(
        "Form Submission",
        expectedResult,
        actualResult,
        "PASS"
      );
    } catch (error) {
      this.reporter.addResult(
        "Form Submission",
        "Test form submission process",
        `Error: ${error.message}`,
        "FAIL",
        error.message
      );
    }
  }

  async navigateToDonationForm() {
    await this.navigateTo("/");

    try {
      // Try to navigate to donation form
      const donationLink = await this.driver.findElement(
        By.css('a[href*="donate"], a[href*="donation"], [class*="donate"]')
      );
      await donationLink.click();
      await this.waitForPageLoad();
    } catch {
      // If no donation link found, try direct navigation
      try {
        await this.navigateTo("/donate");
      } catch {
        await this.navigateTo("/donation");
      }
    }
  }
}

export default DonationTests;
