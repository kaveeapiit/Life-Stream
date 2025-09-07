import BloodRequestModel from "../models/BloodRequestModel.js";
import BloodInventoryModel from "../models/BloodInventoryModel.js";

export const createBloodRequest = async (req, res) => {
  try {
    console.log("Creating blood request with data:", req.body);
    const request = await BloodRequestModel.createRequest(req.body);
    console.log("Blood request created successfully:", request);

    // Blood request created and stays in pending status for hospital review
    res.status(201).json({
      ...request,
      message:
        "Blood request submitted successfully. Hospital will review your request shortly.",
    });
  } catch (err) {
    console.error("Error in createBloodRequest:", err);
    console.error("Full error details:", {
      message: err.message,
      code: err.code,
      detail: err.detail,
      hint: err.hint,
      constraint: err.constraint,
    });

    // Return detailed error for debugging
    const errorResponse = { error: "Failed to create request" };

    // Add detailed error info for debugging Azure issues
    errorResponse.details = err.message;
    errorResponse.code = err.code;

    res.status(500).json(errorResponse);
  }
};

export const getPendingRequests = async (req, res) => {
  try {
    const requests = await BloodRequestModel.getPendingRequests();
    res.status(200).json(requests);
  } catch (err) {
    console.error("Error in getPendingRequests:", err);
    res.status(500).json({ error: "Failed to fetch requests" });
  }
};

// ✅ Update approval status
export const updateApproval = async (req, res) => {
  try {
    const { id } = req.params;
    const { approved } = req.body;

    if (typeof approved !== "boolean") {
      return res.status(400).json({ error: "Approved must be true or false" });
    }

    const updated = await BloodRequestModel.updateApprovalStatus(id, approved);
    res.status(200).json(updated);
  } catch (err) {
    console.error("Error updating approval:", err);
    res.status(500).json({ error: "Failed to update approval status" });
  }
};

// ✅ User-specific requests (by email)
export const getUserRequests = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const requests = await BloodRequestModel.getRequestsByEmail(email);
    res.status(200).json(requests);
  } catch (err) {
    console.error("Error in getUserRequests:", err);
    res.status(500).json({ error: "Failed to fetch user requests" });
  }
};

// ✅ NEW: History (approved or declined)
export const getHistoryRequests = async (req, res) => {
  try {
    const rows = await BloodRequestModel.getHistoryRequests();
    res.status(200).json(rows);
  } catch (err) {
    console.error("Error in getHistoryRequests:", err);
    res.status(500).json({ error: "Failed to fetch history" });
  }
};

// ✅ ADMIN: Get all blood requests for admin management
export const getAllRequestsForAdmin = async (req, res) => {
  try {
    const requests = await BloodRequestModel.getAllRequestsForAdmin();
    res.status(200).json(requests);
  } catch (err) {
    console.error("Error in getAllRequestsForAdmin:", err);
    res.status(500).json({ error: "Failed to fetch blood requests" });
  }
};

// ✅ ADMIN: Get blood request history for admin
export const getRequestHistoryForAdmin = async (req, res) => {
  try {
    const requests = await BloodRequestModel.getRequestHistoryForAdmin();
    res.status(200).json(requests);
  } catch (err) {
    console.error("Error in getRequestHistoryForAdmin:", err);
    res.status(500).json({ error: "Failed to fetch blood request history" });
  }
};

// NEW: Fulfill a blood request
export const fulfillBloodRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { bloodUnitIds } = req.body;

    if (
      !bloodUnitIds ||
      !Array.isArray(bloodUnitIds) ||
      bloodUnitIds.length === 0
    ) {
      return res.status(400).json({ error: "Blood unit IDs are required" });
    }

    const result = await BloodRequestModel.fulfillBloodRequest(
      id,
      bloodUnitIds
    );

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json({ error: result.error });
    }
  } catch (err) {
    console.error("Error in fulfillBloodRequest:", err);
    res.status(500).json({ error: "Failed to fulfill blood request" });
  }
};

// NEW: Cancel a blood request
export const cancelBloodRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const result = await BloodRequestModel.cancelBloodRequest(id, reason);
    res.status(200).json({
      message: "Blood request cancelled successfully",
      request: result,
    });
  } catch (err) {
    console.error("Error in cancelBloodRequest:", err);
    res.status(500).json({ error: "Failed to cancel blood request" });
  }
};

// NEW: Check available blood for a request
export const checkAvailableBlood = async (req, res) => {
  try {
    const { bloodType } = req.params;
    const { excludeHospitalId } = req.query;

    const availableUnits = await BloodInventoryModel.findAvailableBloodUnits(
      bloodType,
      10, // Get up to 10 units
      excludeHospitalId ? parseInt(excludeHospitalId) : null
    );

    res.status(200).json({
      bloodType,
      availableUnits: availableUnits.length,
      units: availableUnits,
    });
  } catch (err) {
    console.error("Error in checkAvailableBlood:", err);
    res.status(500).json({ error: "Failed to check available blood" });
  }
};
