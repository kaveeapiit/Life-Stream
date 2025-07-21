import { getApprovedDonations } from '../models/RecipientModel.js';

export const fetchApprovedDonations = async (req, res) => {
  try {
    const donations = await getApprovedDonations();
    res.status(200).json(donations);
  } catch (err) {
    console.error('Fetch error:', err.message);
    res.status(500).json({ error: 'Failed to fetch approved donations' });
  }
};
