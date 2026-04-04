import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import defaultAvatar from '../assets/default-user.png';
import '../styles/Navbar.css';

const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [cartCount, setCartCount] = useState(0);
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const user = JSON.parse(localStorage.getItem('user'));

  // Sincronizar el input con la URL (por si el usuario navega atrás/adelante)
  useEffect(() => {
    const q = searchParams.get('search') || '';
    setSearchTerm(q);
  }, [searchParams]);

  const updateBadge = () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const total = cart.reduce((acc, item) => acc + (item.quantity || 0), 0);
    setCartCount(total);
  };

  useEffect(() => {
    updateBadge();
    window.addEventListener('cartUpdated', updateBadge);
    window.addEventListener('storage', updateBadge);
    return () => {
      window.removeEventListener('cartUpdated', updateBadge);
      window.removeEventListener('storage', updateBadge);
    };
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
    window.location.reload(); 
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Al presionar Enter, forzamos la navegación
    navigate(`/productos?search=${searchTerm.trim()}`);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    // Si el usuario borra todo, navegamos a la ruta limpia para mostrar todo
    if (value.trim() === '') {
      navigate('/productos');
    }
  };

  return (
    <nav className="ts-navbar">
      <div className="ts-nav-container">
        <div className="ts-nav-left">
          <Link to="/" className="ts-logo">TECH.<span>STORE</span></Link>
        </div>

        <div className="ts-nav-center">
          <form className="ts-search-form" onSubmit={handleSearch}>
            <input 
              type="text" 
              placeholder="¿Qué hardware buscas hoy?" 
              value={searchTerm}
              onChange={handleInputChange}
            />
            <button type="submit" className="ts-search-btn">🔍</button>
          </form>
        </div>

        <div className="ts-nav-right">
          <div className="ts-account-zone" onMouseEnter={() => setShowDropdown(true)} onMouseLeave={() => setShowDropdown(false)}>
            <div className="ts-user-trigger">
              <div className="ts-user-text">
                <span className="ts-user-greet">Hola, {user ? user.fullname?.split(' ')[0] : 'Invitado'}</span>
                <span className="ts-user-title">Mi Cuenta ▾</span>
              </div>
            </div>
            {showDropdown && (
              <div className="ts-dropdown-menu">
                {user ? (
                  <>
                    <Link to="/perfil" onClick={() => setShowDropdown(false)}>👤 Mi Perfil</Link>
                    {(user.role === 'ADMIN' || user.role === 'VENDEDOR') && (
                      <Link to="/admin" onClick={() => setShowDropdown(false)}>⚙️ Panel Admin</Link>
                    )}
                    <Link to="/mis-compras" onClick={() => setShowDropdown(false)}>🛍️ Mis Compras</Link>
                    <hr />
                    <button onClick={handleLogout} className="ts-logout-btn">Cerrar Sesión</button>
                  </>
                ) : (
                  <div className="ts-guest-box">
                    <Link to="/login" className="ts-btn-login-drop">Iniciar Sesión</Link>
                    <Link to="/register" className="ts-link-reg">Crear cuenta</Link>
                  </div>
                )}
              </div>
            )}
          </div>

          <Link to="/carrito" className="ts-nav-icon ts-cart-btn">
            <span className="icon-badge-wrap">
              🛒
              {cartCount > 0 && <span className="ts-badge-count">{cartCount}</span>}
            </span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;