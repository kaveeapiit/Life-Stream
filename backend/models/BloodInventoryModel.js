import pool from "../config/db.js";

const BloodInventoryModel = {
  // Create a new blood unit in inventory
  createBloodUnit: async (data) => {
    const {
      donationId,
      bloodType,
      donorName,
      donorEmail,
      hospitalId,
      expiryDate,
      status = "Available",
    } = data;
    const result = await pool.query(
      `INSERT INTO blood_inventory (donation_id, blood_type, donor_name, donor_email, hospital_id, expiry_date, status, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW()) RETURNING *`,
      [
        donationId,
        bloodType,
        donorName,
        donorEmail,
        hospitalId,
        expiryDate,
        status,
      ]
    );
    return result.rows[0];
  },

  // Get all blood units for a specific hospital
  getHospitalInventory: async (hospitalId, filters = {}) => {
    let query = `
      SELECT * FROM blood_inventory 
      WHERE hospital_id = $1
    `;
    const params = [hospitalId];
    let paramIndex = 2;

    // Add filters
    if (filters.bloodType) {
      query += ` AND blood_type = $${paramIndex}`;
      params.push(filters.bloodType);
      paramIndex++;
    }

    if (filters.status) {
      query += ` AND status = $${paramIndex}`;
      params.push(filters.status);
      paramIndex++;
    }

    if (filters.expiringWithinDays) {
      query += ` AND expiry_date <= $${paramIndex}`;
      const expiryDate = new Date();
      expiryDate.setDate(
        expiryDate.getDate() + parseInt(filters.expiringWithinDays)
      );
      params.push(expiryDate);
      paramIndex++;
    }

    query += ` ORDER BY expiry_date ASC`;

    const result = await pool.query(query, params);
    return result.rows;
  },

  // Get inventory summary by blood type
  getInventorySummary: async (hospitalId) => {
    const result = await pool.query(
      `SELECT 
        blood_type,
        COUNT(*) as total_units,
        COUNT(CASE WHEN status = 'Available' THEN 1 END) as available_units,
        COUNT(CASE WHEN status = 'Used' THEN 1 END) as used_units,
        COUNT(CASE WHEN status = 'Expired' THEN 1 END) as expired_units,
        COUNT(CASE WHEN expiry_date <= CURRENT_DATE + INTERVAL '7 days' AND status = 'Available' THEN 1 END) as expiring_soon
       FROM blood_inventory 
       WHERE hospital_id = $1
       GROUP BY blood_type
       ORDER BY blood_type`,
      [hospitalId]
    );
    return result.rows;
  },

  // Update blood unit status
  updateBloodUnitStatus: async (id, status, usedDate = null) => {
    const result = await pool.query(
      `UPDATE blood_inventory 
       SET status = $1, used_date = $2, updated_at = NOW()
       WHERE id = $3 RETURNING *`,
      [status, usedDate, id]
    );
    return result.rows[0];
  },

  // Mark expired blood units
  markExpiredUnits: async (hospitalId) => {
    const result = await pool.query(
      `UPDATE blood_inventory 
       SET status = 'Expired', updated_at = NOW()
       WHERE hospital_id = $1 AND expiry_date < CURRENT_DATE AND status = 'Available'
       RETURNING *`,
      [hospitalId]
    );
    return result.rows;
  },

  // Get low stock alerts
  getLowStockAlerts: async (hospitalId, minThreshold = 5) => {
    const result = await pool.query(
      `SELECT 
        blood_type,
        COUNT(*) as available_units
       FROM blood_inventory 
       WHERE hospital_id = $1 AND status = 'Available'
       GROUP BY blood_type
       HAVING COUNT(*) < $2
       ORDER BY COUNT(*) ASC`,
      [hospitalId, minThreshold]
    );
    return result.rows;
  },

  // Get expiring units alerts
  getExpiringUnitsAlerts: async (hospitalId, days = 7) => {
    const result = await pool.query(
      `SELECT * FROM blood_inventory 
       WHERE hospital_id = $1 
       AND status = 'Available' 
       AND expiry_date <= CURRENT_DATE + INTERVAL '${days} days'
       ORDER BY expiry_date ASC`,
      [hospitalId]
    );
    return result.rows;
  },

  // Delete blood unit (admin only)
  deleteBloodUnit: async (id) => {
    const result = await pool.query(
      "DELETE FROM blood_inventory WHERE id = $1 RETURNING *",
      [id]
    );
    return result.rows[0];
  },

  // Get blood unit by ID
  getBloodUnitById: async (id) => {
    const result = await pool.query(
      "SELECT * FROM blood_inventory WHERE id = $1",
      [id]
    );
    return result.rows[0];
  },
};

export default BloodInventoryModel;
