import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CheckoutModal from '../components/CheckoutModal'; // Importamos el modal
import '../styles/Cart.css';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false); // Estado del modal
  const API_URL = "http://localhost:3000";

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(savedCart);
  }, []);

  const saveAndSetCart = (newCart) => {
    setCartItems(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const updateQuantity = (id, delta) => {
    const updatedCart = cartItems.map(item => {
      if (item._id === id) {
        const newQty = item.quantity + delta;
        return { ...item, quantity: newQty > 0 ? newQty : 1 };
      }
      return item;
    });
    saveAndSetCart(updatedCart);
  };

  const removeFromCart = (id) => {
    if (window.confirm('¿Deseas quitar este producto de tu selección?')) {
      const updatedCart = cartItems.filter(item => item._id !== id);
      saveAndSetCart(updatedCart);
    }
  };

  // --- LÓGICA DE CÁLCULO ---
  const subtotalBase = cartItems.reduce((acc, item) => acc + (item.precio * item.quantity), 0);
  const igv = subtotalBase * 0.18;
  const totalFinal = subtotalBase + igv;

  // Función que se ejecuta cuando el Modal de Pago confirma la compra
  const handleProcessOrder = async (orderData) => {
    try {
        // Obtenemos el ID del usuario logueado (esto debería venir de tu AuthContext o JWT)
        const user = JSON.parse(localStorage.getItem('user')); 
        
        const dataFinal = {
            ...orderData,
            userId: user?._id || "654321..." // ID de prueba si no hay login
        };

        const res = await axios.post('http://localhost:3000/api/orders', dataFinal);
        
        if (res.data.success) {
            alert(`🎉 ${res.data.message}\nTotal: S/ ${res.data.total}`);
            
            // Limpiar carrito y redirigir
            localStorage.removeItem('cart');
            window.location.href = "/perfil/mis-compras"; 
        }
    } catch (err) {
      console.error(err);
      alert("❌ Hubo un problema al procesar tu pedido en el servidor.");
    }
};

  return (
    <div className="cart-viewport">
      <div className="cart-wrapper">
        <header className="cart-page-header">
          <div className="header-info">
            <h1>🛒 Tu Selección Tecnológica</h1>
            <p>Tienes <strong>{cartItems.length} artículos</strong> en el carrito</p>
          </div>
          <Link to="/productos" className="btn-back">← Seguir Comprando</Link>
        </header>

        {cartItems.length === 0 ? (
          <div className="cart-empty-state">
            <div className="empty-illust">🪐</div>
            <h2>Tu carrito está vacío</h2>
            <Link to="/productos" className="btn-primary-action">Ver Productos</Link>
          </div>
        ) : (
          <div className="cart-main-grid">
            <div className="cart-items-section">
              {cartItems.map(item => (
                <div key={item._id} className="cart-card">
                  <div className="cart-card-img">
                    <img src={`${API_URL}${item.imagenUrl}`} alt={item.nombre} />
                  </div>
                  <div className="cart-card-details">
                    <span className="item-brand">{item.marca}</span>
                    <h3>{item.nombre}</h3>
                  </div>
                  <div className="cart-card-controls">
                    <div className="qty-selector">
                      <button onClick={() => updateQuantity(item._id, -1)}>−</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item._id, 1)}>+</button>
                    </div>
                  </div>
                  <div className="cart-card-price">
                    <span className="total-item-price">S/ {(item.precio * item.quantity).toFixed(2)}</span>
                  </div>
                  <button className="btn-delete-item" onClick={() => removeFromCart(item._id)}>✕</button>
                </div>
              ))}
            </div>

            <aside className="cart-summary-sidebar">
              <div className="summary-card">
                <h3>Resumen de Pedido</h3>
                <div className="summary-list">
                  <div className="summary-row">
                    <span>Subtotal Base</span>
                    <span>S/ {subtotalBase.toFixed(2)}</span>
                  </div>
                  <div className="summary-row">
                    <span>IGV (18%)</span>
                    <span>S/ {igv.toFixed(2)}</span>
                  </div>
                  <div className="summary-divider"></div>
                  <div className="summary-row total">
                    <span>Total estimado</span>
                    <span>S/ {totalFinal.toFixed(2)}</span>
                  </div>
                </div>
                {/* BOTÓN CAMBIADO PARA ABRIR EL MODAL */}
                <button className="btn-complete-order" onClick={() => setIsCheckoutOpen(true)}>
                  Asignar Método de Pago
                </button>
              </div>
            </aside>
          </div>
        )}
      </div>

      {/* COMPONENTE MODAL DE PAGO Y ENVÍO */}
      <CheckoutModal 
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        subtotalBase={subtotalBase}
        igv={igv}
        onConfirm={handleProcessOrder}
      />
    </div>
  );
};

export default Cart;