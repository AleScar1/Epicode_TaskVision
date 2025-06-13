import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import TaskModal from '../components/TaskModal';

const ProjectDetail = () => {
  const { id } = useParams(); // ID progetto da URL
  const { token, user } = useContext(AuthContext);

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [isMember, setIsMember] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  // Recupero i dettagli del progetto e dei task
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
          alert('Impossibile caricare i task del progetto');
        });
    };

    fetchProject();
    fetchTasks();
  }, [id, token, user.id]);

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
      setShowCreateModal(false); // Chiudi la modale dopo aver creato il task
    } catch (err) {
      alert('Errore nella creazione del task');
    }
  };

  const filterTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status);
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

            {/* Layout a griglia per i task */}
            <div style={styles.grid}>
              {/* Colonna: Da Completare */}
              <div style={{ ...styles.column, backgroundColor: 'rgb(253, 242, 176)' }}>
                <h4>Da Completare</h4>
                {filterTasksByStatus('todo').map((task) => (
                  <div key={task._id} style={styles.card}>
                    <h5>{task.title}</h5>
                    <p>{task.description}</p>
                    <button
                      onClick={() => {
                        setSelectedTaskId(task._id); // Setta l'ID del task selezionato
                        setShowModal(true); // Mostra la modale per modificare il task
                      }}
                      style={styles.button}
                    >
                      Modifica
                    </button>
                  </div>
                ))}
              </div>

              {/* Colonna: In Corso */}
              <div style={{ ...styles.column, backgroundColor: 'rgb(248, 184, 76)' }}>
                <h4>In Corso</h4>
                {filterTasksByStatus('in progress').map((task) => (
                  <div key={task._id} style={styles.card}>
                    <h5>{task.title}</h5>
                    <p>{task.description}</p>
                    <button
                      onClick={() => {
                        setSelectedTaskId(task._id); // Setta l'ID del task selezionato
                        setShowModal(true); // Mostra la modale per modificare il task
                      }}
                      style={styles.button}
                    >
                      Modifica
                    </button>
                  </div>
                ))}
              </div>

              {/* Colonna: Completati */}
              <div style={{ ...styles.column, backgroundColor: '#2ecc71' }}>
                <h4>Completati</h4>
                {filterTasksByStatus('done').map((task) => (
                  <div key={task._id} style={styles.card}>
                    <h5>{task.title}</h5>
                    <p>{task.description}</p>
                    <button
                      onClick={() => {
                        setSelectedTaskId(task._id); // Setta l'ID del task selezionato
                        setShowModal(true); // Mostra la modale per modificare il task
                      }}
                      style={styles.button}
                    >
                      Modifica
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Form visibile solo se utente è membro */}
            {isMember && (
              <>
                <button
                  onClick={() => setShowCreateModal(true)} // Mostra la modale per creare il task
                  style={styles.createButton}
                >
                  Crea nuovo task
                </button>
              </>
            )}
          </>
        ) : (
          <p>Caricamento progetto...</p>
        )}
      </main>
      <Footer />

      {/* Modale per la modifica del task */}
      <TaskModal
        showModal={showModal}
        setShowModal={setShowModal}
        taskId={selectedTaskId}
        token={token}
        onTaskUpdated={() => {
          // Ricarica i task dopo la modifica
          fetch(`/api/projects/${id}/tasks`, {
            headers: { Authorization: `Bearer ${token}` }
          })
            .then((res) => res.json())
            .then((data) => setTasks(data));
        }}
      />

      {/* Modale per creare un nuovo task */}
      {showCreateModal && (
        <div style={styles.modal}>
          <h3>Crea un nuovo Task</h3>
          <form onSubmit={handleCreateTask}>
            <input
              type="text"
              placeholder="Titolo del Task"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              style={styles.input}
              required
            />
            <textarea
              placeholder="Descrizione"
              value={newTaskDesc}
              onChange={(e) => setNewTaskDesc(e.target.value)}
              style={styles.textarea}
              required
            />
            <input
              type="date"
              value={newTaskDueDate}
              onChange={(e) => setNewTaskDueDate(e.target.value)}
              style={styles.input}
              required
            />
            <button type="submit" style={styles.button}>Crea Task</button>
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              style={styles.button}
            >
              Annulla
            </button>
          </form>
        </div>
      )}
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
  createButton: {
    padding: '1rem',
    fontSize: '1.1rem',
    backgroundColor: '#2980b9',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
    marginTop: '1rem'
  },
  taskList: {
    marginTop: '1rem',
    paddingLeft: '1.5rem',
    lineHeight: '1.8rem'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: '20px',
    marginTop: '20px'
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    padding: '10px',
    borderRadius: '8px',
    minHeight: '300px'
  },
  card: {
    backgroundColor: '#ffffff',
    padding: '1rem',
    borderRadius: '8px',
    boxShadow: '0 0 5px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.3s ease',
    cursor: 'pointer',
  },
  cardHovered: {
    transform: 'scale(1.05)'
  },
  modal: {
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 1000,
    maxWidth: '600px',
    width: '100%',
  },
  createModal: {
    backgroundColor: '#fff',
    padding: '3rem',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 1000,
    maxWidth: '700px',
    width: '80%',
    animation: 'fadeIn 0.5s ease-in-out',
  },
  modalTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',  // Maggiore spaziatura tra i campi
  },
  input: {
    padding: '1rem',
    fontSize: '1rem',
    border: '1px solid #ccc',
    borderRadius: '8px',
    marginBottom: '1rem',  // Maggiore distanza tra i campi
    width: '100%',
    boxSizing: 'border-box',
  },
  textarea: {
    padding: '1rem',
    fontSize: '1rem',
    minHeight: '150px',  // Maggiore altezza per textarea
    border: '1px solid #ccc',
    borderRadius: '8px',
    marginBottom: '1rem',
    width: '100%',
    boxSizing: 'border-box',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',  // Allineamento dei bottoni
  },
  button: {
    padding: '1rem',
    fontSize: '1.1rem',
    backgroundColor: '#27ae60',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    width: '48%',  // Dimensione del bottone
    transition: 'background-color 0.3s ease',
  },
  cancelButton: {
    padding: '1rem',
    fontSize: '1.1rem',
    backgroundColor: '#e74c3c',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    width: '48%',
    transition: 'background-color 0.3s ease',
  },
  // Aggiunta l'animazione per il fade-in
  '@keyframes fadeIn': {
    '0%': { opacity: 0, transform: 'scale(0.8)' },
    '100%': { opacity: 1, transform: 'scale(1)' },
  }

};

export default ProjectDetail;
