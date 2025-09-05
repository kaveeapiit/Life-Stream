// Admin JWT Authentication Middleware
import jwt from "jsonwebtoken";

const adminAuth = (req, res, next) => {
  try {
    // Check for Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      // Fallback to session-based auth for backward compatibility
      if (req.session && req.session.admin) {
        req.admin = req.session.admin;
        return next();
      }

      return res.status(401).json({
        error: "Access denied. No valid token or session found.",
      });
    }

    // Extract JWT token
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify JWT token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "fallback-secret"
    );

    // Attach admin info to request
    req.admin = {
      id: decoded.adminId,
      username: decoded.username,
      email: decoded.email,
    };

    next();
  } catch (error) {
    console.error("Admin auth error:", error);

    // If JWT fails, try session fallback
    if (req.session && req.session.admin) {
      req.admin = req.session.admin;
      return next();
    }

    return res.status(401).json({
      error: "Invalid or expired token.",
    });
  }
};

export default adminAuth;
