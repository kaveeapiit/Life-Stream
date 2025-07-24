import express from 'express';
import {
  fetchApprovedDonations,
  getPendingRecipients,
  updateRecipientApproval
} from '../controllers/recipientController.js';
import hospitalAuth from '../middleware/hospitalAuth.js';

const router = express.Router();

// ✅ GET /api/recipient/approved — list of approved donations
router.get('/approved', fetchApprovedDonations);

// ✅ GET /api/recipient/pending — list of pending recipient requests (now protected)
router.get('/pending', hospitalAuth, getPendingRecipients);

// ✅ PUT /api/recipient/approve/:id — approve or decline a request
router.put('/approve/:id', updateRecipientApproval);

export default router;
