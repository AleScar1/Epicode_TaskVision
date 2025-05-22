// verifica permessi utenti su determinato progetto
import Project from '../models/projectSchema.js';

const checkProjectAdmin = async (req, res, next) => {
  const { id } = req.params;
  // ID dell'utente che sta effettuando la richiesta
  const userId = req.user.id; 

  try {
    // Trova il progetto con l'ID specificato
    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({ message: 'Progetto non trovato' });
    }

    // Controlla se l'utente è un membro del progetto
    const member = project.members.find((m) => m.userId.toString() === userId);

    if (!member) {
      return res.status(403).json({ message: 'Non sei membro di questo progetto' });
    }

    // Controlla se l'utente è un admin del progetto
    if (member.role === 'admin' || project.createdBy.toString() === userId) {
      return next();
    }

    // Se l'utente non è admin
    return res.status(403).json({ message: 'Non sei autorizzato a modificare questo progetto' });

  } catch (error) {
    return res.status(500).json({ message: 'Errore nel verificare i permessi', error: error.message });
  }
};

export default checkProjectAdmin;