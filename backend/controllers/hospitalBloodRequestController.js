import BloodRequestModel from "../models/BloodRequestModel.js";

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
