import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import '../styles/Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) navigate('/');
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Dentro de handleSubmit en Login.jsx
const response = await api.post('/auth/login', formData);

// 1. Guardamos el token
localStorage.setItem('token', response.data.token);

// 2. Guardamos el objeto COMPLETO del usuario para que la Navbar lo lea
// Esto incluye _id, fullname, email y role
localStorage.setItem('user', JSON.stringify(response.data));

// Opcional: puedes mantener userRole si lo usas en otros lados
localStorage.setItem('userRole', response.data.role);

if (response.data.role === 'ADMIN') {
  navigate('/admin');
} else {
  navigate('/');
}

window.location.reload();

    } catch (error) {
      alert('Credenciales incorrectas: ' + (error.response?.data?.message || 'Error de servidor'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h2>Inicia Sesión</h2>
          <p>Accede a tu cuenta de TECH.STORE</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-group">
            <label>Correo Electrónico</label>
            <input
              className="auth-input"
              type="email"
              required
              placeholder="tu@email.com"
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
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Validando...' : 'ENTRAR AL SISTEMA'}
          </button>
        </form>

        <div className="auth-footer">
          ¿Nuevo por aquí? <Link to="/register" className="auth-link">Crea una cuenta</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;