import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import '../styles/Home.css';

const Home = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const res = await api.get('/products');
        setProducts(res.data);
      } catch (err) {
        console.error("Error en Home:", err);
      }
    };
    fetchHomeData();
  }, []);

  return (
    <main className="home-main">
      {/* SECTION 1: HERO ADDS */}
      <section className="hero-v2">
        <div className="hero-overlay">
          <div className="hero-text-box">
            <span className="promo-tag">OFERTA DE LA SEMANA</span>
            <h1>Laptops Gamer de Última Generación</h1>
            <p>Equípate con lo mejor de ASUS, HP y Apple. Hasta 12 cuotas sin intereses.</p>
            <Link to="/productos" className="btn-primary-v2">Explorar tienda</Link>
          </div>
        </div>
      </section>

      {/* SECTION 2: CATEGORÍAS ICONOGRÁFICAS */}
      <section className="cat-nav">
        <div className="cat-inner">
          {[
            { n: 'Laptops', i: '💻' },
            { n: 'Componentes', i: '🔌' },
            { n: 'Monitores', i: '🖥️' },
            { n: 'Perifericos', i: '🖱️' }
          ].map(c => (
            <Link key={c.n} to={`/productos?cat=${c.n}`} className="cat-bubble">
              <span className="bubble-icon">{c.i}</span>
              <span className="bubble-name">{c.n}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* SECTION 3: PRODUCTOS DESTACADOS (GRILLA DINÁMICA) */}
      <section className="featured-container">
        <div className="container-header">
          <h2>🔥 Tendencias en Tecnología</h2>
          <Link to="/productos" className="view-all">Ver todo el catálogo</Link>
        </div>

        <div className="main-products-grid">
          {products.slice(0, 8).map(p => (
            <article key={p._id} className="pro-card">
              <div className="pro-badge">Envío Gratis</div>
              <div className="pro-img-wrapper">
                <img src={p.imagenUrl ? `http://localhost:3000${p.imagenUrl}` : '/default-hw.png'} alt={p.nombre} />
              </div>
              <div className="pro-details">
                <span className="pro-brand">{p.marca}</span>
                <h3 className="pro-title">{p.nombre}</h3>
                <div className="pro-price-row">
                  <span className="pro-price">S/ {p.precio.toLocaleString()}</span>
                </div>
                <button className="btn-add-cart-v2">Añadir</button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Home;