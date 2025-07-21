import express from 'express';
import cors from 'cors';

// ✅ API route imports
import landingRoutes from './routes/landingRoutes.js';
import authRoutes from './routes/authRoutes.js';
import aboutRoutes from './routes/aboutRoutes.js';
import footerRoutes from './routes/footerRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import donationRoutes from './routes/donationRoutes.js';
import hospitalRoutes from './routes/hospitalRoutes.js';
import recipientRoutes from './routes/recipientRoutes.js'; // ✅ NEW

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Register API Routes
app.use('/api/landing', landingRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/about', aboutRoutes);
app.use('/api/footer', footerRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/donation', donationRoutes);
app.use('/api/hospital', hospitalRoutes);
app.use('/api/recipient', recipientRoutes); // ✅ Added here

// ✅ Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
