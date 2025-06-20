import { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Header from '../components/Header';  // Assicurati di importare il Header
import Footer from '../components/Footer';  // Assicurati di importare il Footer

const Login = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/auth/login', { email, password });
      login(res.data.token, res.data.user);
      navigate('/dashboard');
    } catch (err) {
      alert('Credenziali non valide');
    }
  };

  return (
    <div style={styles.container}>
      <Header />  {/* Header posizionato in alto */}
      <div style={styles.formContainer}>
        <form onSubmit={handleLogin} style={styles.form}>
          <h2 style={styles.title}>Login</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />
          <button type="submit" style={styles.button}>Accedi</button>
        </form>
      </div>
      <Footer />  {/* Footer posizionato in basso */}
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',  // Imposta l'altezza a 100% della pagina
    justifyContent: 'space-between',  // Spazio tra l'header, il form e il footer
    backgroundColor: '#121212',
  },
  formContainer: {
    display: 'flex',
    justifyContent: 'center',  // Centra il contenuto orizzontalmente
    alignItems: 'center',  // Centra il contenuto verticalmente
    flex: 1,  // Occupa lo spazio rimanente
  },
  form: {
    width: '100%',
    maxWidth: '400px',
    padding: '2rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    backgroundColor: '#f9f9f9',
    borderRadius: '10px',
    boxShadow: '0 0 20px rgba(0,0,0,0.2)',
  },
  title: {
    marginBottom: '1rem',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  input: {
    padding: '0.75rem',
    fontSize: '1rem',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  button: {
    padding: '0.75rem',
    fontSize: '1rem',
    backgroundColor: '#333',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  }
};

export default Login;
