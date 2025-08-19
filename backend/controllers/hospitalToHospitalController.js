import HospitalBloodRequestModel from "../models/HospitalBloodRequestModel.js";

// 🏥 Hospital-to-Hospital Blood Request Controllers

// Create a new hospital blood request
export const createHospitalBloodRequest = async (req, res) => {
  const { hospital } = req.session;

  if (!hospital || !hospital.username) {
    return res
      .status(401)
      .json({ error: "Unauthorized: Hospital login required" });
  }

  try {
    const {
      patient_name,
      patient_id,
      blood_type,
      units_needed,
      urgency_level,
      medical_condition,
      contact_details,
      location,
      preferred_hospitals,
    } = req.body;

    // Validate required fields
    if (!patient_name || !blood_type || !units_needed) {
      return res.status(400).json({
        error: "Patient name, blood type, and units needed are required",
      });
    }

    // Validate blood type
    const validBloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
    if (!validBloodTypes.includes(blood_type)) {
      return res.status(400).json({
        error: "Invalid blood type",
      });
    }

    // Validate urgency level
    const validUrgencyLevels = ["low", "normal", "high", "critical"];
    if (urgency_level && !validUrgencyLevels.includes(urgency_level)) {
      return res.status(400).json({
        error: "Invalid urgency level",
      });
    }

    const requestData = {
      requesting_hospital: hospital.username,
      patient_name,
      patient_id,
      blood_type,
      units_needed: parseInt(units_needed),
      urgency_level: urgency_level || "normal",
      medical_condition,
      contact_details,
      location,
      preferred_hospitals,
    };

    const newRequest = await HospitalBloodRequestModel.createRequest(
      requestData
    );

    res.status(201).json({
      message: "Hospital blood request created successfully",
      request: newRequest,
    });
  } catch (err) {
    console.error("Error creating hospital blood request:", err);
    res.status(500).json({ error: "Failed to create blood request" });
  }
};

// Get available requests that hospital can respond to
export const getAvailableHospitalRequests = async (req, res) => {
  const { hospital } = req.session;

  if (!hospital || !hospital.username) {
    return res
      .status(401)
      .json({ error: "Unauthorized: Hospital login required" });
  }

  try {
    const {
      blood_type = "all",
      urgency_level = "all",
      page = 1,
      limit = 20,
    } = req.query;

    const result = await HospitalBloodRequestModel.getAvailableRequests(
      hospital.username,
      { blood_type, urgency_level, page, limit }
    );

    res.status(200).json(result);
  } catch (err) {
    console.error("Error fetching available hospital requests:", err);
    res.status(500).json({ error: "Failed to fetch available requests" });
  }
};

// Get hospital's own requests
export const getMyHospitalRequests = async (req, res) => {
  const { hospital } = req.session;

  if (!hospital || !hospital.username) {
    return res
      .status(401)
      .json({ error: "Unauthorized: Hospital login required" });
  }

  try {
    const { status = "all", page = 1, limit = 20 } = req.query;

    const result = await HospitalBloodRequestModel.getHospitalRequests(
      hospital.username,
      { status, page, limit }
    );

    res.status(200).json(result);
  } catch (err) {
    console.error("Error fetching hospital requests:", err);
    res.status(500).json({ error: "Failed to fetch hospital requests" });
  }
};

