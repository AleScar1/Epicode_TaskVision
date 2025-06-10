import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getUserProjects } from '../api/projects';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const Dashboard = () => {
  const { user, token, logout } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 3;
  const navigate = useNavigate();

    const handleEdit = (project) => {
    navigate(`/edit-project/${project._id}`);
  };

  const handleDelete = async (projectId) => {
    if (!window.confirm('Sei sicuro di voler eliminare questo progetto?')) return;

    try {
      await axios.delete(`/api/projects/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProjects(prev => prev.filter(p => p._id !== projectId));
    } catch (error) {
      alert('Errore durante l\'eliminazione del progetto');
    }
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getUserProjects(token);
        setProjects(data);
      } catch (error) {
        console.error('Errore nel recuperare i progetti:', error);
      }
    };

    fetchProjects();
  }, [token]);

  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = projects.slice(indexOfFirstProject, indexOfLastProject);
  const totalPages = Math.ceil(projects.length / projectsPerPage);

  return (
    <>
      <Header />
      <main style={styles.main}>
        <h2>Ciao, {user?.fullname}!</h2>
        <p>Benvenuto nella tua dashboard.</p>

        <button onClick={logout} style={styles.button}>Logout</button>

        <h3 style={{ marginTop: '2rem' }}>I tuoi progetti:</h3>

        <Link to="/create-project" style={styles.createBtn}>+ Crea nuovo progetto</Link>

        {projects.length === 0 ? (
          <p>Non hai ancora progetti.</p>
        ) : (
          <div style={styles.cardContainer}>
            {currentProjects.map((project) => (
            <div key={project._id} style={styles.card}>
              {project.imageUrl && (
                <img
                  src={project.imageUrl ? project.imageUrl : 'https://via.placeholder.com/300x150?text=Nessuna+immagine'}
                  alt={project.name}
                  style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px', marginBottom: '1rem' }}
                />
              )}
              <h4 style={styles.cardTitle}>{project.name}</h4>
              <p style={styles.cardDesc}>{project.description}</p>
              <Link to={`/projects/${project._id}`} style={styles.cardBtn}>Vai al progetto</Link>

              {/* BOTTONI */}
              {project.members.some(m => m.userId === user.id && m.role === 'admin') && (
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <button
                    onClick={() => handleEdit(project)}
                    style={{ ...styles.cardBtn, backgroundColor: '#f39c12' }}
                  >
                    Modifica
                  </button>
                  <button
                    onClick={() => handleDelete(project._id)}
                    style={{ ...styles.cardBtn, backgroundColor: '#e74c3c' }}
                  >
                    Elimina
                  </button>
                </div>
              )}
            </div>
          ))}

            
          </div>
          
        )}
        {totalPages > 1 && (
          <div style={{ marginTop: '1.5rem' }}>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                style={{
                  margin: '0 4px',
                  padding: '6px 12px',
                  backgroundColor: currentPage === i + 1 ? '#3498db' : '#ddd',
                  color: currentPage === i + 1 ? '#fff' : '#000',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
};

const styles = {
  main: {
    width: '100%',
    maxWidth: '900px',
    minHeight: '60vh',
    margin: '4rem auto',
    padding: '2rem',
    textAlign: 'center',
    backgroundColor: '#ece6d9',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
  },
  button: {
    marginTop: '1rem',
    padding: '0.75rem 1.5rem',
    fontSize: '1rem',
    backgroundColor: '#c0392b',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  createBtn: {
    display: 'inline-block',
    marginTop: '2rem',
    marginBottom: '1rem',
    padding: '0.5rem 1rem',
    backgroundColor: '#2980b9',
    color: '#fff',
    textDecoration: 'none',
    borderRadius: '5px',
  },
  list: {
    listStyle: 'none',
    padding: 0,
    marginTop: '1rem',
    textAlign: 'left',
    maxWidth: '600px',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  link: {
    color: '#2980b9',
    textDecoration: 'none'
  },
  cardContainer: {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  marginTop: '1.5rem',
  maxWidth: '600px',
  marginLeft: 'auto',
  marginRight: 'auto',
},

card: {
  backgroundColor: '#fff',
  border: '1px solid #ccc',
  padding: '1rem',
  borderRadius: '8px',
  textAlign: 'left',
  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
},

cardTitle: {
  margin: '0 0 0.5rem 0',
  color: '#2c3e50',
},

cardDesc: {
  fontSize: '0.95rem',
  color: '#555',
  marginBottom: '1rem',
},

cardBtn: {
  backgroundColor: '#2980b9',
  color: 'white',
  padding: '0.5rem 1rem',
  borderRadius: '4px',
  textDecoration: 'none',
  fontSize: '0.9rem',
}
};

export default Dashboard;