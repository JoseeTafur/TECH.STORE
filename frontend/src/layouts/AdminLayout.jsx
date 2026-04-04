import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import '../styles/AdminLayout.css';

const AdminLayout = () => {
  return (
    <div className="admin-container">
      <Sidebar />
      <div className="admin-main">
        <header className="admin-header">
          <h2>Panel de Gestión Empresarial</h2>
        </header>
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;