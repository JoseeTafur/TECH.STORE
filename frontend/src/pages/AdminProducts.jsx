import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import ProductsModal from '../components/ProductsModal'; 
import '../styles/AdminProducts.css';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const API_URL = "http://localhost:3000";

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products');
      setProducts(res.data);
    } catch (err) { 
      console.error("Error cargando productos:", err); 
    }
  };

  useEffect(() => { 
    fetchProducts(); 
  }, []);

  const openModal = (product = null) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Deseas eliminar este producto del inventario?')) {
      try {
        const token = localStorage.getItem('token');
        await api.delete(`/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchProducts();
      } catch (error) {
        console.error("Error al eliminar:", error);
      }
    }
  };

  const filteredProducts = products.filter(p => 
    p.nombre?.toLowerCase().includes(filter.toLowerCase()) || 
    p.marca?.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="inventory-view">
      <header className="view-header">
        <div className="header-text">
          <h1>📦 Inventario General</h1>
          <p>Control total de stock, precios y catálogo técnico.</p>
        </div>
        <button className="btn-primary-add" onClick={() => openModal()}>
          + Registrar Producto
        </button>
      </header>

      <div className="search-wrapper">
        <input 
          className="search-field" 
          placeholder="Filtrar por modelo, marca o ID..." 
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <span className="search-icon-inside">🔍</span>
      </div>

      <div className="table-container">
  <table className="admin-table">
    <thead>
      <tr>
        <th className="col-foto">Imagen</th>
        <th className="col-info">Producto</th>
        <th className="col-cat">Categoría</th>
        <th className="col-inv">Precio & Stock</th>
        <th className="col-actions">Acciones</th>
      </tr>
    </thead>
    <tbody>
      {filteredProducts.length > 0 ? (
        filteredProducts.map(p => (
          <tr key={p._id}>
            {/* COL 1: FOTO */}
            <td className="td-foto">
              <div className="img-wrapper">
                <img 
                  src={p.imagenUrl ? `${API_URL}${p.imagenUrl}` : 'https://ui-avatars.com/api/?name=HW&background=random'} 
                  alt="prod" 
                  onError={(e) => { e.target.src = 'https://ui-avatars.com/api/?name=Error&background=ef4444'; }}
                />
              </div>
            </td>

            {/* COL 2: PRODUCTO (Solo texto) */}
            <td className="td-info">
              <div className="info-block">
                <strong>{p.nombre || 'Sin nombre'}</strong>
                <span>{p.marca || 'Genérico'}</span>
              </div>
            </td>

            {/* COL 3: CATEGORÍA */}
            <td className="td-cat">
              <span className="badge-category">{p.categoria}</span>
            </td>

            {/* COL 4: PRECIO Y STOCK (Apilados para orden visual) */}
            <td className="td-inv">
              <div className="inv-stack">
                <span className="price-tag">S/ {(p.precio || 0).toFixed(2)}</span>
                <span className={`stock-tag ${p.stock < 5 ? 'critical' : 'stable'}`}>
                  {p.stock} unidades
                </span>
              </div>
            </td>

            {/* COL 5: ACCIONES */}
            <td className="td-actions">
              <div className="actions-wrapper">
                <button className="btn-action edit" onClick={() => openModal(p)}>⚙️ Editar</button>
                <button className="btn-action delete" onClick={() => handleDelete(p._id)}>🗑️ Borrar</button>
              </div>
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="5" className="empty-message">No hay productos que coincidan con la búsqueda.</td>
        </tr>
      )}
    </tbody>
  </table>
</div>

      <ProductsModal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setSelectedProduct(null); }} 
        product={selectedProduct} 
        onSuccess={() => { setIsModalOpen(false); fetchProducts(); }} 
      />
    </div>
  );
};

export default AdminProducts;