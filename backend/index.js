import express from 'express';
import cors from 'cors';

import landingRoutes from './routes/landingRoutes.js';
import authRoutes from './routes/authRoutes.js';
import aboutRoutes from './routes/aboutRoutes.js';
import footerRoutes from './routes/footerRoutes.js'; // ✅ Import footer routes

const app = express();

app.use(cors());
app.use(express.json());

// ✅ Route middleware
app.use('/api/landing', landingRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/about', aboutRoutes);
app.use('/api/footer', footerRoutes); // ✅ Add footer route

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
