import express from 'express';
import userModel from '../models/userModel.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', (req, res) => {
  return res.status(200).json({ message: "Hello World!!" });
});

router.get('/users', authMiddleware, async (req, res) => {
  const allUsers = await userModel.find();
  return res.status(200).json(allUsers);
});

export default router;
