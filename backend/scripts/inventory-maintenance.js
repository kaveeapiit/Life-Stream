// Inventory Maintenance Script
// This script should be run periodically (e.g., daily) to maintain inventory

import BloodInventoryModel from "../models/BloodInventoryModel.js";
import pool from "../config/db.js";

// Automatic inventory maintenance
export const performInventoryMaintenance = async () => {
  try {
    console.log("🔧 Running inventory maintenance...");

    // Get all hospitals with inventory
    const hospitals = await pool.query(
      "SELECT DISTINCT hospital_id FROM blood_inventory"
    );

    let totalExpiredMarked = 0;

    for (const hospital of hospitals.rows) {
      // Mark expired units for each hospital
      const expiredUnits = await BloodInventoryModel.markExpiredUnits(
        hospital.hospital_id
      );
      totalExpiredMarked += expiredUnits.length;

      if (expiredUnits.length > 0) {
        console.log(
          `📅 Marked ${expiredUnits.length} expired units for hospital ${hospital.hospital_id}`
        );
      }
    }

    console.log(
      `✅ Inventory maintenance completed. Total expired units marked: ${totalExpiredMarked}`
    );
    return {
      success: true,
      totalExpiredMarked,
      hospitalsProcessed: hospitals.rows.length,
    };
  } catch (err) {
    console.error("❌ Error during inventory maintenance:", err);
    return { success: false, error: err.message };
  }
};

// Enhanced inventory notifications
export const generateInventoryReport = async (hospitalId = null) => {
  try {
    const whereClause = hospitalId ? "WHERE hospital_id = $1" : "";
    const params = hospitalId ? [hospitalId] : [];

    const reportQuery = `
      SELECT 
        hospital_id,
        blood_type,
        COUNT(*) as total_units,
        COUNT(CASE WHEN status = 'Available' AND expiry_date > CURRENT_DATE THEN 1 END) as available_units,
        COUNT(CASE WHEN status = 'Used' THEN 1 END) as used_units,
        COUNT(CASE WHEN status = 'Expired' THEN 1 END) as expired_units,
        COUNT(CASE WHEN status = 'Reserved' THEN 1 END) as reserved_units,
        COUNT(CASE WHEN status = 'Available' AND expiry_date <= CURRENT_DATE + INTERVAL '7 days' AND expiry_date > CURRENT_DATE THEN 1 END) as expiring_soon,
        MIN(CASE WHEN status = 'Available' AND expiry_date > CURRENT_DATE THEN expiry_date END) as earliest_expiry
      FROM blood_inventory 
      ${whereClause}
      GROUP BY hospital_id, blood_type 
      ORDER BY hospital_id, blood_type
    `;

    const result = await pool.query(reportQuery, params);

    // Process results to create actionable insights
    const insights = result.rows.map((row) => {
      const insights = [];

      // Low stock warning
      if (row.available_units < 3) {
        insights.push({
          type: "low_stock",
          severity: "high",
          message: `Critical: Only ${row.available_units} units of ${row.blood_type} available`,
        });
      } else if (row.available_units < 5) {
        insights.push({
          type: "low_stock",
          severity: "medium",
          message: `Low stock: ${row.available_units} units of ${row.blood_type} available`,
        });
      }

      // Expiring soon warning
      if (row.expiring_soon > 0) {
        insights.push({
          type: "expiring_soon",
          severity: "medium",
          message: `${row.expiring_soon} units of ${row.blood_type} expiring within 7 days`,
        });
      }

      return {
        ...row,
        insights,
      };
    });

    return {
      success: true,
      report: insights,
      generatedAt: new Date().toISOString(),
    };
  } catch (err) {
    console.error("Error generating inventory report:", err);
    return { success: false, error: err.message };
  }
};

// Run maintenance if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  performInventoryMaintenance()
    .then((result) => {
      console.log("Maintenance result:", result);
      process.exit(result.success ? 0 : 1);
    })
    .catch((err) => {
      console.error("Maintenance failed:", err);
      process.exit(1);
    });
}

export default {
  performInventoryMaintenance,
  generateInventoryReport,
};
