import express from 'express';
import authenticateUser from '../middlewares/authMiddleware.js';
import Project from '../models/projectSchema.js';
import Task from '../models/taskModel.js';

const router = express.Router();

/**
 * @desc    Crea un nuovo task per un progetto specifico
 * @access  Solo utenti membri del progetto
 */
router.post('/tasks', authenticateUser, async (req, res) => {
  const { title, description, status, dueDate, assignedUsers, projectId } = req.body;
  const userId = req.user.id;

  try {
    // Verifica che il progetto esista e che l'utente sia membro
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Progetto non trovato' });
    }

    const isMember = project.members.some(
      (member) => member.userId.toString() === userId
    );

    if (!isMember) {
      return res.status(403).json({ message: 'Non sei autorizzato a creare task per questo progetto' });
    }

    const newTask = new Task({
      title,
      description,
      status,
      dueDate,
      assignedUsers,
      project: projectId,
    });

    await newTask.save();
    res.status(201).json({ message: 'Task creato con successo', task: newTask });
  } catch (error) {
    res.status(500).json({ message: 'Errore nel creare il task', error: error.message });
  }
});

/*
 * @desc    Recupera tutti i task associati a un progetto
 * @access  Solo membri del progetto
*/
router.get('/projects/:projectId/tasks', authenticateUser, async (req, res) => {
  const { projectId } = req.params;
  const userId = req.user.id;

  try {
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Progetto non trovato' });
    }

    const isMember = project.members.some(
      (member) => member.userId.toString() === userId
    );

    if (!isMember) {
      return res.status(403).json({ message: 'Accesso negato ai task di questo progetto' });
    }

    const tasks = await Task.find({ project: projectId });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Errore nel recuperare i task', error: error.message });
  }
});

/**   completare codice PUT
 * @desc    Aggiorna un task esistente
 * @access  Solo admin del progetto o utente assegnato al task
 */

/**
 * xompletare codice DELETE /tasks/:id
 * @desc    Elimina un task esistente
 * @access  Solo admin del progetto
 */


export default router;
