import express from 'express';
import { fetchApprovedDonations } from '../controllers/recipientController.js';

const router = express.Router();

router.get('/approved', fetchApprovedDonations); // /api/recipient/approved

export default router;
