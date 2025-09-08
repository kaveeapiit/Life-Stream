import { test, expect } from "@playwright/test";

test.describe("Hospital Dashboard", () => {
  test.beforeEach(async ({ page }) => {
    // Login as hospital user
    await page.goto("/hospital/login");
    await page.fill('input[placeholder*="Username"]', "hospital_test");
    await page.fill('input[placeholder*="Password"]', "hospital123");
    await page.click('button:has-text("Login")');
    await page.waitForLoadState("networkidle");
  });

  test("should display hospital dashboard", async ({ page }) => {
    // Verify dashboard elements
    await expect(
      page.locator('h1:has-text("Hospital Dashboard")')
    ).toBeVisible();
    await expect(page.locator("text=Pending Donations")).toBeVisible();
    await expect(page.locator("text=Blood Inventory")).toBeVisible();
  });

  test("should approve donation", async ({ page }) => {
    // Navigate to pending donations
    await page.click("text=Pending Donations");

    // Find first pending donation and approve
    const firstApproveButton = page
      .locator('button:has-text("Approve")')
      .first();
    if (await firstApproveButton.isVisible()) {
      await firstApproveButton.click();

      // Verify success message
      await expect(page.locator("text=Donation approved")).toBeVisible();
    }
  });

  test("should manage blood inventory", async ({ page }) => {
    // Navigate to blood inventory
    await page.click("text=Blood Inventory");

    // Verify inventory page
    await expect(page.locator('h1:has-text("Blood Inventory")')).toBeVisible();

    // Check for blood type listings
    await expect(page.locator("text=A+")).toBeVisible();
    await expect(page.locator("text=O+")).toBeVisible();
  });

  test("should create blood request", async ({ page }) => {
    // Navigate to blood requests
    await page.click("text=Blood Requests");

    // Click create new request
    await page.click('button:has-text("New Request")');

    // Fill request form
    await page.fill('input[placeholder*="Patient Name"]', "John Patient");
    await page.selectOption('select[name="bloodType"]', "A+");
    await page.fill('input[name="unitsNeeded"]', "2");
    await page.selectOption('select[name="urgencyLevel"]', "urgent");

    // Submit request
    await page.click('button:has-text("Submit Request")');

    // Verify success
    await expect(page.locator("text=Blood request created")).toBeVisible();
  });
});
