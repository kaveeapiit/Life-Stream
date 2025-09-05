import express from "express";
import {
  createHospitalBloodRequest,
  getAvailableHospitalRequests,
  getMyHospitalRequests,
  respondToHospitalRequest,
  getHospitalRequestDetails,
  updateHospitalRequestStatus,
  getHospitalRequestStats,
  getUrgentHospitalRequests,
} from "../controllers/hospitalToHospitalController.js";
import hybridHospitalAuth from "../middleware/hybridHospitalAuth.js";

const router = express.Router();

// 🏥 Hospital-to-Hospital Blood Request Routes

// Create a new hospital blood request
router.post("/requests", hybridHospitalAuth, createHospitalBloodRequest);

// Get available requests from other hospitals (to respond to)
router.get("/requests/available", hybridHospitalAuth, getAvailableHospitalRequests);

// Get my hospital's requests
router.get("/requests/mine", hybridHospitalAuth, getMyHospitalRequests);

// Get urgent requests that need immediate attention
router.get("/requests/urgent", hybridHospitalAuth, getUrgentHospitalRequests);

// Get hospital request statistics
router.get("/requests/stats", hybridHospitalAuth, getHospitalRequestStats);

// Get specific request details
router.get("/requests/:id", hybridHospitalAuth, getHospitalRequestDetails);

// Respond to a hospital blood request
router.post("/requests/:id/respond", hybridHospitalAuth, respondToHospitalRequest);

// Update request status (for requesting hospital)
router.put("/requests/:id/status", hybridHospitalAuth, updateHospitalRequestStatus);

export default router;
