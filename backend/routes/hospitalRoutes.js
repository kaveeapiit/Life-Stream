import express from "express";
import { hospitalLogin } from "../controllers/hospitalAuthController.js";
import {
  fetchPendingDonationsForHospital,
  fetchAvailableDonors,
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

// ✅ Protected: Get Available Donors for Blood Donation Planning
router.get("/donors/available", hospitalAuth, fetchAvailableDonors);

export default router;
