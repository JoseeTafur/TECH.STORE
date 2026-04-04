import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/ShopLayout.css';

const ShopLayout = () => {
  return (
    <div className="shop-wrapper">
      <Navbar />
      
      <main className="shop-main">
        <Outlet />
      </main>

      {/* FOOTER GLOBAL DEFINITIVO */}
      <footer className="shop-footer">
        <div className="footer-container">
          <div className="footer-brand-section">
            <h2 className="footer-logo">TECH.<span>STORE</span></h2>
            <p>Tu aliado estratégico en hardware de alto rendimiento. Calidad certificada para estudiantes y profesionales.</p>
          </div>
          
          <div className="footer-links-section">
            <h4>Navegación</h4>
            <Link to="/">Inicio</Link>
            <Link to="/productos">Productos</Link>
            <Link to="/carrito">Mi Carrito</Link>
          </div>

          <div className="footer-contact-section">
            <h4>Contacto</h4>
            <p>📍 Chiclayo, Lambayeque</p>
            <p>📧 soporte@techstore.com</p>
          </div>
        </div>
        <div className="footer-copy">
          <p>&copy; 2026 TECH.STORE - Proyecto Académico UTP. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default ShopLayout;