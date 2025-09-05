import pool from "../config/db.js";

// Fix sequence issues for all tables
export const fixSequences = async (req, res) => {
  try {
    console.log("Fixing database sequences...");

    // Fix donations table sequence
    const donationsSeqFix = await pool.query(`
      SELECT setval('donations_id_seq', COALESCE((SELECT MAX(id) FROM donations), 0) + 1, false);
    `);
    console.log("Donations sequence fixed:", donationsSeqFix.rows[0]);

    // Fix users table sequence
    const usersSeqFix = await pool.query(`
      SELECT setval('users_id_seq', COALESCE((SELECT MAX(id) FROM users), 0) + 1, false);
    `);
    console.log("Users sequence fixed:", usersSeqFix.rows[0]);

    // Fix blood_requests table sequence
    const bloodRequestsSeqFix = await pool.query(`
      SELECT setval('blood_requests_id_seq', COALESCE((SELECT MAX(id) FROM blood_requests), 0) + 1, false);
    `);
    console.log("Blood requests sequence fixed:", bloodRequestsSeqFix.rows[0]);

    // Fix other important sequences
    const bloodInventorySeqFix = await pool.query(`
      SELECT setval('blood_inventory_id_seq', COALESCE((SELECT MAX(id) FROM blood_inventory), 0) + 1, false);
    `);
    console.log(
      "Blood inventory sequence fixed:",
      bloodInventorySeqFix.rows[0]
    );

    // Test next values
    const donationsNextVal = await pool.query(
      `SELECT nextval('donations_id_seq') as next_donation_id;`
    );
    const usersNextVal = await pool.query(
      `SELECT nextval('users_id_seq') as next_user_id;`
    );
    const bloodRequestsNextVal = await pool.query(
      `SELECT nextval('blood_requests_id_seq') as next_blood_request_id;`
    );
    const bloodInventoryNextVal = await pool.query(
      `SELECT nextval('blood_inventory_id_seq') as next_blood_inventory_id;`
    );

    res.status(200).json({
      success: true,
      message: "Database sequences fixed successfully",
      donationsSequence: donationsSeqFix.rows[0],
      usersSequence: usersSeqFix.rows[0],
      bloodRequestsSequence: bloodRequestsSeqFix.rows[0],
      bloodInventorySequence: bloodInventorySeqFix.rows[0],
      nextDonationId: donationsNextVal.rows[0],
      nextUserId: usersNextVal.rows[0],
      nextBloodRequestId: bloodRequestsNextVal.rows[0],
      nextBloodInventoryId: bloodInventoryNextVal.rows[0],
    });
  } catch (error) {
    console.error("Fix sequences failed:", error);
    res.status(500).json({
      success: false,
      error: error.message,
      code: error.code,
      detail: error.detail,
    });
  }
};

// Check current sequence values
export const checkSequences = async (req, res) => {
  try {
    console.log("Checking database sequences...");

    // Check current sequence values
    const donationsSeq = await pool.query(
      `SELECT last_value, is_called FROM donations_id_seq;`
    );
    const usersSeq = await pool.query(
      `SELECT last_value, is_called FROM users_id_seq;`
    );
    const bloodRequestsSeq = await pool.query(
      `SELECT last_value, is_called FROM blood_requests_id_seq;`
    );
    const bloodInventorySeq = await pool.query(
      `SELECT last_value, is_called FROM blood_inventory_id_seq;`
    );

    // Check max IDs in tables
    const maxDonationId = await pool.query(
      `SELECT MAX(id) as max_id FROM donations;`
    );
    const maxUserId = await pool.query(`SELECT MAX(id) as max_id FROM users;`);
    const maxBloodRequestId = await pool.query(
      `SELECT MAX(id) as max_id FROM blood_requests;`
    );
    const maxBloodInventoryId = await pool.query(
      `SELECT MAX(id) as max_id FROM blood_inventory;`
    );

    // Check count of records
    const donationsCount = await pool.query(
      `SELECT COUNT(*) as count FROM donations;`
    );
    const usersCount = await pool.query(`SELECT COUNT(*) as count FROM users;`);
    const bloodRequestsCount = await pool.query(
      `SELECT COUNT(*) as count FROM blood_requests;`
    );
    const bloodInventoryCount = await pool.query(
      `SELECT COUNT(*) as count FROM blood_inventory;`
    );

    res.status(200).json({
      success: true,
      sequences: {
        donations: donationsSeq.rows[0],
        users: usersSeq.rows[0],
        bloodRequests: bloodRequestsSeq.rows[0],
        bloodInventory: bloodInventorySeq.rows[0],
      },
      maxIds: {
        donations: maxDonationId.rows[0],
        users: maxUserId.rows[0],
        bloodRequests: maxBloodRequestId.rows[0],
        bloodInventory: maxBloodInventoryId.rows[0],
      },
      counts: {
        donations: donationsCount.rows[0],
        users: usersCount.rows[0],
        bloodRequests: bloodRequestsCount.rows[0],
        bloodInventory: bloodInventoryCount.rows[0],
      },
    });
  } catch (error) {
    console.error("Check sequences failed:", error);
    res.status(500).json({
      success: false,
      error: error.message,
      code: error.code,
    });
  }
};
