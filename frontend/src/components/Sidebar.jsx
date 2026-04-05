import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Sidebar.css';

const Sidebar = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path ? 'active-link' : '';

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        TECH.<span>ADMIN</span>
      </div>

      <nav className="sidebar-nav">
        <p className="nav-section-title">GESTIÓN</p>
        
        <Link to="/admin/productos" className={`nav-item ${isActive('/admin/productos')}`}>
          <span className="nav-icon">📦</span> Inventario
        </Link>

        <Link to="/admin/usuarios" className={`nav-item ${isActive('/admin/usuarios')}`}>
          <span className="nav-icon">👥</span> Usuarios
        </Link>

        <Link to="/admin/comprobantes" className={`nav-item ${isActive('/admin/comprobantes')}`}>
          <span className="nav-icon">🧾</span> Comprobantes
        </Link>

        <Link to="/admin/ventas" className={`nav-item ${isActive('/admin/ventas')}`}>
          <span className="nav-icon">V</span> Ventas
        </Link>

        <p className="nav-section-title" style={{ marginTop: '20px' }}>SISTEMA</p>
        
        <Link to="/" className="nav-item">
          <span className="nav-icon">🏠</span> Ver Tienda
        </Link>
      </nav>

      <div className="sidebar-footer">
        <button onClick={() => { localStorage.clear(); window.location.href='/login'; }} className="btn-logout">
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;