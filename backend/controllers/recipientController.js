import RecipientModel from '../models/RecipientModel.js';

// ✅ Fetch all approved donations
export const fetchApprovedDonations = async (req, res) => {
  try {
    const donations = await RecipientModel.getApprovedDonations();
    res.status(200).json(donations);
  } catch (err) {
    console.error('Fetch error:', err.message);
    res.status(500).json({ error: 'Failed to fetch approved donations' });
  }
};

// ✅ Get all pending recipient requests
export const getPendingRecipients = async (req, res) => {
  try {
    const recipients = await RecipientModel.getPendingRequests();
    res.status(200).json(recipients);
  } catch (err) {
    console.error('Error fetching recipient requests:', err);
    res.status(500).json({ error: 'Failed to fetch recipients' });
  }
};

// ✅ Approve or decline a recipient request
export const updateRecipientApproval = async (req, res) => {
  try {
    const { id } = req.params;
    const { approved } = req.body;

    if (typeof approved !== 'boolean') {
      return res.status(400).json({ error: 'Approved must be true or false' });
    }

    const updated = await RecipientModel.updateApprovalStatus(id, approved);
    res.status(200).json(updated);
  } catch (err) {
    console.error('Error updating recipient approval:', err);
    res.status(500).json({ error: 'Failed to update recipient' });
  }
};
