import bcrypt from 'bcryptjs';
import { findHospitalByUsername } from '../models/HospitalModel.js';

export const hospitalLogin = async (req, res) => {
  const { username, password } = req.body;
  try {
    const hospital = await findHospitalByUsername(username);
    if (!hospital) return res.status(401).json({ error: 'Invalid credentials' });

    const match = await bcrypt.compare(password, hospital.password);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });

    res.status(200).json({ message: 'Login successful', redirect: '/hospital/dashboard' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
