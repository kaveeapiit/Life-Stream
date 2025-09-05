import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createUser, findUserByEmail } from "../models/AuthModel.js";

// ✅ Register new user with bloodType
export const register = async (req, res) => {
  const { name, email, password, bloodType } = req.body;

  try {
    console.log('Registration attempt:', { name, email, bloodType });
    
    // Validate required fields
    if (!name || !email || !password || !bloodType) {
      console.error('Registration validation failed: Missing required fields');
      return res.status(400).json({
        error: "All fields are required: name, email, password, bloodType",
      });
    }

    // Check if user already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      console.error('Registration failed: User already exists with email:', email);
      return res.status(400).json({
        error: "User already exists with this email",
      });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await createUser(name, email, hashed, bloodType);
    
    console.log('User registered successfully:', user.email);
    res.status(201).json({ message: "Registration successful", user });
  } catch (err) {
    console.error("Registration error:", err);
    console.error("Full error:", err);
    res.status(400).json({ 
      error: err.message,
      details: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
};

// ✅ Login and return bloodType explicitly
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await findUserByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({ id: user.id }, "secretkey");
      // ✅ Send only the necessary user data
      res.json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          blood_type: user.blood_type, // ✅ Include bloodType in response
        },
      });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
