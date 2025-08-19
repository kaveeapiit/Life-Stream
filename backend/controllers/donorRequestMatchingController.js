import DonorRequestMatchingModel from "../models/DonorRequestMatchingModel.js";
import BloodRequestModel from "../models/BloodRequestModel.js";

// 🩺 Donor-Request Matching Controllers

// Find compatible donors for a specific blood request
export const findCompatibleDonorsForRequest = async (req, res) => {
  const { hospital } = req.session;
  const { requestId } = req.params;

  if (!hospital || !hospital.username) {
    return res
      .status(401)
      .json({ error: "Unauthorized: Hospital login required" });
  }

  try {
    // First get the blood request details
    const request = await BloodRequestModel.getRequestById(requestId);

    if (!request) {
      return res.status(404).json({ error: "Blood request not found" });
    }

    const { page = 1, limit = 20 } = req.query;

    // Find compatible donors
    const result = await DonorRequestMatchingModel.findCompatibleDonors({
      requestId: parseInt(requestId),
      bloodType: request.blood_type,
      urgency: request.urgency,
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
    });

    res.status(200).json({
      ...result,
      request: {
        id: request.id,
        name: request.name,
        blood_type: request.blood_type,
        urgency: request.urgency,
        status: request.status,
      },
      page: parseInt(page),
      totalPages: Math.ceil(result.total / parseInt(limit)),
    });
  } catch (err) {
    console.error("Error finding compatible donors:", err);
    res.status(500).json({ error: "Failed to find compatible donors" });
  }
};

// Get donors filtered by blood type with request matching context
export const getDonorsWithRequestMatching = async (req, res) => {
  const { hospital } = req.session;

  if (!hospital || !hospital.username) {
    return res
      .status(401)
      .json({ error: "Unauthorized: Hospital login required" });
  }

  try {
    const { bloodType = "all", search = "", page = 1, limit = 20 } = req.query;

    const result =
      await DonorRequestMatchingModel.getDonorsByBloodTypeForRequests({
        bloodType: bloodType === "all" ? null : bloodType,
        search,
        page: parseInt(page),
        limit: parseInt(limit),
      });

    res.status(200).json(result);
  } catch (err) {
    console.error("Error fetching donors with request matching:", err);
    res
      .status(500)
      .json({ error: "Failed to fetch donors with request matching" });
  }
};

// Get donor-request matching summary for dashboard
export const getDonorRequestMatchingSummary = async (req, res) => {
  const { hospital } = req.session;

  if (!hospital || !hospital.username) {
    return res
      .status(401)
      .json({ error: "Unauthorized: Hospital login required" });
  }

  try {
    const summary =
      await DonorRequestMatchingModel.getDonorRequestMatchingSummary();
    res.status(200).json(summary);
  } catch (err) {
    console.error("Error fetching donor-request matching summary:", err);
    res.status(500).json({ error: "Failed to fetch matching summary" });
  }
};

// Get detailed blood type matching analysis
export const getBloodTypeMatchingAnalysis = async (req, res) => {
  const { hospital } = req.session;
  const { bloodType } = req.params;

  if (!hospital || !hospital.username) {
    return res
      .status(401)
      .json({ error: "Unauthorized: Hospital login required" });
  }

  try {
    const analysis =
      await DonorRequestMatchingModel.getBloodTypeMatchingAnalysis(bloodType);
    res.status(200).json(analysis);
  } catch (err) {
    console.error("Error fetching blood type matching analysis:", err);
    res.status(500).json({ error: "Failed to fetch blood type analysis" });
  }
};

