import express from "express";
import {
  getHospitalInventory,
  getInventorySummary,
  convertDonationToInventory,
  updateBloodUnitStatus,
  getInventoryAlerts,
  markExpiredUnits,
} from "../controllers/bloodInventoryController.js";

const router = express.Router();

// Get hospital blood inventory with filters
router.get("/inventory", getHospitalInventory);

// Get inventory summary for dashboard
router.get("/inventory/summary", getInventorySummary);

// Get inventory alerts (low stock + expiring)
router.get("/inventory/alerts", getInventoryAlerts);

// Convert approved donation to inventory unit
router.post("/inventory/convert/:donationId", convertDonationToInventory);

// Update blood unit status (use/expire)
router.put("/inventory/unit/:id", updateBloodUnitStatus);

// Mark expired units
router.post("/inventory/mark-expired", markExpiredUnits);

export default router;
