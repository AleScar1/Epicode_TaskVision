import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import passport from 'passport';

import authRoutes from '../TaskVision/backend/routes/auth.js';
import userRoutes from '../TaskVision/backend/routes/users.js';

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

app.use('/auth', authRoutes);
app.use('/api', userRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
