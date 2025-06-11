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
  console.log('Dati ricevuti per la creazione del task:', req.body);
  const userId = req.user.id;

  try {
    // Verifica che il progetto esista e che l'utente sia membro del progetto
    const project = await Project.findById(projectId);  // Rimuovi populate('tasks')

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
      status: status || 'todo', // Default status if not provided
      dueDate,
      assignedUsers,
      project: projectId, // Assicurati di associare il task al projectId
    });

    await newTask.save();
    res.status(201).json({ message: 'Task creato con successo', task: newTask });
  } catch (error) {
    console.error('Errore nella creazione del task:', error);
    res.status(500).json({ message: 'Errore nel creare il task', error: error.message });
  }
});


/*
 * @desc    Recupera tutti i task associati a un progetto
 * @access  Solo membri del progetto
*/
router.get('/projects/:projectId/tasks', authenticateUser, async (req, res) => {
  const { projectId } = req.params;  // Usa projectId come parametro
  const userId = req.user.id;

  try {
    const project = await Project.findById(projectId);  // Usa projectId, non id
    if (!project) {
      return res.status(404).json({ message: 'Progetto non trovato' });
    }

    const isMember = project.members.some((member) => member.userId.toString() === userId);
    if (!isMember) {
      return res.status(403).json({ message: 'Accesso negato ai task di questo progetto' });
    }

    const tasks = await Task.find({ project: projectId }); // Usa projectId per trovare i task
    res.status(200).json(tasks);
  } catch (error) {
    console.error('Errore nel recupero dei task:', error);
    res.status(500).json({ message: 'Errore nel recuperare i task', error: error.message });
  }
});

/*
 * @desc    Recupera un singolo task tramite ID
 * @access  Solo utenti autenticati
*/
router.get('/tasks/:taskId', authenticateUser, async (req, res) => {
  const { taskId } = req.params;  // taskId estratto dai parametri dell'URL
  try {
    const task = await Task.findById(taskId);  // Trova il task per ID
    if (!task) {
      return res.status(404).json({ message: 'Task non trovato' });
    }
    res.status(200).json(task);
  } catch (error) {
    console.error('Errore nel recuperare il task:', error);
    res.status(500).json({ message: 'Errore nel recuperare il task', error: error.message });
  }
});




/**   completare codice PUT
 * @desc    Aggiorna un task esistente
 * @access  Solo admin del progetto o utente assegnato al task
 */
// PUT /tasks/:id
router.put('/tasks/:id', authenticateUser, async (req, res) => {
  const { id } = req.params; // Prendi l'ID del task dal parametro
  const { title, description, status, assignedUsers } = req.body; // Dati da aggiornare
  const userId = req.user.id;

  try {
    // Trova il task da aggiornare
    const task = await Task.findById(id); // Trova il task usando l'ID

    if (!task) {
      return res.status(404).json({ message: 'Task non trovato' });
    }

    // Verifica se l'utente è admin del progetto o se è assegnato al task
    const project = await Project.findById(task.project).populate('members');

    const isAdmin = project.members.some((member) => member.userId.toString() === userId && member.role === 'admin');
    const isAssigned = task.assignedUsers.includes(userId);

    if (!isAdmin && !isAssigned) {
      return res.status(403).json({ message: 'Non sei autorizzato a modificare questo task' });
    }

    // Aggiorna i dati del task
    task.title = title || task.title;
    task.description = description || task.description;
    task.status = status || task.status;
    task.assignedUsers = assignedUsers || task.assignedUsers;

    task.updatedAt = new Date(); // Aggiungi una data di aggiornamento

    // Salva il task aggiornato
    await task.save();
    res.status(200).json({ message: 'Task aggiornato con successo', task });
  } catch (error) {
    console.error('Errore nell\'aggiornare il task:', error);
    res.status(500).json({ message: 'Errore nell\'aggiornare il task', error: error.message });
  }
});





/**
 * xompletare codice DELETE /tasks/:id
 * @desc    Elimina un task esistente
 * @access  Solo admin del progetto
 */
// DELETE /tasks/:id
router.delete('/tasks/:id', authenticateUser, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Task non trovato' });
    }

    // Verifica che l'utente sia admin del progetto
    const project = await Project.findById(id).populate('tasks');

    const isAdmin = project.members.some((member) => member.userId.toString() === userId && member.role === 'admin');

    if (!isAdmin) {
      return res.status(403).json({ message: 'Non sei autorizzato a eliminare questo task' });
    }

    await task.remove();
    res.status(200).json({ message: 'Task eliminato con successo' });
  } catch (error) {
    res.status(500).json({ message: 'Errore nell\'eliminare il task', error: error.message });
  }
});

/**/
 router.post('/tasks', authenticateUser, async (req, res) => {
  const { title, description, status, dueDate, assignedUsers, projectId } = req.body;
  console.log('Dati ricevuti per la creazione del task:', req.body);
  const userId = req.user.id;

  try {
    // Verifica che il progetto esista e che l'utente sia membro del progetto
    const project = await Project.findById(projectId);  // Rimuovi populate('tasks')

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
      status: status || 'todo', // Default status if not provided
      dueDate,
      assignedUsers,
      project: projectId, // Assicurati di associare il task al projectId
    });

    await newTask.save();
    res.status(201).json({ message: 'Task creato con successo', task: newTask });
  } catch (error) {
    console.error('Errore nella creazione del task:', error);
    res.status(500).json({ message: 'Errore nel creare il task', error: error.message });
  }
});



// Recupera tutti i task associati a un progetto
router.get('/projects/:projectId/tasks', authenticateUser, async (req, res) => {
  const { projectId } = req.params;  // Usa projectId come parametro
  const userId = req.user.id;

  try {
    const project = await Project.findById(projectId);  // Usa projectId, non id
    if (!project) {
      return res.status(404).json({ message: 'Progetto non trovato' });
    }

    const isMember = project.members.some((member) => member.userId.toString() === userId);
    if (!isMember) {
      return res.status(403).json({ message: 'Accesso negato ai task di questo progetto' });
    }

    const tasks = await Task.find({ project: projectId }); // Usa projectId per trovare i task
    res.status(200).json(tasks);
  } catch (error) {
    console.error('Errore nel recupero dei task:', error);
    res.status(500).json({ message: 'Errore nel recuperare i task', error: error.message });
  }
});



export default router;
