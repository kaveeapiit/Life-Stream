import express from 'express';
import { fetchAboutContent } from '../controllers/aboutController.js';

const router = express.Router();

router.get('/', fetchAboutContent);

export default router;
