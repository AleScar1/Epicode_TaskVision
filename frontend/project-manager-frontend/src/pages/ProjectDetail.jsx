import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

const ProjectDetail = () => {
  const { id } = useParams(); // ID progetto da URL
  const { token, user } = useContext(AuthContext);

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [isMember, setIsMember] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await axios.get(`/api/projects/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProject(res.data);

        // Verifica se l’utente è membro
        const found = res.data.members.some(
          (m) => m.userId === user.id || m.userId._id === user.id
        );
        setIsMember(found);
      } catch (err) {
        console.error('Errore nel recuperare il progetto:', err);
      }
    };

    const fetchTasks = () => {
      // Cambia qui con il codice fetch per un controllo più chiaro sugli errori
      fetch(`/api/projects/${id}/tasks`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error('Task non trovato');
          }
          return res.json();
        })
        .then((data) => {
          setTasks(data);
        })
        .catch((error) => {
          console.error('Errore nel recuperare i task:', error);
          // Aggiungi un messaggio di errore visibile all'utente
          alert('Impossibile caricare i task del progetto');
        });
    };

    fetchProject();
    fetchTasks();
  }, [id, token]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/tasks', {
        title: newTaskTitle,
        description: newTaskDesc,
        dueDate: newTaskDueDate,
        projectId: id
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setNewTaskTitle('');
      setNewTaskDesc('');
      setNewTaskDueDate('');

      // Ricarica i task
      const updatedTasks = await axios.get(`/api/projects/${id}/tasks`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(updatedTasks.data);
    } catch (err) {
      alert('Errore nella creazione del task');
    }
  };

  return (
    <>
      <Header />
      <main style={styles.main}>
        {project ? (
          <>
            <h2>{project.name}</h2>

            {project.imageUrl && (
              <img
                src={project.imageUrl}
                alt={project.name}
                style={{
                  width: '100%',
                  maxWidth: '500px',
                  height: 'auto',
                  borderRadius: '8px',
                  margin: '1rem 0',
                  objectFit: 'cover'
                }}
              />
            )}

            <p>{project.description}</p>

            <h3>Task del progetto</h3>
            {tasks.length === 0 ? (
              <p>Nessun task presente</p>
            ) : (
              <ul style={styles.taskList}>
                {tasks.map(task => (
                  <li key={task._id}>
                    <strong>{task.title}</strong> – {task.status}
                  </li>
                ))}
              </ul>
            )}

            {/* Form visibile solo se utente è membro */}
            {isMember && (
              <>
                <h4>Crea nuovo task</h4>
                <form onSubmit={handleCreateTask} style={styles.form}>
                  <input
                    type="text"
                    placeholder="Titolo"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    required
                    style={styles.input}
                  />
                  <textarea
                    placeholder="Descrizione"
                    value={newTaskDesc}
                    onChange={(e) => setNewTaskDesc(e.target.value)}
                    style={styles.textarea}
                  />
                  <input
                    type="date"
                    value={newTaskDueDate}
                    onChange={(e) => setNewTaskDueDate(e.target.value)}
                    style={styles.input}
                  />
                  <button type="submit" style={styles.button}>Crea Task</button>
                </form>
              </>
            )}
          </>
        ) : (
          <p>Caricamento progetto...</p>
        )}
      </main>
      <Footer />
    </>
  );
};

const styles = {
  main: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '3rem 2rem',
    textAlign: 'left',
    fontSize: '1.1rem'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    width: '100%',
    marginTop: '2rem'
  },
  input: {
    padding: '1rem',
    fontSize: '1.1rem',
    border: '1px solid #ccc',
    borderRadius: '5px'
  },
  textarea: {
    padding: '1rem',
    fontSize: '1.1rem',
    minHeight: '120px',
    border: '1px solid #ccc',
    borderRadius: '5px'
  },
  button: {
    padding: '1rem',
    fontSize: '1.1rem',
    backgroundColor: '#27ae60',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  taskList: {
    marginTop: '1rem',
    paddingLeft: '1.5rem',
    lineHeight: '1.8rem'
  }
};

export default ProjectDetail;