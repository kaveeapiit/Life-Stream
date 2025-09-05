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
import hybridHospitalAuth from "../middleware/hybridHospitalAuth.js";

const router = express.Router();

// 🩺 Donor-Request Matching Routes

// Get donors filtered by blood type with request matching context
router.get("/donors/matching", hybridHospitalAuth, getDonorsWithRequestMatching);

// Find compatible donors for a specific blood request
router.get(
  "/blood-requests/:requestId/compatible-donors",
  hybridHospitalAuth,
  findCompatibleDonorsForRequest
);

// Get donor-request matching summary for dashboard
router.get("/matching/summary", hybridHospitalAuth, getDonorRequestMatchingSummary);

// Get detailed blood type matching analysis
router.get(
  "/matching/analysis/:bloodType",
  hybridHospitalAuth,
  getBloodTypeMatchingAnalysis
);

// Get overview of all blood types with donor/request counts
router.get("/matching/overview", hybridHospitalAuth, getBloodTypeOverview);

// 📍 Location-based donor matching routes

// Find compatible donors filtered by hospital location
router.get(
  "/donors/location/compatible",
  hybridHospitalAuth,
  findCompatibleDonorsByLocation
);

// Get donors by location and blood type
router.get("/donors/location", hybridHospitalAuth, getDonorsByLocationAndBloodType);

// Get location-based matching statistics
router.get("/matching/location/stats", hybridHospitalAuth, getLocationMatchingStats);

export default router;
