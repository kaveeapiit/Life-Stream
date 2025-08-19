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
import hospitalAuth from "../middleware/hospitalAuth.js";

const router = express.Router();

// 🏥 Hospital-to-Hospital Blood Request Routes

// Create a new hospital blood request
router.post("/requests", hospitalAuth, createHospitalBloodRequest);

// Get available requests from other hospitals (to respond to)
router.get("/requests/available", hospitalAuth, getAvailableHospitalRequests);

// Get my hospital's requests
router.get("/requests/mine", hospitalAuth, getMyHospitalRequests);

// Get urgent requests that need immediate attention
router.get("/requests/urgent", hospitalAuth, getUrgentHospitalRequests);

// Get hospital request statistics
router.get("/requests/stats", hospitalAuth, getHospitalRequestStats);

// Get specific request details
router.get("/requests/:id", hospitalAuth, getHospitalRequestDetails);

// Respond to a hospital blood request
router.post("/requests/:id/respond", hospitalAuth, respondToHospitalRequest);

// Update request status (for requesting hospital)
router.put("/requests/:id/status", hospitalAuth, updateHospitalRequestStatus);

export default router;
