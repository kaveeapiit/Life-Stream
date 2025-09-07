import {
  insertDonation,
  fetchDonationsByEmail,
  getPendingDonations,
  updateDonationStatus,
  getPendingDonationsForHospital,
  getAllDonationsForHospital,
  getDonationHistoryForHospital,
  getAllDonationsForAdmin,
  getDonationHistoryForAdmin,
  autoConvertToInventory,
} from "../models/donationModel.js";
import { getAvailableDonors } from "../models/UserModel.js";
import NotificationModel from "../models/NotificationModel.js";
import pool from "../config/db.js";

// ✅ 1. Handle donation submission (public/user)
export const submitDonation = async (req, res) => {
  const { name, email, bloodType, location } = req.body;
  const userId = req.user?.id || null;

  try {
    console.log("Donation submission attempt:", {
      name,
      email,
      bloodType,
      location,
      userId,
    });

    // Validate required fields
    if (!name || !email || !bloodType || !location) {
      console.error("Donation validation failed: Missing required fields");
      return res.status(400).json({
        error: "All fields are required: name, email, bloodType, location",
      });
    }

    await insertDonation({
      userId,
      name,
      email,
      bloodType,
      location,
    });

    console.log("Donation submitted successfully for:", email);
    res.status(201).json({ message: "Donation submitted successfully" });
  } catch (err) {
    console.error("Donation submission failed:", err.message);
    console.error("Full error:", err);

    // Return more detailed error information
    const errorResponse = {
      error: "Failed to submit donation",
    };

    // Add detailed error info for debugging Azure issues
    // TODO: Remove in production after debugging is complete
    errorResponse.details = err.message;
    errorResponse.code = err.code;

    res.status(500).json(errorResponse);
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

    // Create notification for the user
    if (updated && updated.email) {
      try {
        const notificationData = {
          email: updated.email,
          type:
            status === "Approved" ? "donation_approved" : "donation_declined",
          title:
            status === "Approved" ? "Donation Approved!" : "Donation Update",
          message:
            status === "Approved"
              ? `Great news! Your blood donation request has been approved. Thank you for your generosity in helping save lives!`
              : `Your donation request has been reviewed. Thank you for your willingness to help.`,
          relatedId: updated.id,
          relatedType: "donation",
        };

        await NotificationModel.createNotification(notificationData);
        console.log(
          `Notification created for donation ${status.toLowerCase()}: ${
            updated.email
          }`
        );
      } catch (notificationErr) {
        console.error("Error creating notification:", notificationErr.message);
        // Don't fail the request if notification creation fails
      }
    }

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

// ✅ 5b. Hospital-only: Fetch all donations for hospital management
export const fetchAllDonationsForHospital = async (req, res) => {
  const { hospital } = req.session;

  if (!hospital || !hospital.username) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const donations = await getAllDonationsForHospital(hospital.username);
    res.status(200).json(donations);
  } catch (err) {
    console.error("Error fetching all hospital donations:", err.message);
    res.status(500).json({ error: "Failed to fetch donations" });
  }
};

// ✅ 5c. Hospital-only: Fetch donation history for hospital
export const fetchDonationHistoryForHospital = async (req, res) => {
  const { hospital } = req.session;

  if (!hospital || !hospital.username) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const donations = await getDonationHistoryForHospital(hospital.username);
    res.status(200).json(donations);
  } catch (err) {
    console.error("Error fetching donation history:", err.message);
    res.status(500).json({ error: "Failed to fetch donation history" });
  }
};

// ✅ 6. Hospital-only: Fetch available donors for blood donation planning
export const fetchAvailableDonors = async (req, res) => {
  const { hospital } = req.session;

  if (!hospital || !hospital.username) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const { bloodType, location } = req.query;
    const donors = await getAvailableDonors({ bloodType, location });
    res.status(200).json(donors);
  } catch (err) {
    console.error("Error fetching available donors:", err.message);
    res.status(500).json({ error: "Failed to fetch available donors" });
  }
};

