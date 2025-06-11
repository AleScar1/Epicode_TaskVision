import { useState, useEffect } from 'react';

const TaskModal = ({ showModal, setShowModal, taskId, token, onTaskUpdated }) => {
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskStatus, setTaskStatus] = useState('todo');

  // Carica i dettagli del task
useEffect(() => {
  if (taskId) {
    console.log("Caricamento task ID:", taskId);
    fetch(`/api/tasks/${taskId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((task) => {
        setTaskTitle(task.title);
        setTaskDescription(task.description);
        setTaskStatus(task.status);
      })
      .catch((error) => console.error('Errore nel caricare il task:', error));
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

      onTaskUpdated(); // Ricarica i task dopo la modifica
      setShowModal(false); // Chiudi la modale
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

      onTaskUpdated(); // Ricarica i task dopo l'eliminazione
      setShowModal(false); // Chiudi la modale
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
            style={styles.input}
          >
            <option value="todo">Todo</option>
            <option value="in progress">In Progress</option>
            <option value="done">Done</option>
          </select>
          <button type="submit" style={styles.button}>Aggiorna Task</button>
        </form>
        <button onClick={handleDelete} style={styles.button}>Elimina Task</button>
      </div>
    )
  );
};

const styles = {
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
    marginBottom: '1rem',
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
};

export default TaskModal;