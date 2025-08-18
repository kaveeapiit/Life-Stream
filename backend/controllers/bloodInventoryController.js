import BloodInventoryModel from "../models/BloodInventoryModel.js";
import { updateDonationStatus } from "../models/donationModel.js";
import pool from "../config/db.js";

// Get hospital inventory with filters
export const getHospitalInventory = async (req, res) => {
  const { hospital } = req.session;

  if (!hospital || !hospital.id) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const { bloodType, status, expiringWithinDays } = req.query;
    const filters = {};

    if (bloodType && bloodType !== "all") filters.bloodType = bloodType;
    if (status && status !== "all") filters.status = status;
    if (expiringWithinDays) filters.expiringWithinDays = expiringWithinDays;

    const inventory = await BloodInventoryModel.getHospitalInventory(
      hospital.id,
      filters
    );
    res.status(200).json(inventory);
  } catch (err) {
    console.error("Error fetching hospital inventory:", err.message);
    res.status(500).json({ error: "Failed to fetch inventory" });
  }
};

// Get inventory summary dashboard
export const getInventorySummary = async (req, res) => {
  const { hospital } = req.session;

  if (!hospital || !hospital.id) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const summary = await BloodInventoryModel.getInventorySummary(hospital.id);
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
    const { minThreshold = 5, expiringDays = 7 } = req.query;

    const [lowStockAlerts, expiringUnits] = await Promise.all([
      BloodInventoryModel.getLowStockAlerts(
        hospital.id,
        parseInt(minThreshold)
      ),
      BloodInventoryModel.getExpiringUnitsAlerts(
        hospital.id,
        parseInt(expiringDays)
      ),
    ]);

    res.status(200).json({
      lowStock: lowStockAlerts,
      expiringUnits: expiringUnits,
    });
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
