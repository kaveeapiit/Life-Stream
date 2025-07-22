import db from '../config/db.js';

const RecipientModel = {
  // ✅ Get all recipient requests that are still pending
  getPendingRequests: async () => {
    const res = await db.query(`
      SELECT * FROM blood_requests
      WHERE status = 'pending'
    `);
    return res.rows;
  },

  // ✅ Update approval status and set status to 'approved' or 'declined'
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

  // ✅ Fetch all approved recipient requests
  getApprovedDonations: async () => {
    const res = await db.query(
      `SELECT * FROM blood_requests WHERE approved = true`
    );
    return res.rows;
  }
};

export default RecipientModel;
