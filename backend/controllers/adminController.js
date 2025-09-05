import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getAdminByUsername } from "../models/adminModel.js";

export const loginAdmin = async (req, res) => {
  const { username, password } = req.body;

  try {
    const admin = await getAdminByUsername(username);
    if (!admin) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    // Create JWT token
    const token = jwt.sign(
      {
        adminId: admin.id,
        username: admin.username,
        email: admin.email,
      },
      process.env.JWT_SECRET || "fallback-secret",
      { expiresIn: "24h" }
    );

    // Store in session for backward compatibility
    req.session.admin = {
      id: admin.id,
      username: admin.username,
      email: admin.email,
    };

    res.status(200).json({
      message: "Login successful",
      token: token,
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
      },
    });
  } catch (err) {
    console.error("Admin login error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};
