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
    let whereConditions = ["1=1"]; // Always true base condition
    let params = [];
    let paramIndex = 1;

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
};

export default BloodRequestModel;
