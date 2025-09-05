import pool from "../config/db.js";

// ✅ Insert new donation with status = 'Pending'
export const insertDonation = async ({
  userId,
  name,
  email,
  bloodType,
  location,
}) => {
  try {
    const query = `
      INSERT INTO donations (user_id, name, email, blood_type, location, status)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    
    const values = [
      userId || null,
      name,
      email,
      bloodType,
      location,
      "Pending",
    ];
    
    console.log('Executing donation insert query:', query);
    console.log('With values:', values);
    
    const result = await pool.query(query, values);
    
    console.log('Donation inserted successfully:', result.rows[0]);
    return result.rows[0];
  } catch (error) {
    console.error('Database error in insertDonation:');
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    console.error('Error detail:', error.detail);
    console.error('Error hint:', error.hint);
    console.error('Full error object:', error);
    throw new Error(`Database insertion failed: ${error.message} (Code: ${error.code})`);
  }
};

// ✅ Fetch all donations for a user by email
export const fetchDonationsByEmail = async (email) => {
  const query = `
    SELECT * FROM donations
    WHERE email = $1
    ORDER BY created_at DESC
  `;
  const result = await pool.query(query, [email]);
  return result.rows;
};

// ✅ Get all pending donations (for admin view)
export const getPendingDonations = async () => {
  const result = await pool.query(
    "SELECT * FROM donations WHERE status = $1 ORDER BY created_at DESC",
    ["Pending"]
  );
  return result.rows;
};

// ✅ Update donation status to Approved or Declined
export const updateDonationStatus = async (id, status) => {
  const result = await pool.query(
    "UPDATE donations SET status = $1 WHERE id = $2 RETURNING *",
    [status, id]
  );
  return result.rows[0];
};

// ✅ Get pending donations for a specific hospital based on username/location
export const getPendingDonationsForHospital = async (hospitalUsername) => {
  const query = `
    SELECT * FROM donations
    WHERE status = 'Pending' AND LOWER(location) LIKE LOWER($1)
    ORDER BY created_at DESC
  `;
  const keyword = `%${hospitalUsername}%`; // e.g., "Kandy" matches "Kandy General Hospital"
  const result = await pool.query(query, [keyword]);
  return result.rows;
};

// ✅ Get all donations for hospital management (both pending and historical)
export const getAllDonationsForHospital = async (hospitalUsername) => {
  const query = `
    SELECT * FROM donations
    WHERE LOWER(location) LIKE LOWER($1) OR location IS NULL OR location = ''
    ORDER BY 
      CASE 
        WHEN status = 'Pending' THEN 1
        WHEN status = 'Approved' THEN 2
        WHEN status = 'Declined' THEN 3
        ELSE 4
      END,
      created_at DESC
  `;
  const keyword = `%${hospitalUsername}%`;
  const result = await pool.query(query, [keyword]);
  return result.rows;
};

// ✅ Get donation history (approved/declined/collected donations)
export const getDonationHistoryForHospital = async (hospitalUsername) => {
  const query = `
    SELECT * FROM donations
    WHERE (LOWER(location) LIKE LOWER($1) OR location IS NULL OR location = '')
    AND status IN ('Approved', 'Declined', 'Collected')
    ORDER BY created_at DESC
  `;
  const keyword = `%${hospitalUsername}%`;
  const result = await pool.query(query, [keyword]);
  return result.rows;
};

// ✅ ADMIN: Get all donations for admin management
export const getAllDonationsForAdmin = async () => {
  const query = `
    SELECT * FROM donations
    ORDER BY 
      CASE 
        WHEN status = 'Pending' THEN 1
        WHEN status = 'Approved' THEN 2
        WHEN status = 'Declined' THEN 3
        ELSE 4
      END,
      created_at DESC
  `;
  const result = await pool.query(query);
  return result.rows;
};

// ✅ ADMIN: Get donation history (approved/declined/collected donations)
export const getDonationHistoryForAdmin = async () => {
  const query = `
    SELECT * FROM donations
    WHERE status IN ('Approved', 'Declined', 'Collected')
    ORDER BY created_at DESC
  `;
  const result = await pool.query(query);
  return result.rows;
};

// Auto-convert approved donation to blood inventory
export const autoConvertToInventory = async (
  donationId,
  hospitalId,
  expiryDate
) => {
  try {
    await pool.query("BEGIN");

    // Get donation details
    const donationResult = await pool.query(
      "SELECT * FROM donations WHERE id = $1 AND status = $2",
      [donationId, "Approved"]
    );

    if (donationResult.rows.length === 0) {
      await pool.query("ROLLBACK");
      return { success: false, error: "Approved donation not found" };
    }

    const donation = donationResult.rows[0];

    // Create blood unit in inventory
    const inventoryResult = await pool.query(
      `INSERT INTO blood_inventory (donation_id, blood_type, donor_name, donor_email, hospital_id, expiry_date, status, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW()) RETURNING *`,
      [
        donation.id,
        donation.blood_type,
        donation.name,
        donation.email,
        hospitalId,
        expiryDate,
        "Available",
      ]
    );

    // Update donation status to 'Collected'
    await pool.query(
      "UPDATE donations SET status = $1, updated_at = NOW() WHERE id = $2",
      ["Collected", donationId]
    );

    await pool.query("COMMIT");

    return {
      success: true,
      message: "Donation successfully converted to inventory",
      bloodUnit: inventoryResult.rows[0],
      donation: donation,
    };
  } catch (error) {
    await pool.query("ROLLBACK");
    console.error("Error in autoConvertToInventory:", error);
    return { success: false, error: "Database error during conversion" };
  }
};
