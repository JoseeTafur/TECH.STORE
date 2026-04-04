import React, { useState, useEffect } from 'react';
import '../styles/UserModal.css';

const UserModal = ({ isOpen, onClose, user, onSave }) => {
  const [formData, setFormData] = useState({ fullname: '', email: '', password: '', role: 'CLIENTE' });

  useEffect(() => {
    if (user) {
      setFormData({ fullname: user.fullname || '', email: user.email || '', password: '', role: user.role || 'CLIENTE' });
    } else {
      setFormData({ fullname: '', email: '', password: '', role: 'CLIENTE' });
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    // Ejecutamos la función que viene por props
    onSave(formData);
  };

  return (
    <div className="um-overlay">
      <div className="um-card">
        <header className="um-header">
          <div className="header-info">
            <span className="user-icon">👤</span>
            <h2>{user ? 'Modificar Usuario' : 'Nuevo Registro'}</h2>
          </div>
          <button className="um-close" onClick={onClose}>&times;</button>
        </header>

        <form onSubmit={handleSubmit} className="um-body">
          <div className="um-group">
            <label>Nombre y Apellidos</label>
            <input className="um-input" type="text" required value={formData.fullname} onChange={(e) => setFormData({...formData, fullname: e.target.value})} placeholder="Ej. José Mario Tafur" />
          </div>

          <div className="um-group">
            <label>E-mail Institucional</label>
            <input className="um-input" type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="u22xxxxxx@utp.edu.pe" />
          </div>

          {!user && (
            <div className="um-group">
              <label>Credenciales (Temporal)</label>
              <input className="um-input" type="password" required value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} placeholder="Mín. 6 caracteres" />
            </div>
          )}

          <div className="um-group">
            <label>Nivel de Autoridad</label>
            <select className="um-input" value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}>
              <option value="CLIENTE">CLIENTE</option>
              <option value="VENDEDOR">VENDEDOR</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>

          <footer className="um-footer">
            <button type="button" className="um-btn-alt" onClick={onClose}>Descartar</button>
            <button type="submit" className="um-btn-main">{user ? 'Aplicar Cambios' : 'Confirmar Registro'}</button>
          </footer>
        </form>
      </div>
    </div>
  );
};

export default UserModal;