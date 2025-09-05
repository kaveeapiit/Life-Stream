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
import hybridHospitalAuth from "../middleware/hybridHospitalAuth.js";

const router = express.Router();

// Get hospital blood inventory with filters
router.get("/inventory", hybridHospitalAuth, getHospitalInventory);

// Get inventory summary for dashboard
router.get("/inventory/summary", hybridHospitalAuth, getInventorySummary);

// Get inventory alerts (low stock + expiring)
router.get("/inventory/alerts", hybridHospitalAuth, getInventoryAlerts);

// Convert approved donation to inventory unit
router.post(
  "/inventory/convert/:donationId",
  hybridHospitalAuth,
  convertDonationToInventory
);

// Update blood unit status (use/expire)
router.put("/inventory/unit/:id", hybridHospitalAuth, updateBloodUnitStatus);

// Mark expired units
router.post("/inventory/mark-expired", hybridHospitalAuth, markExpiredUnits);

// NEW: Get global blood availability across all hospitals
router.get("/global-availability", getGlobalBloodAvailability);

// NEW: Find available blood units for cross-hospital sharing
router.get("/find-available/:bloodType", findAvailableBloodUnits);

// DEBUG: Debug inventory endpoint
router.get("/debug", debugInventory);

export default router;
