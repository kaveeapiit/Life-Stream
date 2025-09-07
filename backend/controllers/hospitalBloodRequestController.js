import BloodRequestModel from "../models/BloodRequestModel.js";
import BloodInventoryModel from "../models/BloodInventoryModel.js";
import NotificationModel from "../models/NotificationModel.js";

// 🏥 Hospital Blood Request Management Controllers

// Get blood requests for hospital management with filtering and pagination
export const getHospitalBloodRequests = async (req, res) => {
  const { hospital } = req.session;

  if (!hospital || !hospital.username) {
    return res
      .status(401)
      .json({ error: "Unauthorized: Hospital login required" });
  }

  try {
    const {
      status = "all",
      bloodType = "all",
      urgency = "all",
      page = 1,
      limit = 20,
    } = req.query;

    const result = await BloodRequestModel.getHospitalRequests({
      hospital: hospital.username,
      status: status === "all" ? null : status,
      bloodType: bloodType === "all" ? null : bloodType,
      urgency: urgency === "all" ? null : urgency,
      page: parseInt(page),
      limit: parseInt(limit),
    });

    res.status(200).json(result);
  } catch (err) {
    console.error("Error fetching hospital blood requests:", err);
    res.status(500).json({ error: "Failed to fetch blood requests" });
  }
};

// Get specific blood request details
export const getBloodRequestDetails = async (req, res) => {
  const { hospital } = req.session;
  const { id } = req.params;

  if (!hospital || !hospital.username) {
    return res
      .status(401)
      .json({ error: "Unauthorized: Hospital login required" });
  }

  try {
    const request = await BloodRequestModel.getRequestById(id);

    if (!request) {
      return res.status(404).json({ error: "Blood request not found" });
    }

    res.status(200).json(request);
  } catch (err) {
    console.error("Error fetching blood request details:", err);
    res.status(500).json({ error: "Failed to fetch blood request details" });
  }
};

// Update blood request status (approve, decline, fulfill, etc.)
export const updateBloodRequestStatus = async (req, res) => {
  const { hospital } = req.session;
  const { id } = req.params;
  const { status, notes } = req.body;

  if (!hospital || !hospital.username) {
    return res
      .status(401)
      .json({ error: "Unauthorized: Hospital login required" });
  }

  // Validate status
  const validStatuses = [
    "pending",
    "approved",
    "declined",
    "fulfilled",
    "cancelled",
  ];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      error: "Invalid status. Must be one of: " + validStatuses.join(", "),
    });
  }

  try {
    const updatedRequest = await BloodRequestModel.updateRequestStatus(
      id,
      status,
      hospital.username,
      notes || null
    );

    if (!updatedRequest) {
      return res.status(404).json({ error: "Blood request not found" });
    }

    // Debug: Log the status and request details
    console.log(
      `🔍 DEBUG: Processing status update - status: "${status}", updatedRequest:`,
      updatedRequest
    );

    // Create notification when request is approved or declined
    if (status === "approved" || status === "declined") {
      console.log(
        `🔔 ENTERING notification creation block for ${status} request`
      );
      try {
        console.log(`🔔 Creating notification for ${status} request:`, {
          email: updatedRequest.email,
          bloodType: updatedRequest.blood_type,
          hospital: hospital.username,
        });

        const notificationMessage =
          status === "approved"
            ? `Great news! Your ${updatedRequest.blood_type} blood request has been approved by ${hospital.username}. The hospital will contact you shortly with next steps.`
            : `Your ${updatedRequest.blood_type} blood request has been declined by ${hospital.username}. Please try submitting a request to another hospital.`;

        console.log(
          `🔔 About to call NotificationModel.createNotification with:`,
          {
            email: updatedRequest.email,
            title: `Blood Request ${
              status.charAt(0).toUpperCase() + status.slice(1)
            }`,
            message: notificationMessage,
            type: status === "approved" ? "success" : "info",
          }
        );

        const notification = await NotificationModel.createNotification({
          email: updatedRequest.email,
          title: `Blood Request ${
            status.charAt(0).toUpperCase() + status.slice(1)
          }`,
          message: notificationMessage,
          type: status === "approved" ? "success" : "info",
        });

        console.log(`✅ Notification created successfully:`, notification);
      } catch (notificationError) {
        console.error("❌ Error creating notification:", notificationError);
        console.error("❌ Full error stack:", notificationError.stack);
        // Continue execution even if notification fails
      }
    } else {
      console.log(
        `🚫 NOT creating notification - status "${status}" does not match "approved" or "declined"`
      );
    }

    res.status(200).json({
      message: `Blood request ${status} successfully`,
      request: updatedRequest,
    });
  } catch (err) {
    console.error("Error updating blood request status:", err);
    res.status(500).json({ error: "Failed to update blood request status" });
  }
};

// Assign blood request to hospital
export const assignBloodRequestToHospital = async (req, res) => {
  const { hospital } = req.session;
  const { id } = req.params;
  const { notes } = req.body;

  if (!hospital || !hospital.username) {
    return res
      .status(401)
      .json({ error: "Unauthorized: Hospital login required" });
  }

  try {
    const updatedRequest = await BloodRequestModel.updateRequestStatus(
      id,
      "approved",
      hospital.username,
      notes || `Assigned to ${hospital.username}`
    );

    if (!updatedRequest) {
      return res.status(404).json({ error: "Blood request not found" });
    }

    res.status(200).json({
      message: "Blood request assigned to hospital successfully",
      request: updatedRequest,
    });
  } catch (err) {
    console.error("Error assigning blood request:", err);
    res.status(500).json({ error: "Failed to assign blood request" });
  }
};

