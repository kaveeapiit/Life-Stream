// backend/routes/adminRoutes.js
import express from 'express';
import { loginAdmin } from '../controllers/adminController.js';
import {
  adminListUsers,
  adminGetUser,
  adminCreateUser,
  adminUpdateUser,
  adminDeleteUser
} from '../controllers/adminUserController.js';

const router = express.Router();

// --- Admin Authentication ---
router.post('/login', loginAdmin);

// --- Admin User Management (CRUD) ---
router.get('/users', adminListUsers);       // List users (with search/pagination)
router.get('/users/:id', adminGetUser);     // Get user by ID
router.post('/users', adminCreateUser);     // Create new user
router.put('/users/:id', adminUpdateUser);  // Update user by ID
router.delete('/users/:id', adminDeleteUser); // Delete user by ID

export default router;
