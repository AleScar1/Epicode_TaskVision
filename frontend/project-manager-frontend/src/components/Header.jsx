import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import icon from '../../img/11.png';


const Header = () => {
  const { user } = useContext(AuthContext);

  return (
    <header style={styles.header}>
      {/* Immagine aggiunta accanto al titolo frontend/project-manager-frontend*/}
      <div style={styles.title}>
        <img 
          src={icon} 
          alt="Icona" 
          style={styles.icon} 
        />
        <h1>TaskVision</h1>
      </div>
      <nav style={styles.nav}>
        <Link to="/" style={styles.link}>Home</Link>
        {!user && <Link to="/login" style={styles.link}>Login</Link>}
        <Link to="/dashboard" style={styles.link}>Dashboard</Link>
      </nav>
    </header>
  );
};

const styles = {
  header: {
    width: '100%',
    padding: '1rem 2rem',
    backgroundColor: '#096B68',
    color: '#EAE4D5',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxSizing: 'border-box',
  },
  title: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem', // Spazio tra l'immagine e il titolo
  },
  icon: {
    width: '40px',  // Imposta la larghezza dell'immagine
    height: '40px', // Imposta l'altezza dell'immagine
    objectFit: 'contain', // Mantieni il rapporto di aspetto dell'immagine
  },
  nav: {
    display: 'flex',
    gap: '1rem',
  },
  link: {
    color: '#90D1CA',
    textDecoration: 'none',
    fontWeight: 'bold',
  }
};

export default Header;