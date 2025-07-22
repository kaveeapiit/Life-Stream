// routes/bloodRequestRoutes.js
import express from 'express';
import {
  createBloodRequest,
  getPendingRequests,
  updateApproval,
  getUserRequests,
  getHistoryRequests
} from '../controllers/bloodRequestController.js';

const router = express.Router();

// 🩸 Create a blood request
router.post('/request', createBloodRequest);

// 📝 Get all pending blood requests (hospital/admin)
router.get('/pending', getPendingRequests);

// ✅ Approve or decline a blood request by ID
router.put('/approve/:id', updateApproval);

// 📋 Get requests by user email (user’s own history)
router.get('/user', getUserRequests); // /api/blood/user?email=user@example.com

// 📚 Get approved/declined history (hospital/admin)
router.get('/history', getHistoryRequests);

export default router;