// Respond to a hospital blood request
export const respondToHospitalRequest = async (req, res) => {
  const { hospital } = req.session;
  const { id } = req.params;

  if (!hospital || !hospital.username) {
    return res
      .status(401)
      .json({ error: "Unauthorized: Hospital login required" });
  }

  try {
    const {
      response_status,
      units_offered,
      response_notes,
      estimated_delivery_time,
    } = req.body;

    // Validate response status
    const validResponseStatuses = [
      "offered",
      "confirmed",
      "delivered",
      "declined",
    ];
    if (!validResponseStatuses.includes(response_status)) {
      return res.status(400).json({
        error: "Invalid response status",
      });
    }

    // Check if request exists and is available
    const existingRequest = await HospitalBloodRequestModel.getRequestById(id);
    if (!existingRequest) {
      return res.status(404).json({ error: "Blood request not found" });
    }

    if (existingRequest.requesting_hospital === hospital.username) {
      return res.status(400).json({
        error: "Cannot respond to your own blood request",
      });
    }

    if (!["pending", "partially_fulfilled"].includes(existingRequest.status)) {
      return res.status(400).json({
        error: "This request is no longer available for responses",
      });
    }

    const responseData = {
      responding_hospital: hospital.username,
      response_status,
      units_offered: parseInt(units_offered) || 0,
      response_notes,
      estimated_delivery_time: estimated_delivery_time
        ? new Date(estimated_delivery_time)
        : null,
    };

    const updatedRequest = await HospitalBloodRequestModel.respondToRequest(
      id,
      responseData
    );

    // Update main request status if fully satisfied
    if (
      response_status === "offered" &&
      parseInt(units_offered) >= existingRequest.units_needed
    ) {
      await HospitalBloodRequestModel.updateRequestStatus(id, "fulfilled");
    } else if (
      response_status === "offered" &&
      parseInt(units_offered) < existingRequest.units_needed
    ) {
      await HospitalBloodRequestModel.updateRequestStatus(
        id,
        "partially_fulfilled"
      );
    }

    res.status(200).json({
      message: "Response submitted successfully",
      request: updatedRequest,
    });
  } catch (err) {
    console.error("Error responding to hospital request:", err);
    res.status(500).json({ error: "Failed to respond to request" });
  }
};

// Get request details
export const getHospitalRequestDetails = async (req, res) => {
  const { hospital } = req.session;
  const { id } = req.params;

  if (!hospital || !hospital.username) {
    return res
      .status(401)
      .json({ error: "Unauthorized: Hospital login required" });
  }

  try {
    const request = await HospitalBloodRequestModel.getRequestById(id);

    if (!request) {
      return res.status(404).json({ error: "Blood request not found" });
    }

    res.status(200).json(request);
  } catch (err) {
    console.error("Error fetching request details:", err);
    res.status(500).json({ error: "Failed to fetch request details" });
  }
};

// Update request status (for requesting hospital)
export const updateHospitalRequestStatus = async (req, res) => {
  const { hospital } = req.session;
  const { id } = req.params;

  if (!hospital || !hospital.username) {
    return res
      .status(401)
      .json({ error: "Unauthorized: Hospital login required" });
  }

  try {
    const { status, notes } = req.body;

    // Validate status
    const validStatuses = [
      "pending",
      "partially_fulfilled",
      "fulfilled",
      "cancelled",
      "expired",
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        error: "Invalid status",
      });
    }

    // Check if request belongs to this hospital
    const existingRequest = await HospitalBloodRequestModel.getRequestById(id);
    if (!existingRequest) {
      return res.status(404).json({ error: "Blood request not found" });
    }

    if (existingRequest.requesting_hospital !== hospital.username) {
      return res.status(403).json({
        error: "You can only update your own requests",
      });
    }

    const updatedRequest = await HospitalBloodRequestModel.updateRequestStatus(
      id,
      status,
      notes
    );

    res.status(200).json({
      message: "Request status updated successfully",
      request: updatedRequest,
    });
  } catch (err) {
    console.error("Error updating request status:", err);
    res.status(500).json({ error: "Failed to update request status" });
  }
};

// Get hospital statistics
export const getHospitalRequestStats = async (req, res) => {
  const { hospital } = req.session;

  if (!hospital || !hospital.username) {
    return res
      .status(401)
      .json({ error: "Unauthorized: Hospital login required" });
  }

  try {
    const stats = await HospitalBloodRequestModel.getHospitalStats(
      hospital.username
    );
    res.status(200).json(stats);
  } catch (err) {
    console.error("Error fetching hospital request stats:", err);
    res.status(500).json({ error: "Failed to fetch statistics" });
  }
};

// Get urgent requests
export const getUrgentHospitalRequests = async (req, res) => {
  const { hospital } = req.session;

  if (!hospital || !hospital.username) {
    return res
      .status(401)
      .json({ error: "Unauthorized: Hospital login required" });
  }

  try {
    const urgentRequests = await HospitalBloodRequestModel.getUrgentRequests(
      hospital.username
    );
    res.status(200).json(urgentRequests);
  } catch (err) {
    console.error("Error fetching urgent requests:", err);
    res.status(500).json({ error: "Failed to fetch urgent requests" });
  }
};
