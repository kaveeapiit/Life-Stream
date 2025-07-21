import { insertDonation, fetchDonationsByEmail } from '../models/donationModel.js';

// ✅ 1. Handle donation submission
export const submitDonation = async (req, res) => {
  const { name, email, bloodType, location } = req.body;
  const userId = req.user?.id || null;

  try {
    await insertDonation({
      userId,
      name,
      email,
      bloodType,
      location
    });

    res.status(201).json({ message: 'Donation submitted successfully' });
  } catch (err) {
    console.error('Donation submission failed:', err.message);
    res.status(500).json({ error: 'Failed to submit donation' });
  }
};

// ✅ 2. Get donations by user email
export const getUserDonations = async (req, res) => {
  const { email } = req.params;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    const donations = await fetchDonationsByEmail(email);
    res.status(200).json(donations);
  } catch (err) {
    console.error('Error fetching donations:', err.message);
    res.status(500).json({ error: 'Failed to fetch donation data' });
  }
};
