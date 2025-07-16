import express from 'express';
import cors from 'cors';

import landingRoutes from './routes/landingRoutes.js';
import authRoutes from './routes/authRoutes.js';
import aboutRoutes from './routes/aboutRoutes.js';
import footerRoutes from './routes/footerRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import adminRoutes from './routes/adminRoutes.js'; // ✅ Added

const app = express();

app.use(cors());
app.use(express.json());

// ✅ API Routes
app.use('/api/landing', landingRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/about', aboutRoutes);
app.use('/api/footer', footerRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/admin', adminRoutes); // ✅ Register admin routes

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
