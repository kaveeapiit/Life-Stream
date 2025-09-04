import BloodInventoryModel from "../models/BloodInventoryModel.js";
import { updateDonationStatus } from "../models/donationModel.js";
import pool from "../config/db.js";

// Get hospital inventory with filters
export const getHospitalInventory = async (req, res) => {
  const { hospital } = req.session;

  console.log("Hospital session data:", hospital); // Debug log

  if (!hospital || !hospital.id) {
    console.log("❌ Unauthorized access - no hospital session"); // Debug log
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const { bloodType, status, expiringWithinDays } = req.query;
    const filters = {};

    if (bloodType && bloodType !== "all") filters.bloodType = bloodType;
    if (status && status !== "all") filters.status = status;
    if (expiringWithinDays) filters.expiringWithinDays = expiringWithinDays;

    console.log(
      `Fetching inventory for hospital ID: ${hospital.id}, filters:`,
      filters
    ); // Debug log

    const inventory = await BloodInventoryModel.getHospitalInventory(
      hospital.id,
      filters
    );

    console.log(`Found ${inventory.length} inventory items`); // Debug log
    res.status(200).json(inventory);
  } catch (err) {
    console.error("Error fetching hospital inventory:", err.message);
    res.status(500).json({ error: "Failed to fetch inventory" });
  }
};

// Get inventory summary dashboard
export const getInventorySummary = async (req, res) => {
  const { hospital } = req.session;

  console.log("Getting inventory summary for hospital:", hospital); // Debug log

  if (!hospital || !hospital.id) {
    console.log("❌ Unauthorized access - no hospital session for summary"); // Debug log
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    console.log(`Fetching inventory summary for hospital ID: ${hospital.id}`); // Debug log
    const summary = await BloodInventoryModel.getInventorySummary(hospital.id);
    console.log("Inventory summary result:", summary); // Debug log
    res.status(200).json(summary);
  } catch (err) {
    console.error("Error fetching inventory summary:", err.message);
    res.status(500).json({ error: "Failed to fetch inventory summary" });
  }
};

// Convert approved donation to inventory unit
export const convertDonationToInventory = async (req, res) => {
  const { hospital } = req.session;
  const { donationId } = req.params;
  const { expiryDate } = req.body;

  if (!hospital || !hospital.id) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (!expiryDate) {
    return res.status(400).json({ error: "Expiry date is required" });
  }

  try {
    // First, get the donation details
    const donationQuery = await pool.query(
      "SELECT * FROM donations WHERE id = $1 AND status = $2",
      [donationId, "Approved"]
    );

    if (donationQuery.rows.length === 0) {
      return res.status(404).json({ error: "Approved donation not found" });
    }

    const donation = donationQuery.rows[0];

    // Create blood unit in inventory
    const bloodUnit = await BloodInventoryModel.createBloodUnit({
      donationId: donation.id,
      bloodType: donation.blood_type,
      donorName: donation.name,
      donorEmail: donation.email,
      hospitalId: hospital.id,
      expiryDate: expiryDate,
      status: "Available",
    });

    // Update donation status to 'Collected'
    await updateDonationStatus(donation.id, "Collected");

    res.status(201).json({
      message: "Donation successfully converted to inventory",
      bloodUnit,
    });
  } catch (err) {
    console.error("Error converting donation to inventory:", err.message);
    res.status(500).json({ error: "Failed to convert donation to inventory" });
  }
};

