import express from 'express';
import {
  submitDonation,
  getUserDonations,
  fetchPendingDonations,
  approveOrDeclineDonation
} from '../controllers/donationController.js';

const router = express.Router();

// 🚀 Submit a new donation
// POST /api/donation
router.post('/', submitDonation);

// 📥 Get donations for a specific user
// GET /api/donation/user/:email
router.get('/user/:email', getUserDonations);

// 🕓 Get all pending donations (for hospital/admin)
// GET /api/donation/pending
router.get('/pending', fetchPendingDonations);

// ✅ Approve or Decline donation by ID
// PUT /api/donation/update/:id
router.put('/update/:id', approveOrDeclineDonation);

export default router;
