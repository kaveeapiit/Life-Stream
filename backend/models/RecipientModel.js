import db from '../config/db.js';

const RecipientModel = {
  // ✅ Location-based pending requests for hospital login
  getPendingRequestsForHospital: async (hospitalUsername) => {
    const query = `
      SELECT * FROM blood_requests
      WHERE status = 'pending' AND LOWER(location) LIKE LOWER($1)
      ORDER BY created_at DESC
    `;
    const keyword = `%${hospitalUsername}%`;
    const res = await db.query(query, [keyword]);
    return res.rows;
  },

  // ✅ Update approval status
  updateApprovalStatus: async (id, approved) => {
    const status = approved ? 'approved' : 'declined';
    const res = await db.query(
      `UPDATE blood_requests
       SET approved = $1, status = $2
       WHERE id = $3 RETURNING *`,
      [approved, status, id]
    );
    return res.rows[0];
  },

  // ✅ Get all approved requests
  getApprovedDonations: async () => {
    const res = await db.query(
      `SELECT * FROM blood_requests WHERE approved = true`
    );
    return res.rows;
  }
};

export default RecipientModel;
