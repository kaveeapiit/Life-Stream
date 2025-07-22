import db from '../config/db.js';

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

  // ✅ NEW METHOD: Get all requests by user email
  getRequestsByEmail: async (email) => {
    const result = await db.query(
      `SELECT * FROM blood_requests WHERE email = $1 ORDER BY created_at DESC`,
      [email]
    );
    return result.rows;
  }
};

export default BloodRequestModel;
