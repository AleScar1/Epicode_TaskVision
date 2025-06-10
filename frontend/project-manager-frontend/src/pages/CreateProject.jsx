import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';

const CreateProject = () => {
  const { token, user } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState('');
  const [imageUrlError, setImageUrlError] = useState('');

  const handleImageUrlChange = (e) => {
    let url = e.target.value.trim();

    if (url.includes('placeh') && !url.startsWith('http')) {
      url = 'https://' + url;
    }

    setImageUrl(url);

    const isValidUrl = /^data:image\/[a-z]+;base64,|^https?:\/\/.+$/i.test(url);
    if (url === '' || isValidUrl) {
      setImageUrlError('');
    } else {
      setImageUrlError('⚠️ URL non valido');
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('/api/projects', {
        name,
        description,
        imageUrl,
        members: [],
      }, {
        headers: {
          Authorization: 'Bearer ' + token
        }
      });

      navigate('/dashboard');
    } catch (err) {
      alert('Errore nella creazione del progetto');
    }
  };



  return (
    <>
      <Header />
      <main style={styles.main}>
        <h2>Crea un nuovo progetto</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            placeholder="Nome del progetto"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={styles.input}
          />
          <textarea
            placeholder="Descrizione (opzionale)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={styles.textarea}
          />
          <input
            type="text"
            placeholder="URL immagine (opzionale)"
            value={imageUrl}
            onChange={handleImageUrlChange}
            style={styles.input}
          />
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Anteprima"
              style={{ maxWidth: '100%', height: 'auto', marginTop: '1rem', borderRadius: '8px' }}
            />
          )}
          {imageUrlError && (
            <div style={{ color: 'orange', fontSize: '0.9rem', marginTop: '4px' }}>
              {imageUrlError}
            </div>
          )}
          <button type="submit" style={styles.button}>Crea progetto</button>
        </form>
      </main>
      <Footer />
    </>
  );
};

const styles = {
  main: {
    padding: '2rem',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    maxWidth: '400px',
    margin: '0 auto',
  },
  input: {
    padding: '0.75rem',
    fontSize: '1rem',
  },
  textarea: {
    padding: '0.75rem',
    fontSize: '1rem',
    minHeight: '100px',
  },
  button: {
    padding: '0.75rem',
    backgroundColor: '#27ae60',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
  },
};

export default CreateProject;