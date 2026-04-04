import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom'; // 👈 Añadí useNavigate
import api from '../api/axios';
import ProductViewModal from '../components/ProductViewModal';
import '../styles/Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // --- ESTADOS DE FILTROS ---
  const [selectedCats, setSelectedCats] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  
  // 🔥 ESTADO PARA EL TOAST (ESTO FALTABA)
  const [showToast, setShowToast] = useState(false);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  const API_URL = "http://localhost:3000";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get('/products');
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) { console.error("Error", error); }
      finally { setLoading(false); }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    let result = products;
    if (searchQuery.trim() !== '') {
      result = result.filter(p => 
        p.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.marca.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (selectedCats.length > 0) {
      result = result.filter(p => selectedCats.includes(p.categoria));
    }
    if (selectedBrands.length > 0) {
      result = result.filter(p => selectedBrands.includes(p.marca));
    }
    setFilteredProducts(result);
  }, [searchQuery, selectedCats, selectedBrands, products]);

  // 🔥 FUNCIÓN ADD TO CART CON VALIDACIÓN
  const addToCart = (product) => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user) {
      setShowToast(true); // Mostramos el cuadrito rojo
      setTimeout(() => {
        setShowToast(false);
        navigate('/login');
      }, 2500);
      return; // ✋ Bloqueamos el resto de la función
    }

    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const index = cart.findIndex(i => i._id === product._id);
    
    if (index > -1) { cart[index].quantity += 1; } 
    else { cart.push({ ...product, quantity: 1 }); }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
    alert(`✅ ${product.nombre} añadido`);
  };

  const toggleFilter = (item, list, setList) => {
    if (list.includes(item)) { setList(list.filter(i => i !== item)); } 
    else { setList([...list, item]); }
  };

  if (loading) return <div className="tech-loader">Cargando catálogo...</div>;

  const allCategories = [...new Set(products.map(p => p.categoria))].sort();
  const allBrands = [...new Set(products.map(p => p.marca))].sort();

  return (
    <div className="catalog-wrapper">
      <div className="catalog-content">
        <aside className="catalog-sidebar">
          {/* ... Contenido del Sidebar igual ... */}
          <div className="sidebar-top">
            <h3>Filtros</h3>
          </div>
          <div className="filter-block">
            <h4>Categorías</h4>
            {allCategories.map(cat => (
              <label key={cat} className={`filter-option ${selectedCats.includes(cat) ? 'active' : ''}`}>
                <input type="checkbox" checked={selectedCats.includes(cat)} onChange={() => toggleFilter(cat, selectedCats, setSelectedCats)} />
                <span className="check-custom"></span>
                <span className="label-text">{cat}</span>
              </label>
            ))}
          </div>
        </aside>

        <section className="catalog-results">
          <div className="results-meta">
            <h2>{searchQuery ? `Resultados para "${searchQuery}"` : 'Catálogo Completo'}</h2>
          </div>

          <div className="tech-products-grid">
            {filteredProducts.map((p) => (
              <article key={p._id} className="tech-item-card">
                <div className="item-img-container" onClick={() => { setSelectedProduct(p); setIsModalOpen(true); }}>
                  <img src={p.imagenUrl ? `${API_URL}${p.imagenUrl}` : '/default-hw.png'} alt={p.nombre} />
                </div>
                <div className="item-info-container">
                  <span className="item-brand-label">{p.marca}</span>
                  <h3 className="item-name">{p.nombre}</h3>
                  <div className="item-price-box">
                    <span className="currency">S/</span>
                    <span className="amount">{(p.precio || 0).toLocaleString()}</span>
                  </div>
                  <button className="btn-buy-now" onClick={() => addToCart(p)}>Agregar al carrito</button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>

      {showToast && (
        <div className="auth-toast">
          <span className="toast-icon">⚠️</span>
          <div className="toast-content">
            <p className="toast-title">Acceso Restringido</p>
            <p className="toast-sub">Inicia sesión para añadir al carrito</p>
          </div>
        </div>
      )}

      <ProductViewModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        product={selectedProduct} 
        onAddToCart={addToCart} 
      />
    </div>
  );
};

export default Products;