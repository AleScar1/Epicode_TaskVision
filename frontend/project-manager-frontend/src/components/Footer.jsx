const Footer = () => {
  return (
    <footer style={styles.footer}>
      <p>&copy; {new Date().getFullYear()} Task Vision App</p>
    </footer>
  );
};

const styles = {
  footer: {
  width: '100%',
  padding: '1.5rem',
  textAlign: 'center',
  marginTop: '2rem',
  position: 'relative',
  zIndex: 10,
  boxSizing: 'border-box',
  backgroundColor: '#f1f1f1',
  },
};

export default Footer;