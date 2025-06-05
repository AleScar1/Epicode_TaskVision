import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getUserProjects } from '../api/projects';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user, token, logout } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);

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
          <ul style={styles.list}>
            {projects.map((project) => (
              <li key={project._id}>
                <Link to={`/projects/${project._id}`} style={styles.link}>
                  <strong>{project.name}</strong>
                </Link>
                : {project.description}
              </li>
            ))}
          </ul>
        )}
      </main>
      <Footer />
    </>
  );
};

const styles = {
  main: {
  width: '100%',
  maxWidth: '1200px',
  minHeight: '60vh',
  margin: '4rem auto',
  padding: '2rem',
  textAlign: 'center',
  backgroundColor: '#1e1e1e',
  borderRadius: '8px',
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
    marginTop: '1rem',
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
  },

  link: {
  color: '#2980b9',
  textDecoration: 'none'
  }
};

export default Dashboard;