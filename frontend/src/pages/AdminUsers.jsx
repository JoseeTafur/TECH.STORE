import React, { useState, useEffect } from 'react';
import defaultAvatar from '../assets/default-user.png';
import api from '../api/axios';
import UserModal from '../components/UserModal';
import '../styles/AdminUsers.css';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await api.get('/users', { headers: { Authorization: `Bearer ${token}` } });
      setUsers(Array.isArray(res.data) ? res.data : res.data.users || []);
    } catch (error) { 
      console.error("Error cargando usuarios:", error); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const openModal = (user = null) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Deseas eliminar permanentemente a este usuario?')) {
      try {
        const token = localStorage.getItem('token');
        await api.delete(`/users/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        fetchUsers();
      } catch (error) { 
        console.error("Error al eliminar:", error); 
      }
    }
  };

  // Función para manejar el guardado (NUEVO/EDITAR)
  const handleSaveUser = async (formData) => {
    try {
      const token = localStorage.getItem('token');
      if (selectedUser) {
        // Editar existente
        await api.put(`/users/${selectedUser._id}`, formData, { 
          headers: { Authorization: `Bearer ${token}` } 
        });
      } else {
        // Crear nuevo
        await api.post('/users', formData, { 
          headers: { Authorization: `Bearer ${token}` } 
        });
      }
      setIsModalOpen(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("No se pudo guardar el usuario.");
    }
  };

  const filteredUsers = users.filter(u => 
    u.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="admin-loader">Conectando con el servidor...</div>;

  return (
    <div className="users-view">
      <header className="view-header">
        <div className="header-text">
          <h1>👥 Directorio de Usuarios</h1>
          <p>Administra los niveles de acceso y perfiles del sistema.</p>
        </div>
        <button className="btn-primary-add" onClick={() => openModal()}>+ Añadir Miembro</button>
      </header>

      <div className="search-wrapper">
        <input 
          type="text" placeholder="Buscar por nombre o correo institucional..." className="search-field"
          value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th className="col-avatar">Perfil</th>
              <th className="col-name">Nombre Completo</th>
              <th className="col-email">Correo Electrónico</th>
              <th className="col-role">Privilegios</th>
              <th className="col-actions">Operaciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map(u => (
                <tr key={u._id}>
                  <td className="td-avatar">
                    <div className="avatar-wrapper">
                      <img 
  src={
    u.profilePic 
      ? `http://localhost:3000${u.profilePic}` 
      : defaultAvatar
  } 
  alt="avatar" 
  onError={(e) => { 
    e.target.onerror = null; 
    e.target.src = defaultAvatar; 
  }}
/>
                    </div>
                  </td>
                  <td className="td-name"><span className="fullname-text">{u.fullname}</span></td>
                  <td className="td-email"><span className="email-text">{u.email}</span></td>
                  <td className="td-role">
                    <span className={`role-tag ${u.role.toLowerCase()}`}>{u.role}</span>
                  </td>
                  <td className="td-actions">
                    <div className="actions-wrapper">
                      <button className="btn-action edit" onClick={() => openModal(u)}>⚙️ Editar</button>
                      <button className="btn-action delete" onClick={() => handleDelete(u._id)}>🗑️ Borrar</button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="5" className="empty-message">No se encontraron usuarios registrados.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <UserModal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setSelectedUser(null); }}
        user={selectedUser}
        onSave={handleSaveUser} // 👈 Ahora el nombre coincide con el Modal
      />
    </div>
  );
};

export default AdminUsers;