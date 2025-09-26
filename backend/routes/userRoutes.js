import express from 'express';
import {
  fetchProfile,
  updateProfile,
  changePassword,
  updateContact,
  updatePhone,
} from '../controllers/userController.js';

const router = express.Router();

router.get('/profile/:email', fetchProfile);
router.put('/profile', updateProfile);
router.put('/profile/password', changePassword);
router.put('/profile/contact', updateContact);
router.put('/profile/phone', updatePhone);

export default router;