// Get blood request statistics for hospital dashboard
export const getBloodRequestStats = async (req, res) => {
  const { hospital } = req.session;

  if (!hospital || !hospital.username) {
    return res
      .status(401)
      .json({ error: "Unauthorized: Hospital login required" });
  }

  try {
    const stats = await BloodRequestModel.getHospitalRequestStats(
      hospital.username
    );
    res.status(200).json(stats);
  } catch (err) {
    console.error("Error fetching blood request stats:", err);
    res.status(500).json({ error: "Failed to fetch blood request statistics" });
  }
};

// Get urgent/priority blood requests
export const getUrgentBloodRequests = async (req, res) => {
  const { hospital } = req.session;

  if (!hospital || !hospital.username) {
    return res
      .status(401)
      .json({ error: "Unauthorized: Hospital login required" });
  }

  try {
    const result = await BloodRequestModel.getHospitalRequests({
      hospital: hospital.username,
      status: "pending",
      urgency: true,
      page: 1,
      limit: 50,
    });

    res.status(200).json(result);
  } catch (err) {
    console.error("Error fetching urgent blood requests:", err);
    res.status(500).json({ error: "Failed to fetch urgent blood requests" });
  }
};

// NEW: Fulfill blood request using hospital inventory
export const fulfillBloodRequestWithInventory = async (req, res) => {
  const { hospital } = req.session;
  const { id } = req.params;
  const { bloodUnitIds, notes } = req.body;

  if (!hospital || !hospital.id) {
    return res
      .status(401)
      .json({ error: "Unauthorized: Hospital login required" });
  }

  if (
    !bloodUnitIds ||
    !Array.isArray(bloodUnitIds) ||
    bloodUnitIds.length === 0
  ) {
    return res.status(400).json({ error: "Blood unit IDs are required" });
  }

  try {
    // Verify all blood units belong to this hospital
    const verificationResults = await Promise.all(
      bloodUnitIds.map((unitId) => BloodInventoryModel.getBloodUnitById(unitId))
    );

    const invalidUnits = verificationResults.filter(
      (unit) => !unit || unit.hospital_id !== hospital.id
    );

    if (invalidUnits.length > 0) {
      return res.status(403).json({
        error: "Some blood units do not belong to your hospital",
      });
    }

    // Fulfill the request
    const result = await BloodRequestModel.fulfillBloodRequest(
      id,
      bloodUnitIds
    );

    if (result.success) {
      // Also update the request with hospital notes
      await BloodRequestModel.updateRequestStatus(
        id,
        "fulfilled",
        hospital.username,
        notes || "Fulfilled using hospital inventory"
      );

      res.status(200).json({
        ...result,
        message:
          "Blood request fulfilled successfully using hospital inventory",
      });
    } else {
      res.status(400).json({ error: result.error });
    }
  } catch (err) {
    console.error("Error fulfilling blood request with inventory:", err);
    res.status(500).json({ error: "Failed to fulfill blood request" });
  }
};

// NEW: Get available blood inventory for request fulfillment
export const getAvailableInventoryForRequest = async (req, res) => {
  const { hospital } = req.session;
  const { id } = req.params;

  if (!hospital || !hospital.id) {
    return res
      .status(401)
      .json({ error: "Unauthorized: Hospital login required" });
  }

  try {
    // Get request details
    const request = await BloodRequestModel.getRequestById(id);
    if (!request) {
      return res.status(404).json({ error: "Blood request not found" });
    }

    // Get available blood units of the required type
    const availableUnits = await BloodInventoryModel.getHospitalInventory(
      hospital.id,
      {
        bloodType: request.blood_type,
        status: "Available",
      }
    );

    // Filter out expired units
    const validUnits = availableUnits.filter(
      (unit) => new Date(unit.expiry_date) > new Date()
    );

    res.status(200).json({
      request: request,
      availableUnits: validUnits,
      totalAvailable: validUnits.length,
    });
  } catch (err) {
    console.error("Error getting available inventory for request:", err);
    res.status(500).json({ error: "Failed to get available inventory" });
  }
};

// NEW: Reserve blood units for a request
export const reserveBloodUnitsForRequest = async (req, res) => {
  const { hospital } = req.session;
  const { id } = req.params;
  const { bloodUnitIds } = req.body;

  if (!hospital || !hospital.id) {
    return res
      .status(401)
      .json({ error: "Unauthorized: Hospital login required" });
  }

  if (
    !bloodUnitIds ||
    !Array.isArray(bloodUnitIds) ||
    bloodUnitIds.length === 0
  ) {
    return res.status(400).json({ error: "Blood unit IDs are required" });
  }

  try {
    // Reserve the blood units
    const reservedUnits = await BloodInventoryModel.reserveBloodUnits(
      bloodUnitIds,
      id
    );

    if (reservedUnits.length === 0) {
      return res.status(400).json({
        error:
          "No blood units could be reserved (may already be reserved or unavailable)",
      });
    }

    // Update request status to approved
    await BloodRequestModel.updateRequestStatus(
      id,
      "approved",
      hospital.username,
      `Reserved ${reservedUnits.length} blood unit(s) for fulfillment`
    );

    res.status(200).json({
      message: `Successfully reserved ${reservedUnits.length} blood unit(s)`,
      reservedUnits: reservedUnits,
      requestId: id,
    });
  } catch (err) {
    console.error("Error reserving blood units for request:", err);
    res.status(500).json({ error: "Failed to reserve blood units" });
  }
};
