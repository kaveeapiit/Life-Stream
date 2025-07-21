import express from 'express';
import { submitDonation, getUserDonations } from '../controllers/donationController.js';

const router = express.Router();

// 🚀 Submit a new donation
// Endpoint: POST /api/donation
router.post('/', submitDonation);

// 📥 Fetch donation history by email
// Endpoint: GET /api/donation/user/:email
router.get('/user/:email', getUserDonations);

export default router;
