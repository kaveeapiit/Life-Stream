import { insertDonation } from '../models/donationModel.js';

export const createDonation = async (req, res) => {
  const { name, email, bloodType, message } = req.body;

  try {
    await insertDonation({ name, email, bloodType, message });
    res.status(200).json({ message: 'Donation submitted successfully' });
  } catch (error) {
    console.error('Error in createDonation:', error.message);
    res.status(500).json({ error: 'Failed to submit donation' });
  }
};
