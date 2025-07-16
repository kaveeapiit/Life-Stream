// routes/contactRoutes.js
import express from "express";
import { fetchContactInfo } from "../controllers/contactController.js";

const router = express.Router();
router.get("/", fetchContactInfo);
export default router;
