import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import userModel from '../models/userModel.js';

dotenv.config();
const router = express.Router();
const jwtSecretKey = process.env.JWT_SECRET_KEY;
const saltRounds = 10;

router.post('/register', async (req, res) => {
  try {
    const { fullname, username, email, password, isAdmin } = req.body;

    const existingUser = await userModel.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email già registrata' });

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = new userModel({ fullname, username, email, password: hashedPassword, isAdmin });
    await newUser.save();

    res.status(201).json({ message: 'Registrazione completata' });
  } catch (error) {
    res.status(500).json({ message: 'Errore server', error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Email o password errati' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Email o password errati' });

    const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, jwtSecretKey, { expiresIn: '1h' });

    res.json({
      token,
      user: {
        id: user._id,
        fullname: user.fullname,
        email: user.email,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Errore server', error: error.message });
  }
});


export default router;