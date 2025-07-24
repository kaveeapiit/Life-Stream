// backend/routes/adminHospitalRoutes.js
import express from 'express';
import {
  adminListHospitals,
  adminGetHospital,
  adminCreateHospital,
  adminUpdateHospital,
  adminDeleteHospital
} from '../controllers/adminHospitalController.js';

const router = express.Router();

// /api/admin/hospitals
router.get('/', adminListHospitals);
router.get('/:id', adminGetHospital);
router.post('/', adminCreateHospital);
router.put('/:id', adminUpdateHospital);
router.delete('/:id', adminDeleteHospital);

export default router;
