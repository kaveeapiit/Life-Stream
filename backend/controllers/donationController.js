import {
  insertDonation,
  fetchDonationsByEmail,
  getPendingDonations,
  updateDonationStatus,
  getPendingDonationsForHospital,
} from "../models/donationModel.js";
import { getAvailableDonors } from "../models/UserModel.js";

// ✅ 1. Handle donation submission (public/user)
export const submitDonation = async (req, res) => {
  const { name, email, bloodType, location } = req.body;
  const userId = req.user?.id || null;

  try {
    await insertDonation({
      userId,
      name,
      email,
      bloodType,
      location,
    });

    res.status(201).json({ message: "Donation submitted successfully" });
  } catch (err) {
    console.error("Donation submission failed:", err.message);
    res.status(500).json({ error: "Failed to submit donation" });
  }
};

// ✅ 2. Get user donation history by email (user)
export const getUserDonations = async (req, res) => {
  const { email } = req.params;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const donations = await fetchDonationsByEmail(email);
    res.status(200).json(donations);
  } catch (err) {
    console.error("Error fetching donations:", err.message);
    res.status(500).json({ error: "Failed to fetch donation data" });
  }
};

// ✅ 3. Fetch all pending donations (admin use only)
export const fetchPendingDonations = async (req, res) => {
  try {
    const donations = await getPendingDonations();
    res.status(200).json(donations);
  } catch (err) {
    console.error("Error fetching pending donations:", err.message);
    res.status(500).json({ error: "Failed to fetch pending donations" });
  }
};

// ✅ 4. Approve or Decline a donation (by hospital/admin)
export const approveOrDeclineDonation = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["Approved", "Declined"].includes(status)) {
    return res.status(400).json({ error: "Invalid status value" });
  }

  try {
    const updated = await updateDonationStatus(id, status);
    res.status(200).json(updated);
  } catch (err) {
    console.error("Error updating donation status:", err.message);
    res.status(500).json({ error: "Failed to update donation status" });
  }
};

// ✅ 5. Hospital-only: Fetch pending donations filtered by their own hospital/location
export const fetchPendingDonationsForHospital = async (req, res) => {
  const { hospital } = req.session;

  if (!hospital || !hospital.username) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const donations = await getPendingDonationsForHospital(hospital.username);
    res.status(200).json(donations);
  } catch (err) {
    console.error("Error fetching hospital donations:", err.message);
    res.status(500).json({ error: "Failed to fetch donations" });
  }
};

// ✅ 6. Hospital-only: Fetch available donors for blood donation planning
export const fetchAvailableDonors = async (req, res) => {
  const { hospital } = req.session;

  if (!hospital || !hospital.username) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { bloodType = "", search = "", page = 1, limit = 20 } = req.query;

  try {
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const result = await getAvailableDonors({
      bloodType,
      search,
      limit: parseInt(limit),
      offset,
    });

    res.status(200).json({
      donors: result.donors,
      total: result.total,
      page: parseInt(page),
      totalPages: Math.ceil(result.total / parseInt(limit)),
    });
  } catch (err) {
    console.error("Error fetching available donors:", err.message);
    res.status(500).json({ error: "Failed to fetch available donors" });
  }
};
