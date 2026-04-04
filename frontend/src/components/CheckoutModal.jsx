import React, { useState } from 'react';
import axios from 'axios';
import '../styles/CheckoutModal.css';

const CheckoutModal = ({ isOpen, onClose, cartItems, subtotalBase, igv, onConfirm }) => {
  const [shippingMethod, setShippingMethod] = useState('tienda');
  const [paymentMethod, setPaymentMethod] = useState('tarjeta');
  const [documento, setDocumento] = useState('');
  const [nombreCliente, setNombreCliente] = useState('');
  const [direccion, setDireccion] = useState('');
  const [isConsulting, setIsConsulting] = useState(false);

  // Estados para formularios de pago
  const [cardData, setCardData] = useState({ number: '', exp: '', cvv: '' });
  const [yapeNumber, setYapeNumber] = useState('');

  if (!isOpen) return null;

  const MIAPI_TOKEN = "miap-7ci-u47-raa";

 // Lógica de consulta automática (Actualizada)
  const handleDocumentoChange = async (e) => {
    const val = e.target.value;
    setDocumento(val);

    if (val.length === 8 || val.length === 11) {
      setIsConsulting(true);
      try {
        const tipo = val.length === 8 ? 'dni' : 'ruc';
        
        // LLAMADA A TU BACKEND (Proxy)
        // Usamos el puerto 3000 que definiste en tu server.js
        const res = await axios.get(`http://localhost:3000/api/consultar/${tipo}/${val}`);
        
        if (res.data.success) {
          const d = res.data.datos;
          const nombre = tipo === 'dni' 
            ? `${d.nombres} ${d.ape_paterno} ${d.ape_materno}` 
            : d.razon_social;
          setNombreCliente(nombre);
        }
      } catch (err) {
        console.error("Error en consulta:", err);
      } finally {
        setIsConsulting(false);
      }
    }
  };

  const costoEnvio = shippingMethod === 'domicilio' ? (subtotalBase > 5000 ? 0 : 50) : 0;
  const totalFinal = subtotalBase + igv + costoEnvio;

  const handleFinish = (e) => {
    e.preventDefault();
    onConfirm({
      items: cartItems,
      envio: shippingMethod,
      pago: {
        metodo: paymentMethod,
        detalle: paymentMethod === 'tarjeta' ? cardData : { telefono: yapeNumber }
      },
      cliente: {
        numDoc: documento,
        nombre: nombreCliente,
        tipoDoc: documento.length === 11 ? '01' : '03',
        direccion: shippingMethod === 'domicilio' ? direccion : 'Recojo en Tienda'
      },
      total: totalFinal,
      igv,
      subtotal: subtotalBase
    });
  };

  return (
    <div className="chm-overlay">
      <div className="chm-modal">
        <header className="chm-header">
          <h2>💳 Checkout Final</h2>
          <button className="chm-close" onClick={onClose}>✕</button>
        </header>

        <form className="chm-content" onSubmit={handleFinish}>
          
          {/* SECCIÓN 1: IDENTIDAD (Consulta API) */}
          <div className="chm-section">
            <h3>1. Identificación del Cliente</h3>
            <div className="chm-input-grid">
              <div className="input-wrapper">
                <input 
                  type="text" placeholder="DNI (8) o RUC (11)" maxLength="11"
                  required value={documento} onChange={handleDocumentoChange}
                />
                {isConsulting && <div className="spinner-mini"></div>}
              </div>
              <input 
                type="text" placeholder="Nombre o Razón Social" 
                required value={nombreCliente} readOnly className="input-readonly"
              />
            </div>
          </div>

          {/* SECCIÓN 2: ENTREGA */}
          <div className="chm-section">
            <h3>2. Método de Entrega</h3>
            <div className="chm-options-grid">
              <div className={`chm-opt-card ${shippingMethod === 'tienda' ? 'selected' : ''}`} onClick={() => setShippingMethod('tienda')}>
                <strong>🏢 Tienda</strong><small>Gratis</small>
              </div>
              <div className={`chm-opt-card ${shippingMethod === 'domicilio' ? 'selected' : ''}`} onClick={() => setShippingMethod('domicilio')}>
                <strong>🚚 Delivery</strong><small>S/ {costoEnvio.toFixed(2)}</small>
              </div>
            </div>
            {shippingMethod === 'domicilio' && (
              <input type="text" className="chm-input-full" placeholder="Dirección en Chiclayo..." required value={direccion} onChange={(e) => setDireccion(e.target.value)} />
            )}
          </div>

          {/* SECCIÓN 3: PAGO (Formularios Dinámicos) */}
          <div className="chm-section">
            <h3>3. Detalles de Pago</h3>
            <div className="chm-payment-row">
              <button type="button" className={`btn-pay-opt ${paymentMethod === 'tarjeta' ? 'active' : ''}`} onClick={() => setPaymentMethod('tarjeta')}>Tarjeta</button>
              <button type="button" className={`btn-pay-opt ${paymentMethod === 'yape' ? 'active' : ''}`} onClick={() => setPaymentMethod('yape')}>Yape</button>
            </div>

            <div className="payment-form-container">
              {paymentMethod === 'tarjeta' ? (
                <div className="card-form animate-fade">
                  <input type="text" placeholder="0000 0000 0000 0000" maxLength="16" required onChange={(e) => setCardData({...cardData, number: e.target.value})} />
                  <div className="input-row">
                    <input type="text" placeholder="MM/YY" maxLength="5" required onChange={(e) => setCardData({...cardData, exp: e.target.value})} />
                    <input type="password" placeholder="CVV" maxLength="3" required onChange={(e) => setCardData({...cardData, cvv: e.target.value})} />
                  </div>
                </div>
              ) : (
                <div className="yape-form animate-fade">
                  <p>Escanea el QR o ingresa tu número de Yape:</p>
                  <input type="text" placeholder="923 000 000" maxLength="9" required value={yapeNumber} onChange={(e) => setYapeNumber(e.target.value)} />
                </div>
              )}
            </div>
          </div>

          <footer className="chm-footer">
            <div className="price-total">
              <span>Total:</span>
              <strong>S/ {totalFinal.toFixed(2)}</strong>
            </div>
            <button type="submit" className="btn-confirm-order">Pagar Ahora</button>
          </footer>
        </form>
      </div>
    </div>
  );
};

export default CheckoutModal;