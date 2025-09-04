// routes/bloodRequestRoutes.js
import express from "express";
import {
  createBloodRequest,
  getPendingRequests,
  updateApproval,
  getUserRequests,
  getHistoryRequests,
  getAllRequestsForAdmin,
  getRequestHistoryForAdmin,
  fulfillBloodRequest,
  cancelBloodRequest,
  checkAvailableBlood,
} from "../controllers/bloodRequestController.js";

const router = express.Router();

// 🩸 Create a blood request
router.post("/request", createBloodRequest);

// 📝 Get all pending blood requests (hospital/admin)
router.get("/pending", getPendingRequests);

// ✅ Approve or decline a blood request by ID
router.put("/approve/:id", updateApproval);

// 📋 Get requests by user email (user’s own history)
router.get("/user", getUserRequests); // /api/blood/user?email=user@example.com

// 📚 Get approved/declined history (hospital/admin)
router.get("/history", getHistoryRequests);

// 🔧 ADMIN: Get all blood requests for admin management
router.get("/admin/all", getAllRequestsForAdmin);

// 🔧 ADMIN: Get blood request history for admin
router.get("/admin/history", getRequestHistoryForAdmin);

// 🩸 NEW: Fulfill a blood request
router.put("/fulfill/:id", fulfillBloodRequest);

// ❌ NEW: Cancel a blood request
router.put("/cancel/:id", cancelBloodRequest);

// 🔍 NEW: Check available blood for a specific blood type
router.get("/available/:bloodType", checkAvailableBlood);

export default router;
