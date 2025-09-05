import jwt from "jsonwebtoken";

export default function hybridHospitalAuth(req, res, next) {
  // Check for JWT token first (preferred method)
  const authHeader = req.headers.authorization;
  const token =
    authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.substring(7)
      : null;

  if (token) {
    try {
      // Verify JWT token
      const decoded = jwt.verify(
        token,
        process.env.SESSION_SECRET || "life-stream-secret-key"
      );

      // Set up session-like object for backward compatibility
      req.session = req.session || {};
      req.session.hospital = {
        id: decoded.hospitalId,
        username: decoded.username,
      };

      return next();
    } catch (error) {
      // JWT failed, fall back to session auth
      console.log(
        "JWT verification failed, trying session auth:",
        error.message
      );
    }
  }

  // Fall back to session-based authentication
  if (req.session && req.session.hospital) {
    return next();
  }

  // Neither JWT nor session auth worked
  return res.status(401).json({
    error: "Unauthorized: Hospital login required",
    hint: "Please login again. If this problem persists, clear your browser cache.",
  });
}
