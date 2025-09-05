import express from "express";
import {
  getHospitalBloodRequests,
  getBloodRequestDetails,
  updateBloodRequestStatus,
  assignBloodRequestToHospital,
  getBloodRequestStats,
  getUrgentBloodRequests,
  fulfillBloodRequestWithInventory,
  getAvailableInventoryForRequest,
  reserveBloodUnitsForRequest,
} from "../controllers/hospitalBloodRequestController.js";
import hybridHospitalAuth from "../middleware/hybridHospitalAuth.js";

const router = express.Router();

// 🏥 Hospital Blood Request Management Routes

// Get all blood requests for hospital management (with filtering and pagination)
router.get("/blood-requests", hybridHospitalAuth, getHospitalBloodRequests);

// Get all blood requests for hospital management (alias route)
router.get("/blood-requests/all", hybridHospitalAuth, getHospitalBloodRequests);

// Get blood request statistics for dashboard
router.get("/blood-requests/stats", hybridHospitalAuth, getBloodRequestStats);

// Get urgent/priority blood requests
router.get(
  "/blood-requests/urgent",
  hybridHospitalAuth,
  getUrgentBloodRequests
);

// Get specific blood request details
router.get("/blood-requests/:id", hybridHospitalAuth, getBloodRequestDetails);

// Update blood request status (approve, decline, fulfill, etc.)
router.put(
  "/blood-requests/:id/status",
  hybridHospitalAuth,
  updateBloodRequestStatus
);

// Assign blood request to current hospital
router.put(
  "/blood-requests/:id/assign",
  hybridHospitalAuth,
  assignBloodRequestToHospital
);

// NEW: Fulfill blood request using hospital inventory
router.put(
  "/blood-requests/:id/fulfill",
  hybridHospitalAuth,
  fulfillBloodRequestWithInventory
);

// NEW: Get available inventory for a specific request
router.get(
  "/blood-requests/:id/available-inventory",
  hybridHospitalAuth,
  getAvailableInventoryForRequest
);

// NEW: Reserve blood units for a request
router.put(
  "/blood-requests/:id/reserve",
  hybridHospitalAuth,
  reserveBloodUnitsForRequest
);

export default router;
