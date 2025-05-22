// implementa un middleware di autenticazione JWT
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import userModel from '../models/userModel.js';


dotenv.config();
const jwtSecretKey = process.env.JWT_SECRET_KEY;

const authMiddleware = async (req, res, next) => {
  try {
    const tokenBearer = req.headers.authorization;

    if (!tokenBearer) {
      return res.status(401).json({ message: 'Token richiesto!' });
    }

    // Estraggo il token dalla stringa "Bearer <token>"
    const token = tokenBearer.replace('Bearer ', '');

    // Verifico il token e ottengo i dati
    const decoded = jwt.verify(token, jwtSecretKey);

    // Cerco l'utente nel DB
    const user = await userModel.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'Utente non trovato!' });
    }

    // Aggiungo i dati utente alla richiesta per usarli dopo
    req.user = user;

    next(); // proseguo alla rotta successiva

  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: 'Token non valido o scaduto!' });
  }
};

export default authMiddleware;
