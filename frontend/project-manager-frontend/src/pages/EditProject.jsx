import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { AuthContext } from '../context/AuthContext';

const EditProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await axios.get(`/api/projects/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const project = res.data;
        setName(project.name);
        setDescription(project.description);
        setImageUrl(project.imageUrl || '');
        setLoading(false);
      } catch (err) {
        console.error('Errore nel recuperare il progetto:', err);
      }
    };

    fetchProject();
  }, [id, token]);

  const handleUpdate = async (e) => {
  e.preventDefault();

  // Se imageUrl è vuoto, non inviarlo
  const validImageUrl = imageUrl.trim() !== '' ? imageUrl.trim() : null;

  try {
    const response = await axios.put(`/api/projects/${id}`, {
      name,
      description,
      imageUrl: validImageUrl, // Invia null se l'immagine è vuota
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('Progetto aggiornato:', response.data.project); // Debugging

    navigate('/dashboard');
  } catch (err) {
    alert('Errore nell\'aggiornamento del progetto');
  }
};

  return (
    <>
      <Header />
      <main style={styles.main}>
        <h2>Modifica Progetto</h2>
        {loading ? (
          <p>Caricamento dati...</p>
        ) : (
          <form onSubmit={handleUpdate} style={styles.form}>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Nome progetto"
              style={styles.input}
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descrizione"
              style={styles.textarea}
            />
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="URL immagine"
              style={styles.input}
            />
            {imageUrl && (
              <img src={imageUrl} alt="Anteprima" style={styles.preview} />
            )}
            <button type="submit" style={styles.button}>Salva modifiche</button>
          </form>
        )}
      </main>
      <Footer />
    </>
  );
};

const styles = {
  main: {
    maxWidth: '700px',
    margin: '3rem auto',
    padding: '2rem',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    textAlign: 'left',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  input: {
    padding: '0.8rem',
    fontSize: '1rem',
    border: '1px solid #ccc',
    borderRadius: '5px'
  },
  textarea: {
    padding: '0.8rem',
    fontSize: '1rem',
    minHeight: '120px',
    border: '1px solid #ccc',
    borderRadius: '5px'
  },
  button: {
    padding: '1rem',
    fontSize: '1rem',
    backgroundColor: '#27ae60',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  },
  preview: {
    maxWidth: '100%',
    height: 'auto',
    borderRadius: '5px',
    marginTop: '1rem'
  }
};

export default EditProject;