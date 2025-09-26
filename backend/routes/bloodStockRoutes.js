import express from "express";
import {
  getHospitalBloodStock,
  updateBloodStock,
  updateMultipleBloodStock,
  getBloodStockSummary,
  getLowStockAlerts,
  getBloodTypeStock,
} from "../controllers/bloodStockController.js";
import hybridHospitalAuth from "../middleware/hybridHospitalAuth.js";

const router = express.Router();

// 🩸 Hospital Blood Stock Management Routes

// Get all blood stock for hospital
router.get("/blood-stock", hybridHospitalAuth, getHospitalBloodStock);

// Get blood stock summary for dashboard
router.get("/blood-stock/summary", hybridHospitalAuth, getBloodStockSummary);

// Get low stock alerts
router.get("/blood-stock/alerts", hybridHospitalAuth, getLowStockAlerts);

// Get stock for specific blood type
router.get("/blood-stock/:bloodType", hybridHospitalAuth, getBloodTypeStock);

// Update stock for specific blood type
router.put("/blood-stock/:bloodType", hybridHospitalAuth, updateBloodStock);

// Update multiple blood stock entries at once
router.put("/blood-stock", hybridHospitalAuth, updateMultipleBloodStock);

export default router;
