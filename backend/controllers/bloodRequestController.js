import BloodRequestModel from "../models/BloodRequestModel.js";
import BloodInventoryModel from "../models/BloodInventoryModel.js";

export const createBloodRequest = async (req, res) => {
  try {
    const request = await BloodRequestModel.createRequest(req.body);

    // Try to auto-fulfill the request if blood is available
    const autoFulfillResult =
      await BloodRequestModel.checkAndAutoFulfillRequest(request.id);

    if (autoFulfillResult.success) {
      res.status(201).json({
        ...request,
        autoFulfilled: true,
        message:
          "Request created and automatically approved - blood unit reserved",
        bloodUnit: autoFulfillResult.bloodUnit,
      });
    } else {
      res.status(201).json({
        ...request,
        autoFulfilled: false,
        message: "Request created successfully, awaiting manual review",
      });
    }
  } catch (err) {
    console.error("Error in createBloodRequest:", err);
    res.status(500).json({ error: "Failed to create request" });
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

// ✅ Update approval status with inventory management
export const updateApproval = async (req, res) => {
  try {
    const { id } = req.params;
    const { approved, assignedBloodUnitId } = req.body;

    if (typeof approved !== "boolean") {
      return res.status(400).json({ error: "Approved must be true or false" });
    }

    // If approving and a blood unit is assigned, update inventory
    if (approved && assignedBloodUnitId) {
      // Mark the blood unit as used/reserved
      await BloodInventoryModel.updateBloodUnitStatus(
        assignedBloodUnitId,
        "Used",
        new Date()
      );
    }

    const updated = await BloodRequestModel.updateApprovalStatus(id, approved);
    res.status(200).json(updated);
  } catch (err) {
    console.error("Error updating approval:", err);
    res.status(500).json({ error: "Failed to update approval status" });
  }
};

// ✅ NEW: Fulfill blood request with specific blood unit
export const fulfillBloodRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { bloodUnitIds, notes } = req.body;

    if (
      !bloodUnitIds ||
      !Array.isArray(bloodUnitIds) ||
      bloodUnitIds.length === 0
    ) {
      return res.status(400).json({ error: "Blood unit IDs are required" });
    }

    // Fulfill the request with inventory management
    const result = await BloodRequestModel.fulfillBloodRequest(
      id,
      bloodUnitIds,
      notes
    );

    if (result.success) {
      res.status(200).json({
        message: "Blood request fulfilled successfully",
        request: result.request,
        bloodUnits: result.bloodUnits,
      });
    } else {
      res.status(400).json({ error: result.error });
    }
  } catch (err) {
    console.error("Error fulfilling blood request:", err);
    res.status(500).json({ error: "Failed to fulfill blood request" });
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

// NEW: Fulfill a blood request with enhanced inventory management
export const fulfillBloodRequestEnhanced = async (req, res) => {
  try {
    const { id } = req.params;
    const { bloodUnitIds, notes } = req.body;

    if (
      !bloodUnitIds ||
      !Array.isArray(bloodUnitIds) ||
      bloodUnitIds.length === 0
    ) {
      return res.status(400).json({ error: "Blood unit IDs are required" });
    }

    // Fulfill the request with inventory management
    const result = await BloodRequestModel.fulfillBloodRequest(
      id,
      bloodUnitIds,
      notes
    );

    if (result.success) {
      res.status(200).json({
        message: "Blood request fulfilled successfully",
        request: result.request,
        bloodUnits: result.bloodUnits,
      });
    } else {
      res.status(400).json({ error: result.error });
    }
  } catch (err) {
    console.error("Error fulfilling blood request:", err);
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
