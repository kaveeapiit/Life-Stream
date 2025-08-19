import express from "express";
import {
  getHospitalBloodRequests,
  getBloodRequestDetails,
  updateBloodRequestStatus,
  assignBloodRequestToHospital,
  getBloodRequestStats,
  getUrgentBloodRequests,
} from "../controllers/hospitalBloodRequestController.js";
import hospitalAuth from "../middleware/hospitalAuth.js";

const router = express.Router();

// 🏥 Hospital Blood Request Management Routes

// Get all blood requests for hospital management (with filtering and pagination)
router.get("/blood-requests", hospitalAuth, getHospitalBloodRequests);

// Get blood request statistics for dashboard
router.get("/blood-requests/stats", hospitalAuth, getBloodRequestStats);

// Get urgent/priority blood requests
router.get("/blood-requests/urgent", hospitalAuth, getUrgentBloodRequests);

// Get specific blood request details
router.get("/blood-requests/:id", hospitalAuth, getBloodRequestDetails);

// Update blood request status (approve, decline, fulfill, etc.)
router.put(
  "/blood-requests/:id/status",
  hospitalAuth,
  updateBloodRequestStatus
);

// Assign blood request to current hospital
router.put(
  "/blood-requests/:id/assign",
  hospitalAuth,
  assignBloodRequestToHospital
);

export default router;
