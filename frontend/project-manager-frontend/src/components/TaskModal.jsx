import { useState, useEffect } from 'react';

const TaskModal = ({ showModal, setShowModal, taskId, token, onTaskUpdated }) => {
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskStatus, setTaskStatus] = useState('todo');

  useEffect(() => {
    if (taskId) {
      console.log("Caricamento task con ID:", taskId);
      fetch(`/api/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error('Task non trovato');
          }
          return res.json();
        })
        .then((task) => {
          setTaskTitle(task.title);
          setTaskDescription(task.description);
          setTaskStatus(task.status);
        })
        .catch((error) => {
          console.error('Errore nel caricare il task:', error);
        });
    }
  }, [taskId, token]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: taskTitle,
          description: taskDescription,
          status: taskStatus,
        }),
      });

      if (!response.ok) throw new Error('Errore nell\'aggiornamento del task');

      onTaskUpdated();
      setShowModal(false);
    } catch (err) {
      alert('Errore nell\'aggiornamento del task');
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Errore nell\'eliminazione del task');

      onTaskUpdated();
      setShowModal(false);
    } catch (err) {
      alert('Errore nell\'eliminazione del task');
    }
  };

  return (
    showModal && (
      <div style={styles.modal}>
        <h3>Modifica Task</h3>
        <form onSubmit={handleUpdate}>
          <input
            type="text"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            placeholder="Titolo task"
            style={styles.input}
          />
          <textarea
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            placeholder="Descrizione task"
            style={styles.textarea}
          />
          <select
            value={taskStatus}
            onChange={(e) => setTaskStatus(e.target.value)}
            style={styles.select}
          >
            <option value="todo">Todo</option>
            <option value="in progress">In Progress</option>
            <option value="done">Done</option>
          </select>
          <button type="submit" style={styles.button}>Aggiorna Task</button>
        </form>
        <button onClick={handleDelete} style={styles.deleteButton}>Elimina Task</button>
      </div>
    )
  );
};

const styles = {
  modal: {
    backgroundColor: '#ffffff',
    padding: '3rem',  // Aumentato il padding per più spazio
    borderRadius: '10px',
    boxShadow: '0 0 15px rgba(0, 0, 0, 0.1)',
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 1000,
    maxWidth: '800px',  // Aumentata la larghezza della modale
    width: '90%',
    animation: 'fadeIn 0.5s ease-in-out',
  },
  input: {
    padding: '1rem',  // Aumentato il padding per dare più spazio
    fontSize: '1rem',
    border: '1px solid #ddd',
    borderRadius: '8px',
    marginBottom: '1.5rem',  // Maggiore spazio tra gli input
    width: '100%',
  },
  textarea: {
    padding: '1rem',
    fontSize: '1rem',
    minHeight: '120px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    marginBottom: '1.5rem',
    width: '100%',
  },
  select: {
    padding: '1rem',
    fontSize: '1rem',
    border: '1px solid #ddd',
    borderRadius: '8px',
    marginBottom: '1.5rem',
    width: '100%',
  },
  button: {
    padding: '1rem',
    fontSize: '1.2rem',
    backgroundColor: '#27ae60',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    width: '100%',
  },
  deleteButton: {
    padding: '1rem',
    fontSize: '1.2rem',
    backgroundColor: '#e74c3c',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    marginTop: '1rem',
    transition: 'background-color 0.3s ease',
    width: '100%',
  },
};

// Aggiungere un'animazione di fade-in per l'apparizione della modale
const fadeInKeyframes = `
  @keyframes fadeIn {
    0% { opacity: 0; transform: scale(0.8); }
    100% { opacity: 1; transform: scale(1); }
  }
`;

export default TaskModal;
