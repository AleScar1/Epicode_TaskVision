import express from 'express';
import authenticateUser from '../middleware/authMiddleware.js';
import checkProjectAdmin from '../middlewares/checkProjectAdmin.js';
import Project from '../models/Project.js';

const router = express.Router();

/**
 * @route   POST /projects
 * @desc    Crea un nuovo progetto
 */
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

/**
 * @route   GET /projects
 * @desc    Elenca tutti i progetti in cui l'utente è membro
 */
router.get('/projects', authenticateUser, async (req, res) => {
  try {
    const projects = await Project.find({
      'members.userId': req.user.id,
    });

    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Errore nel recuperare i progetti', error: error.message });
  }
});

/**
 * @route   GET /projects/:id
 * @desc    Visualizza un progetto se l'utente è membro
 */
router.get('/projects/:id', authenticateUser, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Progetto non trovato' });
    }

    const isMember = project.members.some(
      (member) => member.userId.toString() === req.user.id
    );

    if (!isMember) {
      return res.status(403).json({ message: 'Accesso negato al progetto' });
    }

    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: 'Errore nel recuperare il progetto', error: error.message });
  }
});

/**
 * @route   PUT /projects/:id
 * @desc    Aggiorna un progetto (solo admin)
 */
router.put('/projects/:id', authenticateUser, checkProjectAdmin, async (req, res) => {
  const { name, description } = req.body;

  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Progetto non trovato' });
    }

    project.name = name || project.name;
    project.description = description || project.description;
    project.updatedAt = new Date();

    await project.save();
    res.status(200).json({ message: 'Progetto aggiornato con successo', project });
  } catch (error) {
    res.status(500).json({ message: 'Errore nell\'aggiornare il progetto', error: error.message });
  }
});

/**
 * @route   DELETE /projects/:id
 * @desc    Elimina un progetto (solo admin)
 */
router.delete('/projects/:id', authenticateUser, checkProjectAdmin, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Progetto non trovato' });
    }

    await project.remove();
    res.status(200).json({ message: 'Progetto eliminato con successo' });
  } catch (error) {
    res.status(500).json({ message: 'Errore nell\'eliminare il progetto', error: error.message });
  }
});

export default router;
