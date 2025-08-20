// backend/routes/adminRoutes.js
import express from "express";
import { loginAdmin } from "../controllers/adminController.js";
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

// --- Admin User Management (CRUD) ---
router.get("/users", adminListUsers); // List users (with search/pagination)
router.get("/users/:id", adminGetUser); // Get user by ID
router.post("/users", adminCreateUser); // Create new user
router.put("/users/:id", adminUpdateUser); // Update user by ID
router.delete("/users/:id", adminDeleteUser); // Delete user by ID

// --- Admin Donation Management ---
router.get("/donations/all", fetchAllDonationsForAdmin); // Get all donations
router.get("/donations/history", fetchDonationHistoryForAdmin); // Get donation history
router.put("/donations/:id/status", approveOrDeclineDonation); // Approve/decline donation

// --- Admin Blood Request Management ---
router.get("/blood-requests/all", getAllRequestsForAdmin); // Get all blood requests
router.get("/blood-requests/history", getRequestHistoryForAdmin); // Get blood request history
router.put("/blood-requests/:id/approval", updateApproval); // Approve/decline blood request

export default router;
