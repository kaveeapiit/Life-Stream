import bcrypt from 'bcrypt';
import { getAdminByUsername } from '../models/adminModel.js';

export const loginAdmin = async (req, res) => {
  const { username, password } = req.body;

  try {
    const admin = await getAdminByUsername(username);
    if (!admin) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    res.status(200).json({ message: 'Login successful' });
  } catch (err) {
    console.error("Admin login error:", err.message);
    res.status(500).json({ message: 'Server error' });
  }
};
