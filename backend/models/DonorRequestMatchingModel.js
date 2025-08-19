import db from "../config/db.js";

const DonorRequestMatchingModel = {
  // Get blood type compatibility mapping
  getBloodCompatibility: () => {
    return {
      "O-": ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"], // Universal donor
      "O+": ["O+", "A+", "B+", "AB+"],
      "A-": ["A-", "A+", "AB-", "AB+"],
      "A+": ["A+", "AB+"],
      "B-": ["B-", "B+", "AB-", "AB+"],
      "B+": ["B+", "AB+"],
      "AB-": ["AB-", "AB+"],
      "AB+": ["AB+"], // Universal recipient (can only donate to AB+)
    };
  },

  // Find compatible donors for a specific blood request
  findCompatibleDonors: async ({
    requestId,
    bloodType,
    urgency = false,
    limit = 50,
    offset = 0,
  }) => {
    const compatibility = DonorRequestMatchingModel.getBloodCompatibility();
    const compatibleTypes = [];

    // Find all donor blood types that can donate to the requested type
    for (const [donorType, canDonateTo] of Object.entries(compatibility)) {
      if (canDonateTo.includes(bloodType)) {
        compatibleTypes.push(donorType);
      }
    }

    if (compatibleTypes.length === 0) {
      return { donors: [], total: 0, compatibleTypes: [] };
    }

    // Create placeholder conditions for each compatible blood type
    const bloodTypePlaceholders = compatibleTypes
      .map((_, index) => `$${index + 1}`)
      .join(",");

    const sql = `
      SELECT u.*, 
        CASE 
          WHEN u.blood_type = $${
            compatibleTypes.length + 1
          } THEN 1  -- Exact match gets priority
          WHEN u.blood_type = 'O-' THEN 2                            -- Universal donor second priority
          ELSE 3                                                      -- Other compatible types
        END as match_priority,
        CASE 
          WHEN u.blood_type = $${compatibleTypes.length + 1} THEN 'Exact Match'
          WHEN u.blood_type = 'O-' THEN 'Universal Donor'
          ELSE 'Compatible'
        END as compatibility_type
      FROM users u 
      WHERE u.blood_type IN (${bloodTypePlaceholders})
        AND u.blood_type IS NOT NULL 
        AND u.blood_type != ''
      ORDER BY match_priority ASC, u.created_at DESC
      LIMIT $${compatibleTypes.length + 2} OFFSET $${compatibleTypes.length + 3}
    `;

    const params = [...compatibleTypes, bloodType, limit, offset];
    const { rows } = await db.query(sql, params);

    // Get total count
    const countSql = `
      SELECT COUNT(*) 
      FROM users u 
      WHERE u.blood_type IN (${bloodTypePlaceholders})
        AND u.blood_type IS NOT NULL 
        AND u.blood_type != ''
    `;
    const countParams = compatibleTypes;
    const { rows: countRows } = await db.query(countSql, countParams);

    return {
      donors: rows,
      total: Number(countRows[0].count),
      compatibleTypes,
      requestedBloodType: bloodType,
    };
  },

  // Get donors filtered by specific blood type with request matching context
  getDonorsByBloodTypeForRequests: async ({
    bloodType,
    search = "",
    page = 1,
    limit = 20,
  }) => {
    let whereConditions = ["u.blood_type IS NOT NULL", "u.blood_type != ''"];
    let params = [];
    let paramIndex = 1;

    // Filter by blood type if specified
    if (bloodType && bloodType !== "all") {
      whereConditions.push(`u.blood_type = $${paramIndex}`);
      params.push(bloodType);
      paramIndex++;
    }

    // Search by name or email
    if (search) {
      whereConditions.push(
        `(u.name ILIKE $${paramIndex} OR u.email ILIKE $${paramIndex})`
      );
      params.push(`%${search}%`);
      paramIndex++;
    }

    const whereClause = whereConditions.join(" AND ");
    const offset = (page - 1) * limit;

    // Get pending requests for the same blood type to show matching opportunities
    const requestsSubquery = `
      SELECT COUNT(*) as pending_requests
      FROM blood_requests br 
      WHERE br.blood_type = u.blood_type 
        AND br.status = 'pending'
    `;

    const sql = `
      SELECT u.*, 
        (${requestsSubquery}) as matching_requests,
        CASE 
          WHEN u.blood_type = 'O-' THEN 'Universal Donor'
          WHEN u.blood_type = 'AB+' THEN 'Universal Recipient'
          ELSE 'Standard Donor'
        END as donor_category
      FROM users u 
      WHERE ${whereClause}
      ORDER BY u.created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    params.push(limit, offset);
    const { rows } = await db.query(sql, params);

    // Get total count for pagination
    const countSql = `SELECT COUNT(*) FROM users u WHERE ${whereClause}`;
    const countParams = params.slice(0, -2); // Remove limit and offset
    const { rows: countRows } = await db.query(countSql, countParams);

    return {
      donors: rows,
      total: Number(countRows[0].count),
      page,
      totalPages: Math.ceil(Number(countRows[0].count) / limit),
    };
  },

  // Get donor-request matching summary for dashboard
  getDonorRequestMatchingSummary: async () => {
    const sql = `
      SELECT 
        br.blood_type,
        COUNT(br.id) as pending_requests,
        (
          SELECT COUNT(u.id) 
          FROM users u 
          WHERE u.blood_type = br.blood_type 
            AND u.blood_type IS NOT NULL 
            AND u.blood_type != ''
        ) as available_donors,
        CASE 
          WHEN br.urgency = true THEN 'urgent'
          ELSE 'normal'
        END as urgency_level
      FROM blood_requests br 
      WHERE br.status = 'pending'
      GROUP BY br.blood_type, br.urgency
      ORDER BY 
        CASE WHEN br.urgency = true THEN 1 ELSE 2 END,
        pending_requests DESC
    `;

    const { rows } = await db.query(sql);
    return rows;
  },

  // Get detailed matching analysis for a specific blood type
  getBloodTypeMatchingAnalysis: async (bloodType) => {
    const compatibility = DonorRequestMatchingModel.getBloodCompatibility();

    // Find who can donate to this blood type
    const compatibleDonorTypes = [];
    for (const [donorType, canDonateTo] of Object.entries(compatibility)) {
      if (canDonateTo.includes(bloodType)) {
        compatibleDonorTypes.push(donorType);
      }
    }

    // Find who this blood type can donate to
    const canDonateToTypes = compatibility[bloodType] || [];

    const analysis = {
      requestedBloodType: bloodType,
      compatibleDonorTypes,
      canDonateToTypes,
      donorCounts: {},
      requestCounts: {},
    };

    // Get donor counts for each compatible type
    for (const donorType of compatibleDonorTypes) {
      const donorCountQuery = `
        SELECT COUNT(*) as count 
        FROM users 
        WHERE blood_type = $1 
          AND blood_type IS NOT NULL 
          AND blood_type != ''
      `;
      const { rows } = await db.query(donorCountQuery, [donorType]);
      analysis.donorCounts[donorType] = Number(rows[0].count);
    }

    // Get request counts for types this blood type can donate to
    for (const recipientType of canDonateToTypes) {
      const requestCountQuery = `
        SELECT COUNT(*) as count 
        FROM blood_requests 
        WHERE blood_type = $1 AND status = 'pending'
      `;
      const { rows } = await db.query(requestCountQuery, [recipientType]);
      analysis.requestCounts[recipientType] = Number(rows[0].count);
    }

    return analysis;
  },

  // Find compatible donors filtered by hospital location
  findCompatibleDonorsByLocation: async ({
    bloodType,
    hospitalLocation,
    limit = 50,
    offset = 0,
  }) => {
    const compatibility = DonorRequestMatchingModel.getBloodCompatibility();
    const compatibleTypes = [];

    // Find all donor blood types that can donate to the requested type
    for (const [donorType, canDonateTo] of Object.entries(compatibility)) {
      if (canDonateTo.includes(bloodType)) {
        compatibleTypes.push(donorType);
      }
    }

    if (compatibleTypes.length === 0) {
      return { donors: [], total: 0, compatibleTypes: [] };
    }

    // Create placeholder conditions for each compatible blood type
    const bloodTypePlaceholders = compatibleTypes
      .map((_, index) => `$${index + 1}`)
      .join(",");

    const sql = `
      SELECT u.*, 
        CASE 
          WHEN u.blood_type = $${
            compatibleTypes.length + 1
          } THEN 1  -- Exact match gets priority
          WHEN u.blood_type = 'O-' THEN 2                            -- Universal donor second priority
          ELSE 3                                                      -- Other compatible types
        END as match_priority,
        CASE 
          WHEN u.blood_type = $${compatibleTypes.length + 1} THEN 'Exact Match'
          WHEN u.blood_type = 'O-' THEN 'Universal Donor'
          ELSE 'Compatible'
        END as compatibility_type,
        d.location as donor_location
      FROM users u 
      LEFT JOIN donations d ON u.email = d.email AND d.status = 'Pending'
      WHERE u.blood_type IN (${bloodTypePlaceholders})
        AND u.blood_type IS NOT NULL 
        AND u.blood_type != ''
        AND (d.location IS NULL OR LOWER(d.location) LIKE LOWER($${
          compatibleTypes.length + 2
        }))
      ORDER BY 
        (CASE WHEN d.location IS NOT NULL AND LOWER(d.location) LIKE LOWER($${
          compatibleTypes.length + 2
        }) THEN 0 ELSE 1 END),
        match_priority ASC, 
        u.created_at DESC
      LIMIT $${compatibleTypes.length + 3} OFFSET $${compatibleTypes.length + 4}
    `;

    const params = [
      ...compatibleTypes,
      bloodType,
      `%${hospitalLocation}%`, // Use LIKE pattern to match hospital location
      limit,
      offset,
    ];
    const { rows } = await db.query(sql, params);

    // Get total count with location filter
    const countSql = `
      SELECT COUNT(DISTINCT u.id) 
      FROM users u 
      LEFT JOIN donations d ON u.email = d.email AND d.status = 'Pending'
      WHERE u.blood_type IN (${bloodTypePlaceholders})
        AND u.blood_type IS NOT NULL 
        AND u.blood_type != ''
        AND (d.location IS NULL OR LOWER(d.location) LIKE LOWER($${
          compatibleTypes.length + 1
        }))
    `;
    const countParams = [...compatibleTypes, `%${hospitalLocation}%`];
    const { rows: countRows } = await db.query(countSql, countParams);

    return {
      donors: rows,
      total: Number(countRows[0].count),
      compatibleTypes,
      requestedBloodType: bloodType,
      filteredByLocation: hospitalLocation,
    };
  },

  // Get donors filtered by location and blood type
  getDonorsByLocationAndBloodType: async ({
    hospitalLocation,
    bloodType,
    search = "",
    page = 1,
    limit = 20,
  }) => {
    let whereConditions = ["u.blood_type IS NOT NULL", "u.blood_type != ''"];
    let params = [];
    let paramIndex = 1;

    // Filter by location - check both user donations and user profile
    if (hospitalLocation) {
      whereConditions.push(`(
        EXISTS (
          SELECT 1 FROM donations d 
          WHERE d.email = u.email 
            AND d.status = 'Pending' 
            AND LOWER(d.location) LIKE LOWER($${paramIndex})
        )
      )`);
      params.push(`%${hospitalLocation}%`); // Use LIKE pattern for location matching
      paramIndex++;
    }

    // Filter by blood type if specified
    if (bloodType && bloodType !== "all") {
      whereConditions.push(`u.blood_type = $${paramIndex}`);
      params.push(bloodType);
      paramIndex++;
    }

    // Search by name or email
    if (search) {
      whereConditions.push(
        `(u.name ILIKE $${paramIndex} OR u.email ILIKE $${paramIndex})`
      );
      params.push(`%${search}%`);
      paramIndex++;
    }

    const whereClause = whereConditions.join(" AND ");
    const offset = (page - 1) * limit;

    const sql = `
      SELECT DISTINCT u.*, 
        d.location as donor_location,
        d.created_at as donation_date
      FROM users u 
      LEFT JOIN donations d ON u.email = d.email AND d.status = 'Pending'
      WHERE ${whereClause}
      ORDER BY u.created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    params.push(limit, offset);
    const { rows } = await db.query(sql, params);

    // Get total count
    const countSql = `
      SELECT COUNT(DISTINCT u.id) 
      FROM users u 
      LEFT JOIN donations d ON u.email = d.email AND d.status = 'Pending'
      WHERE ${whereClause}
    `;
    const countParams = params.slice(0, -2); // Remove limit and offset
    const { rows: countRows } = await db.query(countSql, countParams);

    return {
      donors: rows,
      total: Number(countRows[0].count),
      page,
      limit,
      totalPages: Math.ceil(Number(countRows[0].count) / limit),
      filteredByLocation: hospitalLocation,
    };
  },
};

export default DonorRequestMatchingModel;
