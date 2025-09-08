# Selenium Test Automation Framework

## Overview

This Selenium WebDriver test automation framework provides comprehensive browser-based testing for the Life Stream Blood Donation Management System. The framework generates detailed test reports in multiple formats including tabular text output, HTML reports, and JSON data.

## Features

- **Cross-browser Testing**: Support for Chrome, Firefox, and Edge browsers
- **Comprehensive Test Coverage**: Authentication, donation forms, and user workflows
- **Multiple Report Formats**:
  - Tabular text report (`test-results-table.txt`)
  - Interactive HTML report (`selenium-test-report.html`)
  - JSON data report (`test-results.json`)
- **Automatic Screenshots**: Captures screenshots on test failures
- **Detailed Logging**: Comprehensive test execution logs

## Test Structure

### Test Suites

1. **Authentication Tests** (`AuthenticationTests.js`)

   - Landing page load verification
   - Navigation to login/registration
   - Form validation testing
   - Invalid login handling
   - Password visibility toggle
   - Responsive navigation

2. **Donation Tests** (`DonationTests.js`)
   - Donation form access
   - Form field validation
   - Blood type selection
   - Date picker functionality
   - Emergency contact fields
   - Medical history sections
   - Form submission process

### Test IDs and Coverage

```
TC_001: Landing Page Load
TC_002: Navigate to Login
TC_003: Login Form Validation
TC_004: Invalid Login Test
TC_005: Registration Form Access
TC_006: Password Visibility Toggle
TC_007: Form Field Validation
TC_008: Responsive Navigation
TC_009: Donation Form Access
TC_010: Donation Form Fields
TC_011: Blood Type Selection
TC_012: Date Picker Functionality
TC_013: Donation Form Validation
TC_014: Emergency Contact Fields
TC_015: Medical History Section
TC_016: Form Submission
```

## Installation and Setup

### Prerequisites

- Node.js (v16 or higher)
- Chrome browser (for Chrome WebDriver)
- Firefox browser (for Gecko WebDriver) - Optional

### Install Dependencies

```bash
npm install selenium-webdriver chromedriver geckodriver
```

### Browser Driver Setup

The framework automatically manages browser drivers through the installed packages:

- **Chrome**: Uses `chromedriver` package
- **Firefox**: Uses `geckodriver` package

## Running Tests

### Command Line Options

1. **Run all Selenium tests**:

   ```bash
   npm run test:selenium
   ```

2. **Run individual test suites**:

   ```bash
   node tests/selenium/AuthenticationTests.js
   node tests/selenium/DonationTests.js
   ```

3. **Run with specific browser**:

   ```bash
   # Chrome (default)
   node tests/selenium/TestRunner.js

   # Firefox
   BROWSER=firefox node tests/selenium/TestRunner.js
   ```

### Test Configuration

The tests can be configured by modifying the `BaseTest.js` file:

```javascript
// Default timeout for element waiting
const DEFAULT_TIMEOUT = 10000;

// Screenshot settings
const SCREENSHOT_ON_FAILURE = true;

// Browser options
const BROWSER_OPTIONS = {
  chrome: ["--headless", "--no-sandbox", "--disable-dev-shm-usage"],
  firefox: ["--headless"],
};
```

## Test Reports

### 1. Tabular Text Report

Located at: `tests/selenium/test-results-table.txt`

Example output:

```
╔══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗
║                                           SELENIUM TEST RESULTS TABLE                                                       ║
╠════════════╦═══════════════════════════════════════════╦═══════════════════════════════════════════╦══════════════════════╣
║ TEST ID    ║ TEST NAME                                 ║ EXPECTED RESULT                           ║ ACTUAL RESULT        ║
╠════════════╬═══════════════════════════════════════════╬═══════════════════════════════════════════╬══════════════════════╣
║ TC_001     ║ Landing Page Load                         ║ Landing page loads with Life Stream       ║ Page loaded with...  ✅ ║
║ TC_002     ║ Navigate to Login                         ║ Navigate to login page successfully       ║ Navigated to: /login ✅ ║
╚════════════╩═══════════════════════════════════════════╩═══════════════════════════════════════════╩══════════════════════╝
```

### 2. HTML Report

Located at: `tests/selenium/selenium-test-report.html`

Features:

- Interactive web-based report
- Test summary dashboard
- Detailed test results table
- Error details and timestamps
- Professional styling

### 3. JSON Report

Located at: `tests/selenium/test-results.json`

Structure:

```json
{
  "summary": {
    "total": 16,
    "passed": 14,
    "failed": 2,
    "successRate": "87.5",
    "duration": 45.2,
    "timestamp": "2024-01-01T12:00:00.000Z"
  },
  "results": [
    {
      "testId": "TC_001",
      "testName": "Landing Page Load",
      "expectedResult": "Landing page loads with Life Stream branding",
      "actualResult": "Page loaded with title: 'Life Stream'",
      "status": "PASS",
      "timestamp": "2024-01-01T12:00:00.000Z"
    }
  ]
}
```

## Test Development

### Adding New Tests

1. **Create new test class**:

   ```javascript
   import { By } from "selenium-webdriver";
   import { SeleniumTestBase } from "./BaseTest.js";

   class NewTestSuite extends SeleniumTestBase {
     async runAllTests() {
       await this.setUp();
       try {
         await this.testNewFeature();
       } finally {
         await this.tearDown();
         this.reporter.generateReport();
         this.reporter.saveToFile();
       }
     }

     async testNewFeature() {
       // Test implementation
     }
   }
   ```

2. **Add to TestRunner.js**:

   ```javascript
   import NewTestSuite from "./NewTestSuite.js";

   this.testSuites = [
     { name: "Authentication Tests", class: AuthenticationTests },
     { name: "Donation Tests", class: DonationTests },
     { name: "New Feature Tests", class: NewTestSuite },
   ];
   ```

### Best Practices

1. **Use meaningful test names**: Clearly describe what the test validates
2. **Implement proper waits**: Use `waitForElementVisible()` instead of `sleep()`
3. **Handle exceptions gracefully**: Always use try-catch blocks
4. **Clean up resources**: Ensure `tearDown()` is called in finally blocks
5. **Validate results properly**: Check both positive and negative scenarios

## Troubleshooting

### Common Issues

1. **Browser driver not found**:

   ```bash
   npm install chromedriver geckodriver
   ```

2. **Element not found**:

   - Check element selectors
   - Increase timeout values
   - Ensure page is fully loaded

3. **Tests failing in headless mode**:

   - Run with visible browser first
   - Check window size settings
   - Verify element visibility

4. **Network timeouts**:
   - Increase page load timeout
   - Check application availability
   - Verify correct URLs

### Debug Mode

Run tests with visible browser for debugging:

```javascript
// In BaseTest.js, comment out headless options
const options = new chrome.Options();
// options.addArguments('--headless');
```

## CI/CD Integration

The JSON report format makes it easy to integrate with CI/CD pipelines:

```bash
# Run tests and check exit code
npm run test:selenium
if [ $? -eq 0 ]; then
  echo "All tests passed"
else
  echo "Some tests failed"
  exit 1
fi
```

## Support

For issues or questions about the Selenium test framework, please check:

1. Browser compatibility requirements
2. WebDriver version compatibility
3. Application URL configuration
4. Network connectivity

The framework is designed to be robust and provide detailed feedback for any issues encountered during test execution.
