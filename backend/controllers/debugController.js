import pool from "../config/db.js";

// Test database connection and schema
export const testDatabase = async (req, res) => {
  try {
    console.log('Testing database connection...');
    
    // Test basic connection
    const connectionTest = await pool.query('SELECT NOW()');
    console.log('Database connection successful:', connectionTest.rows[0]);
    
    // Test users table
    const usersTableTest = await pool.query(`
      SELECT column_name, data_type, is_nullable, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      ORDER BY ordinal_position
    `);
    console.log('Users table schema:', usersTableTest.rows);
    
    // Test donations table
    const donationsTableTest = await pool.query(`
      SELECT column_name, data_type, is_nullable, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'donations' 
      ORDER BY ordinal_position
    `);
    console.log('Donations table schema:', donationsTableTest.rows);
    
    // Test table existence
    const tablesTest = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    console.log('Available tables:', tablesTest.rows);
    
    res.status(200).json({
      success: true,
      connection: connectionTest.rows[0],
      usersSchema: usersTableTest.rows,
      donationsSchema: donationsTableTest.rows,
      availableTables: tablesTest.rows,
      message: 'Database connection and schema test successful'
    });
    
  } catch (error) {
    console.error('Database test failed:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      code: error.code,
      detail: error.detail,
      hint: error.hint
    });
  }
};

// Test user creation without actual insertion
export const testUserValidation = async (req, res) => {
  const { name, email, password, bloodType } = req.body;
  
  try {
    console.log('Testing user validation with:', { name, email, bloodType });
    
    // Check if all required fields are provided
    if (!name || !email || !password || !bloodType) {
      return res.status(400).json({
        error: "Missing required fields",
        provided: { name: !!name, email: !!email, password: !!password, bloodType: !!bloodType }
      });
    }
    
    // Check if user already exists
    const existingUser = await pool.query('SELECT email FROM users WHERE email = $1', [email]);
    
    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        error: "User already exists with this email",
        email: email
      });
    }
    
    res.status(200).json({
      success: true,
      message: "User validation passed",
      data: { name, email, bloodType }
    });
    
  } catch (error) {
    console.error('User validation test failed:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      code: error.code
    });
  }
};
