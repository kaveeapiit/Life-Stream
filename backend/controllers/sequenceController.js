import pool from "../config/db.js";

// Fix sequence issues for donations and users tables
export const fixSequences = async (req, res) => {
  try {
    console.log('Fixing database sequences...');
    
    // Fix donations table sequence
    const donationsSeqFix = await pool.query(`
      SELECT setval('donations_id_seq', COALESCE((SELECT MAX(id) FROM donations), 0) + 1, false);
    `);
    console.log('Donations sequence fixed:', donationsSeqFix.rows[0]);
    
    // Fix users table sequence  
    const usersSeqFix = await pool.query(`
      SELECT setval('users_id_seq', COALESCE((SELECT MAX(id) FROM users), 0) + 1, false);
    `);
    console.log('Users sequence fixed:', usersSeqFix.rows[0]);
    
    // Test next values
    const donationsNextVal = await pool.query(`SELECT nextval('donations_id_seq') as next_donation_id;`);
    const usersNextVal = await pool.query(`SELECT nextval('users_id_seq') as next_user_id;`);
    
    res.status(200).json({
      success: true,
      message: 'Database sequences fixed successfully',
      donationsSequence: donationsSeqFix.rows[0],
      usersSequence: usersSeqFix.rows[0],
      nextDonationId: donationsNextVal.rows[0],
      nextUserId: usersNextVal.rows[0]
    });
    
  } catch (error) {
    console.error('Fix sequences failed:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      code: error.code,
      detail: error.detail
    });
  }
};

// Check current sequence values
export const checkSequences = async (req, res) => {
  try {
    console.log('Checking database sequences...');
    
    // Check current sequence values
    const donationsSeq = await pool.query(`SELECT last_value, is_called FROM donations_id_seq;`);
    const usersSeq = await pool.query(`SELECT last_value, is_called FROM users_id_seq;`);
    
    // Check max IDs in tables
    const maxDonationId = await pool.query(`SELECT MAX(id) as max_id FROM donations;`);
    const maxUserId = await pool.query(`SELECT MAX(id) as max_id FROM users;`);
    
    // Check count of records
    const donationsCount = await pool.query(`SELECT COUNT(*) as count FROM donations;`);
    const usersCount = await pool.query(`SELECT COUNT(*) as count FROM users;`);
    
    res.status(200).json({
      success: true,
      sequences: {
        donations: donationsSeq.rows[0],
        users: usersSeq.rows[0]
      },
      maxIds: {
        donations: maxDonationId.rows[0],
        users: maxUserId.rows[0]
      },
      counts: {
        donations: donationsCount.rows[0],
        users: usersCount.rows[0]
      }
    });
    
  } catch (error) {
    console.error('Check sequences failed:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      code: error.code
    });
  }
};
