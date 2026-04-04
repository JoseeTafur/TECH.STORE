import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import '../styles/Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({ fullname: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/register', formData);
      alert('🚀 ¡Cuenta creada con éxito! Ahora inicia sesión.');
      navigate('/login');
    } catch (error) {
      alert('Error: ' + (error.response?.data?.message || 'Error al registrar'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* 🔥 AGREGAMOS ESTE DIV PARA ENVOLVER Y CENTRAR EL CUADRO */}
      <div className="auth-container">
        
        <div className="auth-header">
          <h2>Crear Cuenta</h2>
          <p>Únete a la comunidad de TECH.STORE y gestiona tus pedidos.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-group">
            <label>Nombre Completo</label>
            <input
              className="auth-input"
              type="text"
              required
              placeholder="Juan Pérez"
              value={formData.fullname}
              onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
            />
          </div>

          <div className="auth-group">
            <label>Correo Electrónico</label>
            <input
              className="auth-input"
              type="email"
              required
              placeholder="tu@correo.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="auth-group">
            <label>Contraseña</label>
            <input
              className="auth-input"
              type="password"
              required
              placeholder="Mínimo 8 caracteres"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'CREANDO CUENTA...' : 'REGISTRARME AHORA'}
          </button>
        </form>

        <div className="auth-footer">
          ¿Ya eres miembro? <Link to="/login" className="auth-link">Inicia Sesión</Link>
        </div>

      </div> {/* 👈 FIN DEL CONTAINER */}
    </div>
  );
};

export default Register;