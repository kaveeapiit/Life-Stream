import express from 'express';
import cors from 'cors';
import session from 'express-session';

// ✅ Route imports
import landingRoutes from './routes/landingRoutes.js';
import authRoutes from './routes/authRoutes.js';
import aboutRoutes from './routes/aboutRoutes.js';
import footerRoutes from './routes/footerRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import donationRoutes from './routes/donationRoutes.js';
import hospitalRoutes from './routes/hospitalRoutes.js';
import recipientRoutes from './routes/recipientRoutes.js';
import userRoutes from './routes/userRoutes.js';
import bloodRequestRoutes from './routes/bloodRequestRoutes.js';
import adminHospitalRoutes from './routes/adminHospitalRoutes.js';

const app = express();

// ✅ Enable CORS with credentials
app.use(cors({
  origin: 'http://localhost:5173', // Vite frontend
  credentials: true
}));

// ✅ Enable JSON parsing
app.use(express.json());

// ✅ Session Middleware (important: must come BEFORE routes)
app.use(session({
  secret: 'life-stream-secret-key', // Replace with strong secret in production
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,     // set to true if using HTTPS
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
}));

// ✅ Mount routes
app.use('/api/landing', landingRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/about', aboutRoutes);
app.use('/api/footer', footerRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/donation', donationRoutes);
app.use('/api/hospital', hospitalRoutes);
app.use('/api/recipient', recipientRoutes);
app.use('/api/user', userRoutes);
app.use('/api/blood', bloodRequestRoutes);
app.use('/api/admin/hospitals', adminHospitalRoutes);

// ✅ Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
