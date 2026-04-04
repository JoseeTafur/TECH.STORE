import React from 'react';
import '../styles/ProductViewModal.css';

const ProductViewModal = ({ isOpen, onClose, product, onAddToCart }) => {
  if (!isOpen || !product) return null;

  const API_URL = "http://localhost:3000";

  return (
    <div className="pvm-overlay" onClick={onClose}>
      <div className="pvm-card" onClick={(e) => e.stopPropagation()}>
        <button className="pvm-close-btn" onClick={onClose}>✕</button>
        
        <div className="pvm-layout">
          <div className="pvm-visual">
            <img src={product.imagenUrl ? `${API_URL}${product.imagenUrl}` : ''} alt={product.nombre} />
            <div className="pvm-badge">{product.categoria}</div>
          </div>

          <div className="pvm-details">
            <header>
              <span className="pvm-brand">{product.marca}</span>
              <h2>{product.nombre}</h2>
            </header>

            <div className="pvm-specs-grid">
              <div className="spec-item">
                <span className="spec-label">Procesador</span>
                <span className="spec-value">{product.especificaciones?.procesador || 'N/A'}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Memoria RAM</span>
                <span className="spec-value">{product.especificaciones?.memoria || 'N/A'}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Disponibilidad</span>
                <span className={`spec-value ${product.stock > 0 ? 'in-stock' : 'no-stock'}`}>
                  {product.stock > 0 ? `🟢 ${product.stock} unidades` : '🔴 Agotado'}
                </span>
              </div>
            </div>

            <p className="pvm-desc">{product.descripcion}</p>

            <div className="pvm-action-bar">
              <div className="pvm-price-box">
                <span className="pvm-total-label">Inversión</span>
                <span className="pvm-total-amount">S/ {product.precio.toFixed(2)}</span>
              </div>
              <button 
                className="pvm-btn-confirm" 
                onClick={() => { onAddToCart(product); onClose(); }}
                disabled={product.stock <= 0}
              >
                📥 Añadir al Carrito
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductViewModal;