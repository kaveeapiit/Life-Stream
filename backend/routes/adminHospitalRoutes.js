// backend/routes/adminHospitalRoutes.js
import express from "express";
import adminAuth from "../middleware/adminAuth.js";
import {
  adminListHospitals,
  adminGetHospital,
  adminCreateHospital,
  adminUpdateHospital,
  adminDeleteHospital,
} from "../controllers/adminHospitalController.js";

const router = express.Router();

// /api/admin/hospitals - All routes protected with adminAuth
router.get("/", adminAuth, adminListHospitals);
router.get("/:id", adminAuth, adminGetHospital);
router.post("/", adminAuth, adminCreateHospital);
router.put("/:id", adminAuth, adminUpdateHospital);
router.delete("/:id", adminAuth, adminDeleteHospital);

export default router;
