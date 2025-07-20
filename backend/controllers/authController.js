import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createUser, findUserByEmail } from '../models/AuthModel.js';

// ✅ Register new user with bloodType
export const register = async (req, res) => {
  const { name, email, password, bloodType } = req.body;
  try {
    const hashed = await bcrypt.hash(password, 10);
    const user = await createUser(name, email, hashed, bloodType);
    res.status(201).json({ message: 'Registration successful', user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ✅ Login and return bloodType explicitly
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await findUserByEmail(email);
    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ id: user.id }, 'secretkey');
      // ✅ Send only the necessary user data
      res.json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          blood_type: user.blood_type // ✅ Include bloodType in response
        }
      });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
