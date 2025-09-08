import AuthenticationTests from "./AuthenticationTests.js";
import DonationTests from "./DonationTests.js";
import { ComprehensiveTests } from "./ComprehensiveTestsSimplified.js";
import { TestReporter } from "./BaseTest.js";
import { promises as fs } from "fs";

class SeleniumTestSuite {
  constructor() {
    this.globalReporter = new TestReporter();
    this.testSuites = [
      { name: "Comprehensive Tests (Simplified)", class: ComprehensiveTests },
      { name: "Authentication Tests", class: AuthenticationTests },
      { name: "Donation Tests", class: DonationTests },
    ];
    this.results = [];
  }

  async runAllTests(browser = "chrome") {
    console.log("\n🧪 Starting Selenium Test Suite...\n");
    console.log("=".repeat(80));

    const startTime = new Date();
    let totalTests = 0;
    let passedTests = 0;
    let failedTests = 0;

    for (const suite of this.testSuites) {
      console.log(`\n📋 Running ${suite.name}...`);
      console.log("-".repeat(50));

      try {
        const testInstance = new suite.class(browser);
        await testInstance.runAllTests();

        // Collect results from this test suite
        const suiteResults = testInstance.reporter.results;
        this.results.push(...suiteResults);

        // Update counters
        totalTests += suiteResults.length;
        passedTests += suiteResults.filter((r) => r.status === "PASS").length;
        failedTests += suiteResults.filter((r) => r.status === "FAIL").length;

        console.log(`✅ ${suite.name} completed: ${suiteResults.length} tests`);
      } catch (error) {
        console.error(`❌ Error running ${suite.name}: ${error.message}`);
        this.results.push({
          testId: `ERR_${Date.now()}`,
          testName: `${suite.name} - Suite Error`,
          expectedResult: "Test suite should run without errors",
          actualResult: `Error: ${error.message}`,
          status: "FAIL",
          timestamp: new Date().toISOString(),
          error: error.message,
        });
        totalTests += 1;
        failedTests += 1;
      }
    }

    const endTime = new Date();
    const duration = (endTime - startTime) / 1000;

    // Generate comprehensive report
    await this.generateComprehensiveReport(
      totalTests,
      passedTests,
      failedTests,
      duration
    );

    console.log("\n" + "=".repeat(80));
    console.log("🏁 Test Suite Execution Complete!");
    console.log(
      `📊 Total Tests: ${totalTests} | ✅ Passed: ${passedTests} | ❌ Failed: ${failedTests}`
    );
    console.log(`⏱️  Duration: ${duration.toFixed(2)} seconds`);
    console.log(
      "📄 Detailed report saved to: tests/selenium/selenium-test-report.html"
    );
    console.log(
      "📋 Results table saved to: tests/selenium/test-results-table.txt"
    );
    console.log("=".repeat(80));

    return {
      total: totalTests,
      passed: passedTests,
      failed: failedTests,
      duration,
      results: this.results,
    };
  }

  async generateComprehensiveReport(
    totalTests,
    passedTests,
    failedTests,
    duration
  ) {
    // Generate tabular text report
    await this.generateTabularReport();

    // Generate HTML report
    await this.generateHTMLReport(
      totalTests,
      passedTests,
      failedTests,
      duration
    );

    // Generate JSON report for CI/CD
    await this.generateJSONReport(
      totalTests,
      passedTests,
      failedTests,
      duration
    );
  }

  async generateTabularReport() {
    let table = "";
    table +=
      "╔══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗\n";
    table +=
      "║                                           SELENIUM TEST RESULTS TABLE                                                       ║\n";
    table +=
      "╠════════════╦═══════════════════════════════════════════╦═══════════════════════════════════════════╦══════════════════════╣\n";
    table +=
      "║ TEST ID    ║ TEST NAME                                 ║ EXPECTED RESULT                           ║ ACTUAL RESULT        ║\n";
    table +=
      "╠════════════╬═══════════════════════════════════════════╬═══════════════════════════════════════════╬══════════════════════╣\n";

    for (let i = 0; i < this.results.length; i++) {
      const result = this.results[i];
      const testId = `TC_${String(i + 1).padStart(3, "0")}`;
      const testName = this.truncateString(result.testName, 40);
      const expected = this.truncateString(result.expectedResult, 40);
      const actual = this.truncateString(result.actualResult, 20);
      const statusIcon = result.status === "PASS" ? "✅" : "❌";

      table += `║ ${testId.padEnd(10)} ║ ${testName.padEnd(
        40
      )} ║ ${expected.padEnd(40)} ║ ${actual.padEnd(18)} ${statusIcon} ║\n`;
    }

    table +=
      "╚════════════╩═══════════════════════════════════════════╩═══════════════════════════════════════════╩══════════════════════╝\n";

    // Add summary
    const passedCount = this.results.filter((r) => r.status === "PASS").length;
    const failedCount = this.results.filter((r) => r.status === "FAIL").length;

    table += "\n";
    table += "📊 TEST SUMMARY:\n";
    table += "═".repeat(50) + "\n";
    table += `Total Tests: ${this.results.length}\n`;
    table += `✅ Passed: ${passedCount}\n`;
    table += `❌ Failed: ${failedCount}\n`;
    table += `📈 Success Rate: ${(
      (passedCount / this.results.length) *
      100
    ).toFixed(1)}%\n`;
    table += "═".repeat(50) + "\n";

    // Save to file
    await fs.writeFile("tests/selenium/test-results-table.txt", table, "utf8");

    // Also print to console
    console.log("\n" + table);
  }

