import express from 'express';
import {
  createBloodRequest,
  getPendingRequests,
  updateApproval,     // ✅ NEW import
  getUserRequests     // ✅ NEW import
} from '../controllers/bloodRequestController.js';

const router = express.Router();

// 🩸 Create a blood request
router.post('/request', createBloodRequest);

// 📝 Get all pending blood requests (for hospital/admin)
router.get('/pending', getPendingRequests);

// ✅ Approve or decline a blood request by ID
router.put('/approve/:id', updateApproval);

// 📋 Get requests by user email (for user history page)
router.get('/user', getUserRequests); // Example: /api/blood-request/user?email=user@example.com

export default router;
