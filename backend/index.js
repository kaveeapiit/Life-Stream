import express from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// ✅ Route imports
import landingRoutes from "./routes/landingRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import aboutRoutes from "./routes/aboutRoutes.js";
import footerRoutes from "./routes/footerRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import donationRoutes from "./routes/donationRoutes.js";
import hospitalRoutes from "./routes/hospitalRoutes.js";
import recipientRoutes from "./routes/recipientRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import bloodRequestRoutes from "./routes/bloodRequestRoutes.js";
import adminHospitalRoutes from "./routes/adminHospitalRoutes.js";
import bloodInventoryRoutes from "./routes/bloodInventoryRoutes.js";
import hospitalBloodRequestRoutes from "./routes/hospitalBloodRequestRoutes.js";
import donorRequestMatchingRoutes from "./routes/donorRequestMatchingRoutes.js";
import hospitalToHospitalRoutes from "./routes/hospitalToHospitalRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import debugRoutes from "./routes/debugRoutes.js";

const app = express();

// ✅ Enable CORS with credentials
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      const allowedOrigins = [
        process.env.FRONTEND_URL || "http://localhost:5173",
        "http://localhost:5173",
        "http://localhost:3000",
        "https://localhost:5173",
        // Azure Static Web Apps URL
        "https://polite-coast-092204100.1.azurestaticapps.net",
      ];

      // Add Azure frontend URL if specified
      if (
        process.env.FRONTEND_URL &&
        process.env.FRONTEND_URL !== "http://localhost:5173"
      ) {
        allowedOrigins.push(process.env.FRONTEND_URL);
      }

      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        console.log("CORS blocked origin:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// ✅ Enable JSON parsing
app.use(express.json());

// ✅ Session Middleware (important: must come BEFORE routes)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "life-stream-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production", // Use HTTPS in production
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // Allow cross-site cookies in production
    },
  })
);

// ✅ Health check endpoint
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Life Stream backend is running." });
});

// ✅ Mount routes
app.use("/api/landing", landingRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/about", aboutRoutes);
app.use("/api/footer", footerRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/donation", donationRoutes);
app.use("/api/hospital", hospitalRoutes);
app.use("/api/hospital", bloodInventoryRoutes);
app.use("/api/hospital", hospitalBloodRequestRoutes);
app.use("/api/hospital", donorRequestMatchingRoutes);
app.use("/api/hospital", hospitalToHospitalRoutes);
app.use("/api/recipient", recipientRoutes);
app.use("/api/user", userRoutes);
app.use("/api/blood", bloodRequestRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/admin/hospitals", adminHospitalRoutes);
app.use("/api/debug", debugRoutes);

// ✅ Error handler
app.use((err, req, res, _next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

// ✅ Start server
const PORT = process.env.PORT || 5050; // Use environment variable for port
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// ✅ Log uncaught exceptions and rejections
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
});
