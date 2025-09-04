import express from "express";
import {
  getHospitalInventory,
  getInventorySummary,
  convertDonationToInventory,
  updateBloodUnitStatus,
  getInventoryAlerts,
  markExpiredUnits,
  getGlobalBloodAvailability,
  findAvailableBloodUnits,
  debugInventory,
} from "../controllers/bloodInventoryController.js";
import hospitalAuth from "../middleware/hospitalAuth.js";

const router = express.Router();

// Debug endpoint (no auth required for testing)
router.get("/debug", debugInventory);

// Get hospital blood inventory with filters
router.get("/inventory", hospitalAuth, getHospitalInventory);

// Get inventory summary for dashboard
router.get("/inventory/summary", hospitalAuth, getInventorySummary);

// Get inventory alerts (low stock + expiring)
router.get("/inventory/alerts", hospitalAuth, getInventoryAlerts);

// Convert approved donation to inventory unit
router.post(
  "/inventory/convert/:donationId",
  hospitalAuth,
  convertDonationToInventory
);

// Update blood unit status (use/expire)
router.put("/inventory/unit/:id", hospitalAuth, updateBloodUnitStatus);

// Mark expired units
router.post("/inventory/mark-expired", hospitalAuth, markExpiredUnits);

// NEW: Get global blood availability across all hospitals
router.get("/global-availability", getGlobalBloodAvailability);

// NEW: Find available blood units for cross-hospital sharing
router.get("/find-available/:bloodType", findAvailableBloodUnits);

// DEBUG: Debug inventory endpoint
router.get("/debug", debugInventory);

export default router;
