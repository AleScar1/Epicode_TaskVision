import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header style={styles.header}>
      <h1>TaskVision</h1>
      <nav>
        <Link to="/" style={styles.link}>Home</Link>
        <Link to="/login" style={styles.link}>Login</Link>
        <Link to="/dashboard" style={styles.link}>Dashboard</Link>
      </nav>
    </header>
  );
};

const styles = {
  header: {
    background: '#333',
    color: '#fff',
    padding: '1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  link: {
    marginLeft: '1rem',
    color: 'white',
    textDecoration: 'none'
  }
};

export default Header;