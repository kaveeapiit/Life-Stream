import express from 'express';
import {
  fetchProfile,
  updateProfile,
  changePassword,
} from '../controllers/userController.js';

const router = express.Router();

router.get('/profile/:email', fetchProfile);
router.put('/profile', updateProfile);
router.put('/profile/password', changePassword);

export default router;
