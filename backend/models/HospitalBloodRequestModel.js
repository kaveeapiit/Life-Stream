import db from "../config/db.js";

const HospitalBloodRequestModel = {
  // Create a new hospital blood request
  createRequest: async (data) => {
    const {
      requesting_hospital,
      patient_name,
      patient_id,
      blood_type,
      units_needed,
      urgency_level,
      medical_condition,
      contact_details,
      location,
      preferred_hospitals,
    } = data;

    const result = await db.query(
      `INSERT INTO hospital_blood_requests 
       (requesting_hospital, patient_name, patient_id, blood_type, units_needed, 
        urgency_level, medical_condition, contact_details, location, preferred_hospitals)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
       RETURNING *`,
      [
        requesting_hospital,
        patient_name,
        patient_id || null,
        blood_type,
        units_needed,
        urgency_level,
        medical_condition || null,
        contact_details || null,
        location || null,
        preferred_hospitals || null,
      ]
    );
    return result.rows[0];
  },

  // Get all pending requests that a hospital can respond to (excluding their own)
  getAvailableRequests: async (hospital_username, filters = {}) => {
    const { blood_type, urgency_level, page = 1, limit = 20 } = filters;

    let query = `
      SELECT hbr.*, hu.name as requesting_hospital_name
      FROM hospital_blood_requests hbr
      LEFT JOIN hospital_users hu ON hbr.requesting_hospital = hu.username
      WHERE hbr.requesting_hospital != $1 
      AND hbr.status IN ('pending', 'partially_fulfilled')
      AND hbr.expires_at > NOW()
    `;

    const params = [hospital_username];
    let paramCount = 1;

    if (blood_type && blood_type !== "all") {
      paramCount++;
      query += ` AND hbr.blood_type = $${paramCount}`;
      params.push(blood_type);
    }

    if (urgency_level && urgency_level !== "all") {
      paramCount++;
      query += ` AND hbr.urgency_level = $${paramCount}`;
      params.push(urgency_level);
    }

    // Add ordering by urgency and creation time
    query += ` ORDER BY 
      CASE hbr.urgency_level 
        WHEN 'critical' THEN 1 
        WHEN 'high' THEN 2 
        WHEN 'normal' THEN 3 
        WHEN 'low' THEN 4 
      END, 
      hbr.created_at ASC`;

    // Add pagination
    const offset = (parseInt(page) - 1) * parseInt(limit);
    paramCount += 2;
    query += ` LIMIT $${paramCount - 1} OFFSET $${paramCount}`;
    params.push(parseInt(limit), offset);

    const result = await db.query(query, params);

    // Get total count for pagination
    let countQuery = `
      SELECT COUNT(*) 
      FROM hospital_blood_requests hbr
      WHERE hbr.requesting_hospital != $1 
      AND hbr.status IN ('pending', 'partially_fulfilled')
      AND hbr.expires_at > NOW()
    `;

    const countParams = [hospital_username];
    let countParamCount = 1;

    if (blood_type && blood_type !== "all") {
      countParamCount++;
      countQuery += ` AND hbr.blood_type = $${countParamCount}`;
      countParams.push(blood_type);
    }

    if (urgency_level && urgency_level !== "all") {
      countParamCount++;
      countQuery += ` AND hbr.urgency_level = $${countParamCount}`;
      countParams.push(urgency_level);
    }

    const countResult = await db.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].count);

    return {
      requests: result.rows,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
    };
  },

  // Get requests made by a specific hospital
  getHospitalRequests: async (hospital_username, filters = {}) => {
    const { status, page = 1, limit = 20 } = filters;

    let query = `
      SELECT hbr.*, hu.name as responding_hospital_name
      FROM hospital_blood_requests hbr
      LEFT JOIN hospital_users hu ON hbr.responding_hospital = hu.username
      WHERE hbr.requesting_hospital = $1
    `;

    const params = [hospital_username];
    let paramCount = 1;

    if (status && status !== "all") {
      paramCount++;
      query += ` AND hbr.status = $${paramCount}`;
      params.push(status);
    }

    query += ` ORDER BY hbr.created_at DESC`;

    // Add pagination
    const offset = (parseInt(page) - 1) * parseInt(limit);
    paramCount += 2;
    query += ` LIMIT $${paramCount - 1} OFFSET $${paramCount}`;
    params.push(parseInt(limit), offset);

    const result = await db.query(query, params);

    // Get total count
    let countQuery = `
      SELECT COUNT(*) 
      FROM hospital_blood_requests 
      WHERE requesting_hospital = $1
    `;

    const countParams = [hospital_username];
    let countParamCount = 1;

    if (status && status !== "all") {
      countParamCount++;
      countQuery += ` AND status = $${countParamCount}`;
      countParams.push(status);
    }

    const countResult = await db.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].count);

    return {
      requests: result.rows,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
    };
  },

  // Respond to a hospital blood request
  respondToRequest: async (requestId, responseData) => {
    const {
      responding_hospital,
      response_status,
      units_offered,
      response_notes,
      estimated_delivery_time,
    } = responseData;

    const result = await db.query(
      `UPDATE hospital_blood_requests 
       SET responding_hospital = $1, response_status = $2, units_offered = $3, 
           response_notes = $4, estimated_delivery_time = $5, updated_at = NOW()
       WHERE id = $6 
       RETURNING *`,
      [
        responding_hospital,
        response_status,
        units_offered || 0,
        response_notes || null,
        estimated_delivery_time || null,
        requestId,
      ]
    );
    return result.rows[0];
  },

  // Update request status
  updateRequestStatus: async (requestId, status, notes = null) => {
    const result = await db.query(
      `UPDATE hospital_blood_requests 
       SET status = $1, response_notes = COALESCE($2, response_notes), updated_at = NOW()
       WHERE id = $3 
       RETURNING *`,
      [status, notes, requestId]
    );
    return result.rows[0];
  },

  // Get request by ID
  getRequestById: async (requestId) => {
    const result = await db.query(
      `SELECT hbr.*, 
              req_hu.name as requesting_hospital_name,
              res_hu.name as responding_hospital_name
       FROM hospital_blood_requests hbr
       LEFT JOIN hospital_users req_hu ON hbr.requesting_hospital = req_hu.username
       LEFT JOIN hospital_users res_hu ON hbr.responding_hospital = res_hu.username
       WHERE hbr.id = $1`,
      [requestId]
    );
    return result.rows[0];
  },

  // Get hospital request statistics
  getHospitalStats: async (hospital_username) => {
    const result = await db.query(
      `SELECT 
         COUNT(*) FILTER (WHERE requesting_hospital = $1 AND status = 'pending') as pending_requests,
         COUNT(*) FILTER (WHERE requesting_hospital = $1 AND status = 'fulfilled') as fulfilled_requests,
         COUNT(*) FILTER (WHERE responding_hospital = $1 AND response_status = 'offered') as offers_made,
         COUNT(*) FILTER (WHERE responding_hospital = $1 AND response_status = 'delivered') as deliveries_made,
         COUNT(*) FILTER (WHERE requesting_hospital = $1 AND urgency_level = 'critical' AND status = 'pending') as critical_pending
       FROM hospital_blood_requests
       WHERE requesting_hospital = $1 OR responding_hospital = $1`,
      [hospital_username]
    );
    return result.rows[0];
  },

  // Get urgent requests (critical/high priority)
  getUrgentRequests: async (hospital_username) => {
    const result = await db.query(
      `SELECT hbr.*, hu.name as requesting_hospital_name
       FROM hospital_blood_requests hbr
       LEFT JOIN hospital_users hu ON hbr.requesting_hospital = hu.username
       WHERE hbr.requesting_hospital != $1 
       AND hbr.status IN ('pending', 'partially_fulfilled')
       AND hbr.urgency_level IN ('critical', 'high')
       AND hbr.expires_at > NOW()
       ORDER BY 
         CASE hbr.urgency_level 
           WHEN 'critical' THEN 1 
           WHEN 'high' THEN 2 
         END, 
         hbr.created_at ASC
       LIMIT 10`,
      [hospital_username]
    );
    return result.rows;
  },

  // Mark expired requests
  markExpiredRequests: async () => {
    const result = await db.query(
      `UPDATE hospital_blood_requests 
       SET status = 'expired', updated_at = NOW()
       WHERE status IN ('pending', 'partially_fulfilled') 
       AND expires_at <= NOW()
       RETURNING *`
    );
    return result.rows;
  },
};

export default HospitalBloodRequestModel;
