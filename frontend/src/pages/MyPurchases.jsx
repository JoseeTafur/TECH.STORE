import React, { useState, useEffect } from 'react';
import '../styles/MyPurchases.css';

const MyPurchases = () => {
  const [purchases, setPurchases] = useState([
    { id: '1024', date: '2026-03-15', total: 1500, status: 'Entregado' },
    { id: '1025', date: '2026-04-02', total: 850, status: 'En camino' }
  ]);

  return (
    <div className="purchases-page">
      <div className="purchases-container">
        <header className="purchases-header">
          <h2>🛍️ Mis Compras</h2>
          <p>Gestiona y rastrea tus pedidos recientes.</p>
        </header>

        <div className="table-wrapper">
          <table className="purchases-table">
            <thead>
              <tr>
                <th>ID Pedido</th>
                <th>Fecha</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {purchases.map((order) => (
                <tr key={order.id}>
                  <td>#ORD-{order.id}</td>
                  <td>{order.date}</td>
                  <td>S/ {order.total}</td>
                  <td>
                    <span className={`status-pill ${order.status.toLowerCase().replace(' ', '-')}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <button className="btn-track">Rastrear API</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MyPurchases;