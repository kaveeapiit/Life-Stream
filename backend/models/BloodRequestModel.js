import db from "../config/db.js";

const BloodRequestModel = {
  createRequest: async (data) => {
    const { name, email, blood_type, location, urgency } = data;
    const result = await db.query(
      `INSERT INTO blood_requests (name, email, blood_type, location, urgency)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [name, email, blood_type, location, urgency]
    );
    return result.rows[0];
  },

  getPendingRequests: async () => {
    const result = await db.query(
      `SELECT * FROM blood_requests WHERE status = 'pending'`
    );
    return result.rows;
  },

  updateApprovalStatus: async (id, approved) => {
    const result = await db.query(
      `UPDATE blood_requests SET approved = $1 WHERE id = $2 RETURNING *`,
      [approved, id]
    );
    return result.rows[0];
  },

  // ✅ Get all requests made by a specific user
  getRequestsByEmail: async (email) => {
    const result = await db.query(
      `SELECT * FROM blood_requests 
       WHERE email = $1 
       ORDER BY created_at DESC`,
      [email]
    );
    return result.rows;
  },

  // ✅ NEW: History (approved or declined)
  getHistoryRequests: async () => {
    const res = await db.query(
      `SELECT * FROM blood_requests 
       WHERE status IN ('approved','declined') 
       ORDER BY created_at DESC`
    );
    return res.rows;
  },

  // 🏥 Hospital-specific blood request management
  getHospitalRequests: async ({
    hospital,
    status = null,
    bloodType = null,
    urgency = null,
    page = 1,
    limit = 20,
  }) => {
    let whereConditions = [];
    let params = [];
    let paramIndex = 1;

    // Hospital should see:
    // 1. Requests assigned to them (approved, declined, fulfilled, etc.)
    // 2. Pending requests (so they can assign themselves)
    whereConditions.push(
      `(assigned_hospital = $${paramIndex} OR status = 'pending')`
    );
    params.push(hospital);
    paramIndex++;

    // Filter by blood type if specified
    if (bloodType && bloodType !== "all") {
      whereConditions.push(`blood_type = $${paramIndex}`);
      params.push(bloodType);
      paramIndex++;
    }

    // Filter by status if specified
    if (status && status !== "all") {
      whereConditions.push(`status = $${paramIndex}`);
      params.push(status);
      paramIndex++;
    }

    // Filter by urgency if specified
    if (urgency !== null && urgency !== "all") {
      whereConditions.push(`urgency = $${paramIndex}`);
      params.push(urgency === "true" || urgency === true);
      paramIndex++;
    }

    const whereClause = whereConditions.join(" AND ");
    const offset = (page - 1) * limit;

    const sql = `
      SELECT *, 
        CASE 
          WHEN urgency = true THEN 'High'
          ELSE 'Normal'
        END as urgency_level,
        EXTRACT(EPOCH FROM (NOW() - created_at))/3600 as hours_ago
      FROM blood_requests 
      WHERE ${whereClause}
      ORDER BY 
        urgency DESC, 
        created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    params.push(limit, offset);
    const { rows } = await db.query(sql, params);

    // Get total count for pagination
    const countSql = `SELECT COUNT(*) FROM blood_requests WHERE ${whereClause}`;
    const countParams = params.slice(0, -2); // Remove limit and offset
    const { rows: countRows } = await db.query(countSql, countParams);

    return {
      requests: rows,
      total: Number(countRows[0].count),
      page,
      totalPages: Math.ceil(Number(countRows[0].count) / limit),
    };
  },

  // 🏥 Update blood request status with hospital actions
  updateRequestStatus: async (id, status, hospital, notes = null) => {
    const result = await db.query(
      `UPDATE blood_requests 
       SET status = $1, 
           assigned_hospital = $2, 
           hospital_notes = $3,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $4 
       RETURNING *`,
      [status, hospital, notes, id]
    );
    return result.rows[0];
  },

  // 🏥 Get request details by ID
  getRequestById: async (id) => {
    const result = await db.query(
      `SELECT *, 
        CASE 
          WHEN urgency = true THEN 'High'
          ELSE 'Normal'
        END as urgency_level,
        EXTRACT(EPOCH FROM (NOW() - created_at))/3600 as hours_ago
       FROM blood_requests 
       WHERE id = $1`,
      [id]
    );
    return result.rows[0];
  },

  // 🏥 Get statistics for hospital dashboard
  getHospitalRequestStats: async (hospital) => {
    const statsQuery = `
      SELECT 
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_requests,
        COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved_requests,
        COUNT(CASE WHEN status = 'fulfilled' THEN 1 END) as fulfilled_requests,
        COUNT(CASE WHEN status = 'declined' THEN 1 END) as declined_requests,
        COUNT(CASE WHEN urgency = true AND status = 'pending' THEN 1 END) as urgent_pending,
        COUNT(CASE WHEN DATE(created_at) = CURRENT_DATE THEN 1 END) as today_requests
      FROM blood_requests
    `;

    const result = await db.query(statsQuery);
    return result.rows[0];
  },

  // 🔧 ADMIN: Get all blood requests for admin management
  getAllRequestsForAdmin: async () => {
    const result = await db.query(
      `SELECT *, 
        CASE 
          WHEN urgency = true THEN 'High'
          ELSE 'Normal'
        END as urgency_level,
        EXTRACT(EPOCH FROM (NOW() - created_at))/3600 as hours_ago
       FROM blood_requests 
       ORDER BY 
         CASE 
           WHEN status = 'pending' THEN 1
           WHEN status = 'approved' THEN 2
           WHEN status = 'declined' THEN 3
           ELSE 4
         END,
         urgency DESC,
         created_at DESC`
    );
    return result.rows;
  },

  // 🔧 ADMIN: Get blood request history for admin
  getRequestHistoryForAdmin: async () => {
    const result = await db.query(
      `SELECT *, 
        CASE 
          WHEN urgency = true THEN 'High'
          ELSE 'Normal'
        END as urgency_level,
        EXTRACT(EPOCH FROM (NOW() - created_at))/3600 as hours_ago
       FROM blood_requests 
       WHERE status IN ('approved', 'declined', 'fulfilled')
       ORDER BY created_at DESC`
    );
    return result.rows;
  },

  // Search for available blood units and auto-assign if possible
  checkAndAutoFulfillRequest: async (requestId) => {
    try {
      // Get request details
      const requestResult = await db.query(
        "SELECT * FROM blood_requests WHERE id = $1",
        [requestId]
      );

      if (requestResult.rows.length === 0) {
        return { success: false, error: "Request not found" };
      }

      const request = requestResult.rows[0];

      // Check if request is in pending status
      if (request.status !== "pending") {
        return { success: false, error: "Request is not in pending status" };
      }

      // Look for available blood units
      const bloodUnitsResult = await db.query(
        `SELECT * FROM blood_inventory 
         WHERE blood_type = $1 
         AND status = 'Available' 
         AND expiry_date > CURRENT_DATE
         ORDER BY expiry_date ASC 
         LIMIT 1`,
        [request.blood_type]
      );

      if (bloodUnitsResult.rows.length === 0) {
        return { success: false, error: "No available blood units found" };
      }

      const bloodUnit = bloodUnitsResult.rows[0];

      // Reserve the blood unit
      await db.query(
        `UPDATE blood_inventory 
         SET status = 'Reserved', 
             reserved_for_request_id = $1,
             updated_at = NOW()
         WHERE id = $2`,
        [requestId, bloodUnit.id]
      );

      // Update request status to approved with auto-assignment info
      await db.query(
        `UPDATE blood_requests 
         SET status = 'approved',
             assigned_hospital = (SELECT 'hospital_' || hospital_id FROM blood_inventory WHERE id = $2),
             hospital_notes = 'Auto-assigned - Blood unit available',
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $1`,
        [requestId, bloodUnit.id]
      );

      return {
        success: true,
        message: "Request auto-approved and blood unit reserved",
        bloodUnit: bloodUnit,
      };
    } catch (error) {
      console.error("Error in checkAndAutoFulfillRequest:", error);
      return {
        success: false,
        error: "Database error during auto-fulfillment",
      };
    }
  },

  // Fulfill a blood request with inventory management
  fulfillBloodRequest: async (requestId, bloodUnitIds) => {
    try {
      // Start transaction
      await db.query("BEGIN");

      // Update blood units to used status
      const bloodUnitsResult = await db.query(
        `UPDATE blood_inventory 
         SET status = 'Used',
             used_date = NOW(),
             fulfilled_request_id = $1,
             updated_at = NOW()
         WHERE id = ANY($2) AND (status = 'Reserved' OR status = 'Available')
         RETURNING *`,
        [requestId, bloodUnitIds]
      );

      if (bloodUnitsResult.rows.length === 0) {
        await db.query("ROLLBACK");
        return {
          success: false,
          error: "No valid blood units found to fulfill request",
        };
      }

      // Update request status to fulfilled
      const requestResult = await db.query(
        `UPDATE blood_requests 
         SET status = 'fulfilled',
             fulfilled_at = CURRENT_TIMESTAMP,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $1
         RETURNING *`,
        [requestId]
      );

      if (requestResult.rows.length === 0) {
        await db.query("ROLLBACK");
        return { success: false, error: "Request not found" };
      }

      // Commit transaction
      await db.query("COMMIT");

      return {
        success: true,
        message: "Blood request fulfilled successfully",
        request: requestResult.rows[0],
        bloodUnits: bloodUnitsResult.rows,
      };
    } catch (error) {
      await db.query("ROLLBACK");
      console.error("Error fulfilling blood request:", error);
      return { success: false, error: "Database error during fulfillment" };
    }
  },

  // Cancel a blood request and release reserved units
  cancelBloodRequest: async (requestId, reason = null) => {
    try {
      await db.query("BEGIN");

      // Release any reserved blood units
      await db.query(
        `UPDATE blood_inventory 
         SET status = 'Available',
             reserved_for_request_id = NULL,
             updated_at = NOW()
         WHERE reserved_for_request_id = $1 AND status = 'Reserved'`,
        [requestId]
      );

      // Update request status to cancelled
      const result = await db.query(
        `UPDATE blood_requests 
         SET status = 'cancelled',
             hospital_notes = $2,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $1
         RETURNING *`,
        [requestId, reason || "Request cancelled"]
      );

      await db.query("COMMIT");
      return result.rows[0];
    } catch (error) {
      await db.query("ROLLBACK");
      console.error("Error cancelling blood request:", error);
      throw error;
    }
  },
};

export default BloodRequestModel;
