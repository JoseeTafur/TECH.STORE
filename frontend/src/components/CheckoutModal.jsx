import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { SUCURSALES, DISTRITOS_DELIVERY } from '../constants/checkoutData';
import '../styles/CheckoutModal.css';

const CheckoutModal = ({ isOpen, onClose, cartItems, subtotalBase, igv, onConfirm }) => {
  // Estados de Identidad
  const [documento, setDocumento] = useState('');
  const [nombreCliente, setNombreCliente] = useState('');
  const [tipoComprobante, setTipoComprobante] = useState('03'); // 03=Boleta, 01=Factura
  const [isConsulting, setIsConsulting] = useState(false);

  // Estados de Logística
  const [shippingMethod, setShippingMethod] = useState('tienda');
  const [sucursalSelected, setSucursalSelected] = useState(SUCURSALES[0].id);
  const [distritoSelected, setDistritoSelected] = useState(DISTRITOS_DELIVERY[0].id);
  const [direccion, setDireccion] = useState('');

  // Estados de Pago
  const [paymentMethod, setPaymentMethod] = useState('tarjeta');
  const [cardInfo, setCardInfo] = useState({ number: '', exp: '', cvv: '' });

  if (!isOpen) return null;

  // Lógica de Identidad (Discriminación DNI/RUC)
  const handleDocumentoChange = async (e) => {
    let val = e.target.value.replace(/\D/g, ''); // Solo números
    setDocumento(val);

    if (val.length === 8 || val.length === 11) {
      setIsConsulting(true);
      const tipo = val.length === 8 ? 'dni' : 'ruc';
      setTipoComprobante(val.length === 8 ? '03' : '01');

      try {
        const res = await axios.get(`http://localhost:3000/api/consultar/${tipo}/${val}`);
        if (res.data.success) {
          const d = res.data.data;
          const nombre = tipo === 'dni' 
            ? `${d.nombres} ${d.ape_paterno} ${d.ape_materno}` 
            : (d.razon_social || d.nombre_o_razon_social);
          setNombreCliente(nombre);
        }
      } catch (err) {
        setNombreCliente("Documento no encontrado");
      } finally {
        setIsConsulting(false);
      }
    }
  };

  // Cálculo de Envío
  const distObj = DISTRITOS_DELIVERY.find(d => d.id === distritoSelected);
  const costoEnvio = shippingMethod === 'tienda' ? 0 : (subtotalBase > 5000 ? 0 : distObj.costo);
  const totalFinal = subtotalBase + igv + costoEnvio;

  const handleFinish = async (e) => {
    e.preventDefault();

    const tipo = tipoComprobante === '01' ? 'boleta' : 'factura';
    const { serie, correlativo } = await axios.get(`http://localhost:3000/api/config/${tipo}`)
    .then(res => ({ serie: res.data.serie, correlativo: String(res.data.correlativo) }))
    .catch(() => ({ serie: "N001", correlativo: "0" }));

    onConfirm({
      cartItems,
      cliente: {
        numDoc: documento,
        nombre: nombreCliente,
        tipoDoc: documento.length === 11 ? "6" : "1",
        direccion: shippingMethod === 'domicilio' ? `${direccion} - ${distObj.nombre}` : 'Recojo en Tienda'
      },
      comprobante: {
        tipoOperacion: "0101",
        tipoDoc: tipoComprobante,
        serie: serie,
        correlativo: correlativo,
        tipoPago: 'Contado',
        observacion: ""
      },
      // logistica: {
      //   metodo: shippingMethod,
      //   sucursal: shippingMethod === 'tienda' ? SUCURSALES.find(s => s.id === sucursalSelected).nombre : null
      // },
      // pago: {
      //   metodo: paymentMethod,
      //   total: totalFinal
      // }
    });
  };

  return (
    <div className="chm-overlay">
      <div className="chm-modal">
        <header className="chm-header">
          <h2>📦 Finalizar Compra - TECH.STORE</h2>
          <button className="chm-close" onClick={onClose}>✕</button>
        </header>

        <form className="chm-content" onSubmit={handleFinish}>
          {/* SECCIÓN 1: IDENTIDAD */}
          <section className="chm-section">
            <h3>1. Datos de Facturación ({tipoComprobante === '01' ? 'FACTURA' : 'BOLETA'})</h3>
            <div className="chm-input-grid">
              <div className="input-wrapper">
                <input type="text" placeholder="DNI o RUC" maxLength="11" required value={documento} onChange={handleDocumentoChange} />
                {isConsulting && <div className="spinner-mini"></div>}
              </div>
              <input type="text" value={nombreCliente} readOnly className="input-readonly" placeholder="Nombre o Razón Social" />
            </div>
          </section>

          {/* SECCIÓN 2: ENTREGA */}
          <section className="chm-section">
            <h3>2. Método de Entrega</h3>
            <div className="chm-options-grid">
              <div className={`chm-opt-card ${shippingMethod === 'tienda' ? 'selected' : ''}`} onClick={() => setShippingMethod('tienda')}>
                <strong>🏢 Recojo</strong><small>S/ 0.00</small>
              </div>
              <div className={`chm-opt-card ${shippingMethod === 'domicilio' ? 'selected' : ''}`} onClick={() => setShippingMethod('domicilio')}>
                <strong>🚚 Delivery</strong><small>S/ {costoEnvio.toFixed(2)}</small>
              </div>
            </div>

            {shippingMethod === 'tienda' ? (
              <select className="chm-select" value={sucursalSelected} onChange={(e) => setSucursalSelected(e.target.value)}>
                {SUCURSALES.map(s => <option key={s.id} value={s.id}>{s.nombre}</option>)}
              </select>
            ) : (
              <div className="chm-delivery-fields">
                <select className="chm-select" value={distritoSelected} onChange={(e) => setDistritoSelected(e.target.value)}>
                  {DISTRITOS_DELIVERY.map(d => <option key={d.id} value={d.id}>{d.nombre}</option>)}
                </select>
                <input type="text" placeholder="Dirección exacta (Chiclayo)" required value={direccion} onChange={(e) => setDireccion(e.target.value)} />
              </div>
            )}
          </section>

          {/* SECCIÓN 3: PAGO */}
          <section className="chm-section">
            <h3>3. Medio de Pago</h3>
            <div className="chm-payment-row">
              <button type="button" className={`btn-pay ${paymentMethod === 'tarjeta' ? 'active' : ''}`} onClick={() => setPaymentMethod('tarjeta')}>💳 Tarjeta</button>
              <button type="button" className={`btn-pay ${paymentMethod === 'yape' ? 'active' : ''}`} onClick={() => setPaymentMethod('yape')}>📱 Yape</button>
            </div>
            
            {paymentMethod === 'tarjeta' && (
              <div className="card-fields">
                <input type="text" placeholder="XXXX XXXX XXXX XXXX" maxLength="19" required />
                <div className="input-row">
                  <input type="text" placeholder="MM/YY" maxLength="5" required />
                  <input type="password" placeholder="CVV" maxLength="3" required />
                </div>
              </div>
            )}
          </section>

          <footer className="chm-footer">
            <div className="total-box">
              <span>Total a pagar:</span>
              <strong>S/ {totalFinal.toFixed(2)}</strong>
            </div>
            <button type="submit" className="btn-main-confirm">Confirmar Pedido</button>
          </footer>
        </form>
      </div>
    </div>
  );
};

export default CheckoutModal;