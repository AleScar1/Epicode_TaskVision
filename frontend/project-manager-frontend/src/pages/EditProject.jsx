import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { AuthContext } from '../context/AuthContext';
import TaskModal from '../components/TaskModal';

const EditProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);

useEffect(() => {
  const fetchProject = async () => {
    try {
      const response = await fetch(`/api/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Errore nel recuperare il progetto');

      const project = await response.json();
      console.log("Progetto recuperato:", project);
      setName(project.name);
      setDescription(project.description);
      setImageUrl(project.imageUrl || '');
      setTasks(project.tasks); 
      setLoading(false);
    } catch (err) {
      console.error('Errore nel recuperare il progetto:', err);
    }
  };

  fetchProject();
}, [id, token]);



  const handleUpdateProject = async (e) => {
    e.preventDefault();
    const validImageUrl = imageUrl.trim() !== '' ? imageUrl.trim() : null;

    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          description,
          imageUrl: validImageUrl,
        }),
      });

      if (!response.ok) throw new Error('Errore nell\'aggiornamento del progetto');
      const updatedProject = await response.json();

      console.log('Progetto aggiornato:', updatedProject);
      navigate('/dashboard');
    } catch (err) {
      alert('Errore nell\'aggiornamento del progetto');
    }
  };

const handleEditTask = (taskId) => {
  console.log("Editing Task with ID:", taskId);
  setSelectedTaskId(taskId);
  setShowModal(true);
};

  return (
    <>
      <Header />
      <main style={styles.main}>
        <h2>Modifica Progetto</h2>
        {loading ? (
          <p>Caricamento dati...</p>
        ) : (
          <form onSubmit={handleUpdateProject} style={styles.form}>
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
            {imageUrl && <img src={imageUrl} alt="Anteprima" style={styles.preview} />}
            <button type="submit" style={styles.button}>Salva modifiche</button>
          </form>
        )}

        <h3>Task del Progetto</h3>
          <div>
            {tasks && tasks.length === 0 ? (
              <p>Nessun task disponibile.</p>
            ) : (
              <ul>
                {tasks?.map((task) => (
                  <li key={task._id}>
                    <strong>{task.title}</strong> – {task.status}
                    <button onClick={() => handleEditTask(task._id)} style={styles.button}>Modifica</button>
                  </li>
                ))}
              </ul>
            )}
          </div>

        {/* Modale per la modifica/eliminazione del task */}
        <TaskModal
          showModal={showModal}
          setShowModal={setShowModal}
          taskId={selectedTaskId}
          token={token}
          onTaskUpdated={() => {
            // Ricarica i task dopo modifica/eliminazione
            setTasks(tasks.filter((task) => task._id !== selectedTaskId));
            setShowModal(false);
          }}
        />
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
    gap: '1rem',
  },
  input: {
    padding: '0.8rem',
    fontSize: '1rem',
    border: '1px solid #ccc',
    borderRadius: '5px',
    marginBottom: '1rem',
  },
  textarea: {
    padding: '0.8rem',
    fontSize: '1rem',
    minHeight: '120px',
    border: '1px solid #ccc',
    borderRadius: '5px',
  },
  button: {
    padding: '1rem',
    fontSize: '1rem',
    backgroundColor: '#27ae60',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  preview: {
    maxWidth: '100%',
    height: 'auto',
    borderRadius: '5px',
    marginTop: '1rem',
  },
};

export default EditProject;