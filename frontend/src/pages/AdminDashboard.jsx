import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ products: 0, users: 0, lowStock: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };

        // Peticiones paralelas para optimizar velocidad
        const [prodRes, userRes] = await Promise.all([
          api.get('/products'), 
          api.get('/users', config) // Requiere Token
        ]);

        const low = prodRes.data.filter(p => p.stock < 5).length;
        setStats({ 
          products: prodRes.data.length, 
          users: userRes.data.length, 
          lowStock: low 
        });
      } catch (err) { 
        console.error("Error cargando estadísticas del dashboard:", err); 
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="dashboard-view">
      <header className="dashboard-header">
        <h1>🚀 Panel de Control</h1>
        <p>Resumen de inventario y comunidad de usuarios.</p>
      </header>

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-icon">📦</span>
          <div className="stat-info">
            <h3>Productos</h3>
            <p className="stat-value">{stats.products}</p>
          </div>
        </div>

        <div className="stat-card warning">
          <span className="stat-icon">📉</span>
          <div className="stat-info">
            <h3>Stock Bajo</h3>
            <p className="stat-value">{stats.lowStock}</p>
          </div>
        </div>

        <div className="stat-card info">
          <span className="stat-icon">👥</span>
          <div className="stat-info">
            <h3>Usuarios</h3>
            <p className="stat-value">{stats.users}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;