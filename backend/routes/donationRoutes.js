import express from "express";
import {
  submitDonation,
  getUserDonations,
  fetchPendingDonations,
  approveOrDeclineDonation,
  fetchAllDonationsForAdmin,
  fetchDonationHistoryForAdmin,
  approveAndConvertDonation,
  convertDonationToInventory,
} from "../controllers/donationController.js";

const router = express.Router();

// 🚀 Submit a new donation
// POST /api/donation
router.post("/", submitDonation);

// 📥 Get donations for a specific user
// GET /api/donation/user/:email
router.get("/user/:email", getUserDonations);

// 🕓 Get all pending donations (for hospital/admin)
// GET /api/donation/pending
router.get("/pending", fetchPendingDonations);

// ✅ Approve or Decline donation by ID
// PUT /api/donation/update/:id
router.put("/update/:id", approveOrDeclineDonation);

// 🔧 ADMIN: Get all donations for admin management
// GET /api/donation/admin/all
router.get("/admin/all", fetchAllDonationsForAdmin);

// 🔧 ADMIN: Get donation history for admin
// GET /api/donation/admin/history
router.get("/admin/history", fetchDonationHistoryForAdmin);

// 🩸 NEW: Enhanced approval with auto-conversion to inventory
// PUT /api/donation/approve-convert/:id
router.put("/approve-convert/:id", approveAndConvertDonation);

// 🏥 NEW: Convert existing approved donation to inventory
// PUT /api/donation/convert/:id
router.put("/convert/:id", convertDonationToInventory);

export default router;