// ✅ ADMIN: Get all donations for admin management
export const fetchAllDonationsForAdmin = async (req, res) => {
  try {
    const donations = await getAllDonationsForAdmin();
    res.status(200).json(donations);
  } catch (err) {
    console.error("Error fetching all admin donations:", err.message);
    res.status(500).json({ error: "Failed to fetch donations" });
  }
};

// ✅ ADMIN: Get donation history for admin
export const fetchDonationHistoryForAdmin = async (req, res) => {
  try {
    const donations = await getDonationHistoryForAdmin();
    res.status(200).json(donations);
  } catch (err) {
    console.error("Error fetching admin donation history:", err.message);
    res.status(500).json({ error: "Failed to fetch donation history" });
  }
};

// NEW: Enhanced approval with auto-conversion to inventory
export const approveAndConvertDonation = async (req, res) => {
  const { id } = req.params;
  const { hospitalId, expiryDate, autoConvert = true } = req.body;

  if (!hospitalId || !expiryDate) {
    return res.status(400).json({
      error: "Hospital ID and expiry date are required",
    });
  }

  try {
    // First approve the donation
    const approved = await updateDonationStatus(id, "Approved");

    if (!approved) {
      return res.status(404).json({ error: "Donation not found" });
    }

    // Auto-convert to inventory if requested
    if (autoConvert) {
      const conversionResult = await autoConvertToInventory(
        id,
        hospitalId,
        expiryDate
      );

      if (conversionResult.success) {
        res.status(200).json({
          donation: approved,
          bloodUnit: conversionResult.bloodUnit,
          message:
            "Donation approved and successfully converted to blood inventory",
          autoConverted: true,
        });
      } else {
        res.status(200).json({
          donation: approved,
          message: "Donation approved but conversion to inventory failed",
          autoConverted: false,
          conversionError: conversionResult.error,
        });
      }
    } else {
      res.status(200).json({
        donation: approved,
        message: "Donation approved successfully",
        autoConverted: false,
      });
    }
  } catch (err) {
    console.error("Error in approveAndConvertDonation:", err.message);
    res.status(500).json({ error: "Failed to approve and convert donation" });
  }
};

// NEW: Convert existing approved donation to inventory
export const convertDonationToInventory = async (req, res) => {
  const { id } = req.params;
  const { hospitalId, expiryDate } = req.body;

  if (!hospitalId || !expiryDate) {
    return res.status(400).json({
      error: "Hospital ID and expiry date are required",
    });
  }

  try {
    const result = await autoConvertToInventory(id, hospitalId, expiryDate);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json({ error: result.error });
    }
  } catch (err) {
    console.error("Error converting donation to inventory:", err.message);
    res.status(500).json({ error: "Failed to convert donation to inventory" });
  }
};

// ✅ Hospital Dashboard Stats
export const getHospitalDashboardStats = async (req, res) => {
  const { hospital } = req.session;

  if (!hospital || !hospital.username) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    // Get donation statistics for the hospital
    const donationStats = await pool.query(
      `
      SELECT 
        COUNT(CASE WHEN status = 'Pending' THEN 1 END) as pending_donations,
        COUNT(CASE WHEN status = 'Approved' THEN 1 END) as approved_donations,
        COUNT(CASE WHEN status = 'Collected' THEN 1 END) as collected_donations,
        COUNT(CASE WHEN status = 'Declined' THEN 1 END) as declined_donations,
        COUNT(CASE WHEN DATE(created_at) = CURRENT_DATE THEN 1 END) as today_donations
      FROM donations 
      WHERE LOWER(location) LIKE LOWER($1) OR location IS NULL OR location = ''
    `,
      [`%${hospital.username}%`]
    );

    res.status(200).json({
      hospital: hospital.username,
      donations: donationStats.rows[0] || {
        pending_donations: 0,
        approved_donations: 0,
        collected_donations: 0,
        declined_donations: 0,
        today_donations: 0,
      },
    });
  } catch (err) {
    console.error("Error fetching hospital dashboard stats:", err.message);
    res.status(500).json({ error: "Failed to fetch dashboard statistics" });
  }
};
