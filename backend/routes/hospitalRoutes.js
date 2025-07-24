import express from 'express';
import { hospitalLogin } from '../controllers/hospitalAuthController.js';
import { fetchPendingDonationsForHospital } from '../controllers/donationController.js';
import hospitalAuth from '../middleware/hospitalAuth.js';

const router = express.Router();

// ✅ Hospital Login
router.post('/login', hospitalLogin);

// ✅ Protected: Get Pending Donations for Logged-In Hospital
router.get('/donations/pending', hospitalAuth, fetchPendingDonationsForHospital);

export default router;
