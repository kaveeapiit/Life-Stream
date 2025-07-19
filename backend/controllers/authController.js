import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createUser, findUserByEmail } from '../models/AuthModel.js';

export const register = async (req, res) => {
  const { name, email, password } = req.body; // ✅ Removed role
  try {
    const hashed = await bcrypt.hash(password, 10);
    const user = await createUser(name, email, hashed); // ✅ No role passed
    res.status(201).json({ message: 'Registration successful', user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await findUserByEmail(email);
    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ id: user.id }, 'secretkey'); // ✅ Removed role from token
      res.json({ user, token });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
