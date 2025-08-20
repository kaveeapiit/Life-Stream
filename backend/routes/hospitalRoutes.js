import express from "express";
import { hospitalLogin } from "../controllers/hospitalAuthController.js";
import {
  fetchPendingDonationsForHospital,
  fetchAllDonationsForHospital,
  fetchDonationHistoryForHospital,
  fetchAvailableDonors,
  getHospitalDashboardStats,
} from "../controllers/donationController.js";
import hospitalAuth from "../middleware/hospitalAuth.js";

const router = express.Router();

// ✅ Hospital Login
router.post("/login", hospitalLogin);

// ✅ Protected: Get Pending Donations for Logged-In Hospital
router.get(
  "/donations/pending",
  hospitalAuth,
  fetchPendingDonationsForHospital
);

// ✅ Protected: Get All Donations for Hospital Management
router.get("/donations/all", hospitalAuth, fetchAllDonationsForHospital);

// ✅ Protected: Get Donation History for Hospital
router.get("/donations/history", hospitalAuth, fetchDonationHistoryForHospital);

// ✅ Protected: Get Available Donors for Blood Donation Planning
router.get("/donors/available", hospitalAuth, fetchAvailableDonors);

// ✅ Protected: Get Hospital Dashboard Statistics
router.get("/dashboard/stats", hospitalAuth, getHospitalDashboardStats);

export default router;
