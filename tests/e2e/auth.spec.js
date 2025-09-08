import { test, expect } from "@playwright/test";

test.describe("Authentication Flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should register a new user", async ({ page }) => {
    // Navigate to register page
    await page.click("text=Register");

    // Fill registration form
    await page.fill('input[placeholder*="Name"]', "Test User");
    await page.fill(
      'input[placeholder*="Email"]',
      `test${Date.now()}@example.com`
    );
    await page.fill('input[placeholder*="Password"]', "TestPassword123!");
    await page.selectOption('select[name="bloodType"]', "O+");

    // Submit form
    await page.click('button:has-text("Register")');

    // Verify success message
    await expect(page.locator("text=Registration successful")).toBeVisible();
  });

  test("should login existing user", async ({ page }) => {
    // Navigate to login page
    await page.click("text=Login");

    // Fill login form
    await page.fill('input[placeholder*="Email"]', "test@example.com");
    await page.fill('input[placeholder*="Password"]', "password123");

    // Submit form
    await page.click('button:has-text("Login")');

    // Verify successful login (check for dashboard or user menu)
    await expect(
      page.locator("text=Welcome") || page.locator("text=Dashboard")
    ).toBeVisible();
  });

  test("should show error for invalid credentials", async ({ page }) => {
    // Navigate to login page
    await page.click("text=Login");

    // Fill login form with invalid credentials
    await page.fill('input[placeholder*="Email"]', "invalid@example.com");
    await page.fill('input[placeholder*="Password"]', "wrongpassword");

    // Submit form
    await page.click('button:has-text("Login")');

    // Verify error message
    await expect(page.locator("text=Invalid credentials")).toBeVisible();
  });

  test("should logout user", async ({ page }) => {
    // Login first
    await page.click("text=Login");
    await page.fill('input[placeholder*="Email"]', "test@example.com");
    await page.fill('input[placeholder*="Password"]', "password123");
    await page.click('button:has-text("Login")');

    // Wait for login to complete
    await page.waitForLoadState("networkidle");

    // Logout
    await page.click("text=Logout");

    // Verify redirect to home page
    await expect(page.locator("text=Login")).toBeVisible();
  });
});
