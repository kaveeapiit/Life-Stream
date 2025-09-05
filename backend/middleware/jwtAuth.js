import jwt from "jsonwebtoken";

export default function jwtAuth(req, res, next) {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    const token =
      authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.substring(7)
        : null;

    if (!token) {
      return res.status(401).json({ error: "Unauthorized: Token required" });
    }

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.SESSION_SECRET || "life-stream-secret-key"
    );

    // Add hospital info to request
    req.session = req.session || {};
    req.session.hospital = {
      id: decoded.hospitalId,
      username: decoded.username,
    };

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Unauthorized: Token expired" });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    } else {
      return res
        .status(401)
        .json({ error: "Unauthorized: Token verification failed" });
    }
  }
}
