import express from "express";
import { hospitalLogin } from "../controllers/hospitalAuthController.js";
import {
  fetchPendingDonationsForHospital,
  fetchAllDonationsForHospital,
  fetchDonationHistoryForHospital,
  fetchAvailableDonors,
  getHospitalDashboardStats,
} from "../controllers/donationController.js";
import hybridHospitalAuth from "../middleware/hybridHospitalAuth.js";

const router = express.Router();

// ✅ Hospital Login
router.post("/login", hospitalLogin);

// ✅ Protected: Get Pending Donations for Logged-In Hospital
router.get(
  "/donations/pending",
  hybridHospitalAuth,
  fetchPendingDonationsForHospital
);

// ✅ Protected: Get All Donations for Hospital Management
router.get("/donations/all", hybridHospitalAuth, fetchAllDonationsForHospital);

// ✅ Protected: Get Donation History for Hospital
router.get(
  "/donations/history",
  hybridHospitalAuth,
  fetchDonationHistoryForHospital
);

// ✅ Protected: Get Available Donors for Blood Donation Planning
router.get("/donors/available", hybridHospitalAuth, fetchAvailableDonors);

// ✅ Protected: Get Hospital Dashboard Statistics
router.get("/dashboard/stats", hybridHospitalAuth, getHospitalDashboardStats);

export default router;
