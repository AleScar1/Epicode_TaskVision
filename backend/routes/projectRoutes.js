import express from 'express';
import authenticateUser from '../middleware/authMiddleware.js';
import checkProjectAdmin from '../middlewares/checkProjectAdmin.js';
import Project from '../models/Project.js';

const router = express.Router();

router.post('/projects', authenticateUser, checkProjectAdmin, async (req, res) => {
  const { name, description, members } = req.body;
  const userId = req.user.id;

  try {
    const newProject = new Project({
      name,
      description,
      members: [
        ...members,
        { userId, role: 'admin' },
      ],
      createdBy: userId,
    });

    await newProject.save();
    res.status(201).json({ message: 'Progetto creato con successo', project: newProject });
  } catch (error) {
    res.status(500).json({ message: 'Errore nel creare il progetto', error: error.message });
  }
});

export default router;
