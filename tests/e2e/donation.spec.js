import { test, expect } from "@playwright/test";

test.describe("Donation Flow", () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto("/login");
    await page.fill('input[placeholder*="Email"]', "test@example.com");
    await page.fill('input[placeholder*="Password"]', "password123");
    await page.click('button:has-text("Login")');
    await page.waitForLoadState("networkidle");
  });

  test("should submit donation successfully", async ({ page }) => {
    // Navigate to donation page
    await page.click("text=Donate");

    // Fill donation form
    await page.fill('input[placeholder*="Full Name"]', "John Doe");
    await page.fill('input[placeholder*="Email"]', "john@example.com");
    await page.selectOption('select[name="bloodType"]', "A+");
    await page.fill('input[placeholder*="Location"]', "New York");

    // Submit form
    await page.click('button:has-text("Submit Donation")');

    // Verify success message
    await expect(
      page.locator("text=Donation submitted successfully")
    ).toBeVisible();
  });

  test("should validate required fields", async ({ page }) => {
    // Navigate to donation page
    await page.click("text=Donate");

    // Try to submit empty form
    await page.click('button:has-text("Submit Donation")');

    // Verify validation messages
    await expect(page.locator("text=Name is required")).toBeVisible();
    await expect(page.locator("text=Email is required")).toBeVisible();
  });

  test("should display donation history", async ({ page }) => {
    // Navigate to donation history
    await page.click("text=My Donations");

    // Verify page loaded
    await expect(page.locator('h1:has-text("Donation History")')).toBeVisible();

    // Check for table or list of donations
    await expect(
      page.locator("table") || page.locator('[data-testid="donation-list"]')
    ).toBeVisible();
  });
});
