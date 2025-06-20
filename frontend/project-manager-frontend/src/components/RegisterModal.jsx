import React, { useState } from 'react';
import axios from 'axios';
import './RegisterModal.css';

const RegisterModal = ({ show, onClose }) => {
  const [formData, setFormData] = useState({
    fullname: '',
    username: '',
    email: '',
    password: '',
    isAdmin: false,
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!show) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleCheckboxChange = () => {
    setFormData({ ...formData, isAdmin: !formData.isAdmin });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/auth/register', formData);
      setSuccess(response.data.message);
      setFormData({ fullname: '', username: '', email: '', password: '', isAdmin: false });

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
        <h2 className="modal-title">Registrazione</h2>
        <p className="modal-subtitle">Compila il modulo per creare il tuo account.</p>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="input-group">
            <i className="fas fa-user-circle"></i>
            <input
              type="text"
              name="fullname"
              placeholder="Nome completo"
              value={formData.fullname}
              onChange={handleChange}
              className="modal-input"
              required
            />
          </div>

          <div className="input-group">
            <i className="fas fa-user"></i>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className="modal-input"
              required
            />
          </div>

          <div className="input-group">
            <i className="fas fa-envelope"></i>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="modal-input"
              required
            />
          </div>

          <div className="input-group">
            <i className="fas fa-lock"></i>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="modal-input"
              required
            />
          </div>

          {/* Aggiungi il checkbox per il flag "Crea come amministratore" */}
          <div className="checkbox-container">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="isAdmin"
                checked={formData.isAdmin}
                onChange={handleCheckboxChange}
              />
              <span className="checkbox-text">Crea come amministratore</span>
            </label>
          </div>

          <button type="submit" className="btn-submit">
            <i className="fas fa-check"></i> Registrati
          </button>
        </form>

        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
      </div>
    </div>
  );
};

export default RegisterModal;
