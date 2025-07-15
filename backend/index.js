import express from 'express';
import cors from 'cors';
import landingRoutes from './routes/landingRoutes.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/landing', landingRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
