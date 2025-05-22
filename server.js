import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import passport from 'passport';

import authRoutes from './backend/routes/auth.js';
import projectRoutes from './backend/routes/projectRoutes.js';
import taskRoutes from './backend/routes/tasks.js';
import userRoutes from './backend/routes/users.js';  


dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

app.use('/auth', authRoutes);
app.use('/api', userRoutes);
app.use('/api', taskRoutes);
app.use('/api/projects', projectRoutes); 

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

