// controllers/contactController.js
import { getContactInfo } from "../models/ContactModel.js";

export const fetchContactInfo = (req, res) => {
  try {
    const info = getContactInfo();
    res.json(info);
  } catch (err) {
    res.status(500).json({ message: "Failed to load contact information" });
  }
};
