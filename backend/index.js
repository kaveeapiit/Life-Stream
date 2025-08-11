import express from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";

// Load env vars
dotenv.config();

const app = express();

// Trust proxy in prod so secure cookies work behind Railway's proxy
if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

// CORS – allow your Vercel frontend
app.use(
  cors({
    origin: "https://life-stream-flame.vercel.app",
    credentials: true,
  })
);

// JSON body parsing
app.use(express.json());

// Sessions
app.use(
  session({
    secret: process.env.SESSION_SECRET || "life-stream-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production", // HTTPS-only in prod
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

// --- Routes ---
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

app.use("/api/landing", landingRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/about", aboutRoutes);
app.use("/api/footer", footerRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/donation", donationRoutes);
app.use("/api/hospital", hospitalRoutes);
app.use("/api/recipient", recipientRoutes);
app.use("/api/user", userRoutes);
app.use("/api/blood", bloodRequestRoutes);
app.use("/api/admin/hospitals", adminHospitalRoutes);

// Simple healthcheck to test Railway URL quickly
app.get("/", (_req, res) => res.send("OK"));

// Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
