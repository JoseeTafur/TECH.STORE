import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import defaultAvatar from '../assets/default-user.png';
import '../styles/Profile.css';

const Profile = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [formData, setFormData] = useState({
    fullname: user?.fullname || '',
    password: ''
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const data = new FormData();
      data.append('fullname', formData.fullname);
      if (formData.password) data.append('password', formData.password);
      if (selectedFile) data.append('image', selectedFile);

      const response = await api.put('/users/profile', data, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}` 
        }
      });

      const updatedData = { ...response.data, token: token }; 
      localStorage.setItem('user', JSON.stringify(updatedData));
      setUser(updatedData);
      setIsEditing(false);
      alert("✅ ¡Perfil actualizado!");
      window.location.reload(); 
    } catch (error) {
      alert("❌ Error al actualizar");
    }
  };

  return (
    <div className="profile-page">
      <aside className="profile-sidebar">
  <div className="avatar-container">
    <img 
  src={
    preview 
      ? preview 
      : user.profilePic 
        ? (user.profilePic.startsWith('http') ? user.profilePic : `http://localhost:3000${user.profilePic}`)
        : defaultAvatar
  } 
  alt="avatar" 
  onError={(e) => { 
    e.target.onerror = null; 
    e.target.src = defaultAvatar; 
  }}
/>
    
    {isEditing && (
      <label className="upload-overlay">
        <span>📷 Cambiar</span>
        <input type="file" hidden onChange={handleFileChange} accept="image/*" />
      </label>
    )}
  </div>
  <h2>{user.fullname}</h2>
  <span className="role-badge-profile">{user.role}</span>
</aside>

      <main className="profile-main-content">
        <section className="info-card">
          <h3>👤 Mis Datos Personales</h3>
          <form onSubmit={handleSave}>
            <div className="profile-grid">
              <div className="input-group">
                <label>Nombre Completo</label>
                <input 
                  type="text" 
                  disabled={!isEditing}
                  value={formData.fullname}
                  onChange={(e) => setFormData({...formData, fullname: e.target.value})}
                />
              </div>

              <div className="input-group">
                <label>Correo Electrónico</label>
                <input type="email" value={user.email} disabled />
              </div>

              {/* AQUÍ ESTÁ EL BOTÓN DE SUBIR ARCHIVO QUE FALTABA EN EL FORMULARIO */}
              <div className="input-group">
                <label>Foto de Perfil</label>
                <div className="file-input-wrapper">
                  <input 
                    type="file" 
                    id="file-upload" 
                    hidden 
                    disabled={!isEditing}
                    onChange={handleFileChange} 
                    accept="image/*" 
                  />
                  <label htmlFor="file-upload" className={`btn-file-select ${!isEditing ? 'disabled' : ''}`}>
                    {selectedFile ? `📁 ${selectedFile.name}` : '📁 Seleccionar Imagen'}
                  </label>
                </div>
              </div>

              <div className="input-group">
                <label>Nueva Contraseña (Opcional)</label>
                <input 
                  type="password" 
                  disabled={!isEditing}
                  placeholder="Sin cambios"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>

            <div className="profile-actions-bar">
              {isEditing ? (
                <>
                  <button type="button" className="btn-cancel" onClick={() => {setIsEditing(false); setPreview(null);}}>Cancelar</button>
                  <button type="submit" className="btn-save-changes">Guardar Cambios</button>
                </>
              ) : (
                <button type="button" className="btn-edit-mode" onClick={() => setIsEditing(true)}>⚙️ Editar Perfil</button>
              )}
            </div>
          </form>
        </section>
        
        <section className="history-card">
          <h3>📦 Historial de Compras</h3>
          <p className="empty-msg">Aún no tienes pedidos registrados.</p>
        </section>
      </main>
    </div>
  );
};

export default Profile;