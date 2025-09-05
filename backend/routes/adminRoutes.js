// backend/routes/adminRoutes.js
import express from "express";
import { loginAdmin } from "../controllers/adminController.js";
import adminAuth from "../middleware/adminAuth.js";
import {
  adminListUsers,
  adminGetUser,
  adminCreateUser,
  adminUpdateUser,
  adminDeleteUser,
} from "../controllers/adminUserController.js";
import {
  fetchAllDonationsForAdmin,
  fetchDonationHistoryForAdmin,
  approveOrDeclineDonation,
} from "../controllers/donationController.js";
import {
  getAllRequestsForAdmin,
  getRequestHistoryForAdmin,
  updateApproval,
} from "../controllers/bloodRequestController.js";

const router = express.Router();

// --- Admin Authentication ---
router.post("/login", loginAdmin);

// --- Admin User Management (CRUD) --- (Protected)
router.get("/users", adminAuth, adminListUsers); // List users (with search/pagination)
router.get("/users/:id", adminAuth, adminGetUser); // Get user by ID
router.post("/users", adminAuth, adminCreateUser); // Create new user
router.put("/users/:id", adminAuth, adminUpdateUser); // Update user by ID
router.delete("/users/:id", adminAuth, adminDeleteUser); // Delete user by ID

// --- Admin Donation Management --- (Protected)
router.get("/donations/all", adminAuth, fetchAllDonationsForAdmin); // Get all donations
router.get("/donations/history", adminAuth, fetchDonationHistoryForAdmin); // Get donation history
router.put("/donations/:id/status", adminAuth, approveOrDeclineDonation); // Approve/decline donation

// --- Admin Blood Request Management --- (Protected)
router.get("/blood-requests/all", adminAuth, getAllRequestsForAdmin); // Get all blood requests
router.get("/blood-requests/history", adminAuth, getRequestHistoryForAdmin); // Get blood request history
router.put("/blood-requests/:id/approval", adminAuth, updateApproval); // Approve/decline blood request

export default router;