  async generateHTMLReport(totalTests, passedTests, failedTests, duration) {
    const successRate = ((passedTests / totalTests) * 100).toFixed(1);

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Selenium Test Report - Life Stream</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 2.5em;
        }
        .header p {
            margin: 10px 0 0 0;
            opacity: 0.9;
        }
        .summary {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            padding: 30px;
            background: #f8f9fa;
        }
        .summary-card {
            background: white;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .summary-card h3 {
            margin: 0 0 10px 0;
            color: #333;
        }
        .summary-card .number {
            font-size: 2em;
            font-weight: bold;
            margin: 10px 0;
        }
        .passed .number { color: #28a745; }
        .failed .number { color: #dc3545; }
        .total .number { color: #007bff; }
        .rate .number { color: #17a2b8; }
        .results-table {
            margin: 0 30px 30px 30px;
        }
        .results-table h2 {
            color: #333;
            border-bottom: 2px solid #eee;
            padding-bottom: 10px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        th, td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #eee;
        }
        th {
            background: #f8f9fa;
            font-weight: 600;
            color: #333;
        }
        .status-pass {
            color: #28a745;
            font-weight: bold;
        }
        .status-fail {
            color: #dc3545;
            font-weight: bold;
        }
        .test-id {
            font-family: 'Courier New', monospace;
            background: #f8f9fa;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 0.9em;
        }
        .error-details {
            font-size: 0.8em;
            color: #666;
            margin-top: 5px;
            font-style: italic;
        }
        .footer {
            background: #333;
            color: white;
            text-align: center;
            padding: 20px;
        }
        .timestamp {
            color: #999;
            font-size: 0.9em;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🧪 Selenium Test Report</h1>
            <p>Life Stream Blood Donation Management System</p>
            <p class="timestamp">Generated: ${new Date().toLocaleString()}</p>
        </div>
        
        <div class="summary">
            <div class="summary-card total">
                <h3>Total Tests</h3>
                <div class="number">${totalTests}</div>
            </div>
            <div class="summary-card passed">
                <h3>Passed</h3>
                <div class="number">${passedTests}</div>
            </div>
            <div class="summary-card failed">
                <h3>Failed</h3>
                <div class="number">${failedTests}</div>
            </div>
            <div class="summary-card rate">
                <h3>Success Rate</h3>
                <div class="number">${successRate}%</div>
            </div>
        </div>
        
        <div class="results-table">
            <h2>📋 Detailed Test Results</h2>
            <table>
                <thead>
                    <tr>
                        <th>Test ID</th>
                        <th>Test Name</th>
                        <th>Expected Result</th>
                        <th>Actual Result</th>
                        <th>Status</th>
                        <th>Timestamp</th>
                    </tr>
                </thead>
                <tbody>
                    ${this.results
                      .map(
                        (result, index) => `
                        <tr>
                            <td><span class="test-id">TC_${String(
                              index + 1
                            ).padStart(3, "0")}</span></td>
                            <td>${result.testName}</td>
                            <td>${result.expectedResult}</td>
                            <td>
                                ${result.actualResult}
                                ${
                                  result.error
                                    ? `<div class="error-details">Error: ${result.error}</div>`
                                    : ""
                                }
                            </td>
                            <td class="status-${result.status.toLowerCase()}">${
                          result.status === "PASS" ? "✅ PASS" : "❌ FAIL"
                        }</td>
                            <td>${new Date(
                              result.timestamp
                            ).toLocaleTimeString()}</td>
                        </tr>
                    `
                      )
                      .join("")}
                </tbody>
            </table>
        </div>
        
        <div class="footer">
            <p>Test execution completed in ${duration.toFixed(2)} seconds</p>
            <p>Report generated by Selenium WebDriver Test Suite</p>
        </div>
    </div>
</body>
</html>`;

    await fs.writeFile(
      "tests/selenium/selenium-test-report.html",
      html,
      "utf8"
    );
  }

  async generateJSONReport(totalTests, passedTests, failedTests, duration) {
    const report = {
      summary: {
        total: totalTests,
        passed: passedTests,
        failed: failedTests,
        successRate: ((passedTests / totalTests) * 100).toFixed(1),
        duration: duration,
        timestamp: new Date().toISOString(),
      },
      results: this.results.map((result, index) => ({
        testId: `TC_${String(index + 1).padStart(3, "0")}`,
        ...result,
      })),
    };

    await fs.writeFile(
      "tests/selenium/test-results.json",
      JSON.stringify(report, null, 2),
      "utf8"
    );
  }

  truncateString(str, maxLength) {
    if (str.length <= maxLength) {
      return str;
    }
    return str.substring(0, maxLength - 3) + "...";
  }
}

// Main execution function
async function runSeleniumTests() {
  const testSuite = new SeleniumTestSuite();

  try {
    const results = await testSuite.runAllTests("chrome");
    return results;
  } catch (error) {
    console.error("Failed to run test suite:", error);
    process.exit(1);
  }
}

// Export for use in other modules
export { SeleniumTestSuite, runSeleniumTests };

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runSeleniumTests();
}