// Update blood unit status (use/expire)
export const updateBloodUnitStatus = async (req, res) => {
  const { hospital } = req.session;
  const { id } = req.params;
  const { status, usedDate } = req.body;

  if (!hospital || !hospital.id) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (!["Available", "Used", "Expired"].includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  try {
    // Verify the blood unit belongs to this hospital
    const bloodUnit = await BloodInventoryModel.getBloodUnitById(id);
    if (!bloodUnit || bloodUnit.hospital_id !== hospital.id) {
      return res.status(404).json({ error: "Blood unit not found" });
    }

    const updatedUnit = await BloodInventoryModel.updateBloodUnitStatus(
      id,
      status,
      status === "Used" ? usedDate || new Date() : null
    );

    res.status(200).json(updatedUnit);
  } catch (err) {
    console.error("Error updating blood unit status:", err.message);
    res.status(500).json({ error: "Failed to update blood unit status" });
  }
};

// Get alerts (low stock + expiring units)
export const getInventoryAlerts = async (req, res) => {
  const { hospital } = req.session;

  if (!hospital || !hospital.id) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    // Get low stock alerts
    const lowStockAlerts = await BloodInventoryModel.getLowStockAlerts(
      hospital.id,
      5
    );

    // Get expiring units alerts
    const expiringAlerts = await BloodInventoryModel.getExpiringUnitsAlerts(
      hospital.id,
      7
    );

    // Format alerts
    const alerts = [
      ...lowStockAlerts.map((alert) => ({
        type: "Low Stock",
        message: `Only ${alert.available_units} units of ${alert.blood_type} blood available`,
        blood_type: alert.blood_type,
        severity: "warning",
        count: alert.available_units,
      })),
      ...expiringAlerts.map((unit) => ({
        type: "Expiring Soon",
        message: `${unit.blood_type} blood unit #${
          unit.id
        } expires on ${new Date(unit.expiry_date).toLocaleDateString()}`,
        blood_type: unit.blood_type,
        severity: "urgent",
        unit_id: unit.id,
        expiry_date: unit.expiry_date,
      })),
    ];

    res.status(200).json(alerts);
  } catch (err) {
    console.error("Error fetching inventory alerts:", err.message);
    res.status(500).json({ error: "Failed to fetch inventory alerts" });
  }
};

// Mark expired units automatically
export const markExpiredUnits = async (req, res) => {
  const { hospital } = req.session;

  if (!hospital || !hospital.id) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const expiredUnits = await BloodInventoryModel.markExpiredUnits(
      hospital.id
    );
    res.status(200).json({
      message: `${expiredUnits.length} units marked as expired`,
      expiredUnits,
    });
  } catch (err) {
    console.error("Error marking expired units:", err.message);
    res.status(500).json({ error: "Failed to mark expired units" });
  }
};

// NEW: Get global blood availability across all hospitals
export const getGlobalBloodAvailability = async (req, res) => {
  try {
    const { bloodType } = req.query;
    const availability = await BloodInventoryModel.getGlobalBloodAvailability(
      bloodType
    );

    res.status(200).json({
      bloodType: bloodType || "all",
      hospitals: availability,
      totalHospitals: availability.length,
    });
  } catch (err) {
    console.error("Error fetching global blood availability:", err.message);
    res
      .status(500)
      .json({ error: "Failed to fetch global blood availability" });
  }
};

// NEW: Find available blood units for cross-hospital sharing
export const findAvailableBloodUnits = async (req, res) => {
  try {
    const { bloodType } = req.params;
    const { quantity = 1, excludeHospitalId } = req.query;

    const availableUnits = await BloodInventoryModel.findAvailableBloodUnits(
      bloodType,
      parseInt(quantity),
      excludeHospitalId ? parseInt(excludeHospitalId) : null
    );

    res.status(200).json({
      bloodType,
      requestedQuantity: parseInt(quantity),
      availableUnits: availableUnits.length,
      units: availableUnits,
    });
  } catch (err) {
    console.error("Error finding available blood units:", err.message);
    res.status(500).json({ error: "Failed to find available blood units" });
  }
};

// Debug endpoint to check session and inventory
export const debugInventory = async (req, res) => {
  try {
    console.log("🔍 Debug endpoint called");
    console.log("Session data:", req.session);
    console.log("Hospital from session:", req.session?.hospital);

    // Get all inventory data (without hospital filter for debugging)
    const allInventory = await pool.query(
      "SELECT COUNT(*) FROM blood_inventory"
    );

    // If hospital session exists, get their specific inventory
    let hospitalInventory = [];
    if (req.session?.hospital?.id) {
      const result = await pool.query(
        "SELECT COUNT(*) FROM blood_inventory WHERE hospital_id = $1",
        [req.session.hospital.id]
      );
      hospitalInventory = result.rows;
    }

    res.status(200).json({
      sessionExists: !!req.session,
      hospitalInSession: req.session?.hospital || null,
      totalInventoryInDB: allInventory.rows[0].count,
      hospitalSpecificCount: hospitalInventory[0]?.count || 0,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Debug endpoint error:", err);
    res.status(500).json({ error: err.message });
  }
};
