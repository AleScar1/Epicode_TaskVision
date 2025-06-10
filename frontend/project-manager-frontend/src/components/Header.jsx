import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Header = () => {
  const { user } = useContext(AuthContext);

  return (
    <header style={styles.header}>
      <h1>TaskVision</h1>
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