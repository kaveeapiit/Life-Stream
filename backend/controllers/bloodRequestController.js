import BloodRequestModel from '../models/BloodRequestModel.js';

export const createBloodRequest = async (req, res) => {
  try {
    const request = await BloodRequestModel.createRequest(req.body);
    res.status(201).json(request);
  } catch (err) {
    console.error('Error in createBloodRequest:', err);
    res.status(500).json({ error: 'Failed to create request' });
  }
};

export const getPendingRequests = async (req, res) => {
  try {
    const requests = await BloodRequestModel.getPendingRequests();
    res.status(200).json(requests);
  } catch (err) {
    console.error('Error in getPendingRequests:', err);
    res.status(500).json({ error: 'Failed to fetch requests' });
  }
};

// ✅ NEW: Update approval status
export const updateApproval = async (req, res) => {
  try {
    const { id } = req.params;
    const { approved } = req.body;

    if (typeof approved !== 'boolean') {
      return res.status(400).json({ error: 'Approved must be true or false' });
    }

    const updated = await BloodRequestModel.updateApprovalStatus(id, approved);
    res.status(200).json(updated);
  } catch (err) {
    console.error('Error updating approval:', err);
    res.status(500).json({ error: 'Failed to update approval status' });
  }
};

// ✅ NEW: Get user-specific blood requests by email
export const getUserRequests = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const requests = await BloodRequestModel.getRequestsByEmail(email);
    res.status(200).json(requests);
  } catch (err) {
    console.error('Error in getUserRequests:', err);
    res.status(500).json({ error: 'Failed to fetch user requests' });
  }
};
