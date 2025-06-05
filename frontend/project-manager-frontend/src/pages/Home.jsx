import Header from '../components/Header';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <>
      <Header />
      <main style={styles.main}>
        <h2 style={styles.title}>Benvenuto nella Project Manager App</h2>
        <p style={styles.subtitle}>
          Gestisci progetti, task e collaboratori in modo semplice ed efficace.
        </p>
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
  title: {
    fontSize: '2rem',
    marginBottom: '1rem',
    color: '#fff',
  },
  subtitle: {
    fontSize: '1.1rem',
    color: '#ccc',
  },
};

export default Home;