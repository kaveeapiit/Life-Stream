const bcrypt = require('bcrypt');
const dbModule = require('../models/db.js'); // ES module imported using require()
const db = dbModule.default; // 👈 Get the actual pool object

const createAdmin = async () => {
  const username = 'admin';
  const plainPassword = '1234';
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  await db.query(
    'INSERT INTO admins (username, password) VALUES ($1, $2) ON CONFLICT (username) DO UPDATE SET password = $2',
    [username, hashedPassword]
  );

  console.log('✅ Admin inserted with hashed password');
  process.exit();
};

createAdmin();
