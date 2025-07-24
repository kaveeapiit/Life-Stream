import pool from '../config/db.js';
import bcrypt from 'bcrypt';

export const hospitalLogin = async (req, res) => {
  const { username, password } = req.body;

  try {
    // 🔍 Query the hospital by username
    const result = await pool.query(
      'SELECT * FROM hospital_users WHERE username = $1',
      [username]
    );

    const hospital = result.rows[0];
    if (!hospital) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // 🔐 Compare password
    const match = await bcrypt.compare(password, hospital.password);
    if (!match) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // ✅ Save hospital data in session
    req.session.hospital = {
      id: hospital.id,
      username: hospital.username,
      location: hospital.location // Optional if needed for filtering
    };

    // ✅ Successful login response
    res.status(200).json({ message: 'Login successful', redirect: '/hospital/dashboard' });

  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
};
