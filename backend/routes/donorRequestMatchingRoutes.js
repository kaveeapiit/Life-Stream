import express from "express";
import {
  findCompatibleDonorsForRequest,
  getDonorsWithRequestMatching,
  getDonorRequestMatchingSummary,
  getBloodTypeMatchingAnalysis,
  getBloodTypeOverview,
  findCompatibleDonorsByLocation,
  getDonorsByLocationAndBloodType,
  getLocationMatchingStats,
} from "../controllers/donorRequestMatchingController.js";
import hospitalAuth from "../middleware/hospitalAuth.js";

const router = express.Router();

// 🩺 Donor-Request Matching Routes

// Get donors filtered by blood type with request matching context
router.get("/donors/matching", hospitalAuth, getDonorsWithRequestMatching);

// Find compatible donors for a specific blood request
router.get(
  "/blood-requests/:requestId/compatible-donors",
  hospitalAuth,
  findCompatibleDonorsForRequest
);

// Get donor-request matching summary for dashboard
router.get("/matching/summary", hospitalAuth, getDonorRequestMatchingSummary);

// Get detailed blood type matching analysis
router.get(
  "/matching/analysis/:bloodType",
  hospitalAuth,
  getBloodTypeMatchingAnalysis
);

// Get overview of all blood types with donor/request counts
router.get("/matching/overview", hospitalAuth, getBloodTypeOverview);

// 📍 Location-based donor matching routes

// Find compatible donors filtered by hospital location
router.get(
  "/donors/location/compatible",
  hospitalAuth,
  findCompatibleDonorsByLocation
);

// Get donors by location and blood type
router.get("/donors/location", hospitalAuth, getDonorsByLocationAndBloodType);

// Get location-based matching statistics
router.get("/matching/location/stats", hospitalAuth, getLocationMatchingStats);

export default router;
