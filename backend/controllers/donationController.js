import { insertDonation } from '../models/donationModel.js';

export const submitDonation = async (req, res) => {
  const { name, email, bloodType, message } = req.body;

  try {
    await insertDonation({ name, email, bloodType, message });
    res.status(201).json({ message: 'Donation submitted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