// Get all blood types with their donor/request counts
export const getBloodTypeOverview = async (req, res) => {
  const { hospital } = req.session;

  if (!hospital || !hospital.username) {
    return res
      .status(401)
      .json({ error: "Unauthorized: Hospital login required" });
  }

  try {
    const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
    const overview = [];

    for (const bloodType of bloodTypes) {
      const analysis =
        await DonorRequestMatchingModel.getBloodTypeMatchingAnalysis(bloodType);
      const totalDonors = Object.values(analysis.donorCounts).reduce(
        (sum, count) => sum + count,
        0
      );
      const totalRequests = Object.values(analysis.requestCounts).reduce(
        (sum, count) => sum + count,
        0
      );

      overview.push({
        bloodType,
        availableDonors: analysis.donorCounts[bloodType] || 0,
        compatibleDonors: totalDonors,
        pendingRequests: analysis.requestCounts[bloodType] || 0,
        totalRequestsCanFulfill: totalRequests,
        compatibility: analysis,
      });
    }

    res.status(200).json(overview);
  } catch (err) {
    console.error("Error fetching blood type overview:", err);
    res.status(500).json({ error: "Failed to fetch blood type overview" });
  }
};

// Find compatible donors filtered by hospital location
export const findCompatibleDonorsByLocation = async (req, res) => {
  const { hospital } = req.session;

  if (!hospital || !hospital.username) {
    return res
      .status(401)
      .json({ error: "Unauthorized: Hospital login required" });
  }

  try {
    const { bloodType, page = 1, limit = 20 } = req.query;

    if (!bloodType) {
      return res.status(400).json({ error: "Blood type is required" });
    }

    // Find compatible donors in the hospital's location (using username as location)
    const result =
      await DonorRequestMatchingModel.findCompatibleDonorsByLocation({
        bloodType,
        hospitalLocation: hospital.username, // Use username as location identifier
        limit: parseInt(limit),
        offset: (parseInt(page) - 1) * parseInt(limit),
      });

    res.status(200).json({
      ...result,
      page: parseInt(page),
      totalPages: Math.ceil(result.total / parseInt(limit)),
      hospitalLocation: hospital.username,
    });
  } catch (err) {
    console.error("Error finding compatible donors by location:", err);
    res
      .status(500)
      .json({ error: "Failed to find compatible donors by location" });
  }
};

// Get donors filtered by location and blood type
export const getDonorsByLocationAndBloodType = async (req, res) => {
  const { hospital } = req.session;

  if (!hospital || !hospital.username) {
    return res
      .status(401)
      .json({ error: "Unauthorized: Hospital login required" });
  }

  try {
    const { bloodType = "all", search = "", page = 1, limit = 20 } = req.query;

    const result =
      await DonorRequestMatchingModel.getDonorsByLocationAndBloodType({
        hospitalLocation: hospital.username, // Use username as location identifier
        bloodType,
        search,
        page: parseInt(page),
        limit: parseInt(limit),
      });

    res.status(200).json({
      ...result,
      hospitalLocation: hospital.username,
    });
  } catch (err) {
    console.error("Error fetching donors by location:", err);
    res.status(500).json({ error: "Failed to fetch donors by location" });
  }
};

// Get location-based matching statistics
export const getLocationMatchingStats = async (req, res) => {
  const { hospital } = req.session;

  if (!hospital || !hospital.username) {
    return res
      .status(401)
      .json({ error: "Unauthorized: Hospital login required" });
  }

  try {
    const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
    const stats = [];

    for (const bloodType of bloodTypes) {
      // Get donors in hospital location for this blood type
      const locationDonors =
        await DonorRequestMatchingModel.getDonorsByLocationAndBloodType({
          hospitalLocation: hospital.username, // Use username as location identifier
          bloodType,
          page: 1,
          limit: 1, // Just get count
        });

      // Get all compatible donors for this blood type
      const allCompatible =
        await DonorRequestMatchingModel.findCompatibleDonorsByLocation({
          bloodType,
          hospitalLocation: hospital.username, // Use username as location identifier
          limit: 1, // Just get count
          offset: 0,
        });

      stats.push({
        bloodType,
        localDonors: locationDonors.total,
        compatibleDonors: allCompatible.total,
        location: hospital.username,
      });
    }

    res.status(200).json({
      stats,
      hospitalLocation: hospital.username,
      totalLocalDonors: stats.reduce((sum, stat) => sum + stat.localDonors, 0),
      totalCompatibleDonors: stats.reduce(
        (sum, stat) => sum + stat.compatibleDonors,
        0
      ),
    });
  } catch (err) {
    console.error("Error fetching location matching stats:", err);
    res
      .status(500)
      .json({ error: "Failed to fetch location matching statistics" });
  }
};
