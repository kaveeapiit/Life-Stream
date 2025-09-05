// Debug routes for troubleshooting authentication issues
import express from "express";

const router = express.Router();

// Debug endpoint to check environment variables (non-sensitive only)
router.get("/env", (req, res) => {
  res.json({
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    DB_HOST: process.env.DB_HOST ? "SET" : "NOT_SET",
    DB_USER: process.env.DB_USER ? "SET" : "NOT_SET",
    DB_NAME: process.env.DB_NAME ? "SET" : "NOT_SET",
    DB_PASSWORD: process.env.DB_PASSWORD ? "SET" : "NOT_SET",
    DB_PORT: process.env.DB_PORT,
    SESSION_SECRET: process.env.SESSION_SECRET ? "SET" : "NOT_SET",
    FRONTEND_URL: process.env.FRONTEND_URL,
  });
});

// Debug endpoint to check session status
router.get("/session", (req, res) => {
  res.json({
    hasSession: !!req.session,
    sessionId: req.sessionID,
    hospital: req.session?.hospital || null,
    cookie: req.session?.cookie || null,
  });
});

// Debug endpoint to test database connection
router.get("/db", async (req, res) => {
  try {
    const { default: pool } = await import("../config/db.js");
    const result = await pool.query(
      "SELECT NOW() as current_time, version() as db_version"
    );
    res.json({
      status: "connected",
      time: result.rows[0].current_time,
      version: result.rows[0].db_version,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

// Test hospital authentication
router.get("/hospital-auth", (req, res) => {
  const isAuthenticated = !!(req.session && req.session.hospital);
  res.json({
    authenticated: isAuthenticated,
    hospital: req.session?.hospital || null,
    sessionExists: !!req.session,
    sessionId: req.sessionID,
  });
});

export default router;
