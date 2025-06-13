import React, { useState } from 'react';
import axios from 'axios';
import './RegisterModal.css';

const RegisterModal = ({ show, onClose }) => {
  const [formData, setFormData] = useState({
    fullname: '',
    username: '',
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!show) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        // da verificare , verificato ok 
      const response = await axios.post('/auth/register', formData);

      setSuccess(response.data.message);
      setFormData({ fullname: '', username: '', email: '', password: '' });

      setTimeout(() => {
        setSuccess('');
        onClose();
      }, 2500);

    } catch (err) {
      const msg = err.response?.data?.message || 'Errore durante la registrazione';
      setError(msg);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <button className="close-button" onClick={onClose}>×</button>
        <h2>Registrazione</h2>
        <p>Compila il modulo per creare il tuo account.</p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="fullname"
            placeholder="Nome completo"
            value={formData.fullname}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit" className="btn btn-dark mt-3">
            Registrati
          </button>
        </form>

        {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
        {success && <p style={{ color: 'green', marginTop: '1rem' }}>{success}</p>}
      </div>
    </div>
  );
};

export default RegisterModal;