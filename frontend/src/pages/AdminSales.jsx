import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import '../styles/AdminSales.css';

const STATUS_CONFIG = {
  'Canjeado':   { label: 'Canjeado',   cls: 'status-redeemed'  },
  'Pendiente':  { label: 'Pendiente',  cls: 'status-pending'   },
  'Anulado':    { label: 'Anulado',    cls: 'status-cancelled' },
  'Emitido':    { label: 'Emitido',    cls: 'status-issued'    },
};

const PAYMENT_ICONS = {
  'Contado':   '💵',
  'Crédito':   '💳',
  'Yape':      '📱',
  'Plin':      '📲',
};

const formatDate = (iso) => {
  const d = new Date(iso);
  return d.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' });
};

const formatTime = (iso) => {
  const d = new Date(iso);
  return d.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });
};

const AdminSales = () => {
  const [invoices, setInvoices]     = useState([]);
  const [filter, setFilter]         = useState('');
  const [statusFilter, setStatus]   = useState('Todos');
  const [loading, setLoading]       = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const res = await api.get('/invoices');
      setInvoices(res.data);
    } catch (err) {
      console.error('Error cargando facturas:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchInvoices(); }, []);

  const toggleExpand = (id) =>
    setExpandedId(prev => (prev === id ? null : id));

  const allStatuses = ['Todos', ...new Set(invoices.map(i => i.situacion).filter(Boolean))];

  const filtered = invoices.filter(inv => {
    const q = filter.toLowerCase();
    const matchText =
      inv.codigo?.toLowerCase().includes(q) ||
      inv.cliente?.nombre?.toLowerCase().includes(q) ||
      inv.cliente?.documento?.includes(q);
    const matchStatus = statusFilter === 'Todos' || inv.situacion === statusFilter;
    return matchText && matchStatus;
  });

  const stats = {
    total:    invoices.length,
    canjeado: invoices.filter(i => i.situacion === 'Canjeado').length,
    pendiente: invoices.filter(i => i.situacion === 'Pendiente').length,
    anulado:  invoices.filter(i => i.situacion === 'Anulado').length,
  };

  return (
    <div className="sales-view">

      {/* ── HEADER ── */}
      <header className="sales-header">
        <div className="header-left">
          <h1>🧾 Gestión de Ventas</h1>
          <p>Historial de comprobantes, estados y documentos tributarios.</p>
        </div>
        <button className="btn-refresh" onClick={fetchInvoices}>
          ↺ Actualizar
        </button>
      </header>

      {/* ── STAT CARDS ── */}
      <div className="stat-row">
        <div className="stat-card stat-total">
          <span className="stat-icon">📊</span>
          <div>
            <strong>{stats.total}</strong>
            <small>Total comprobantes</small>
          </div>
        </div>
        <div className="stat-card stat-ok">
          <span className="stat-icon">✅</span>
          <div>
            <strong>{stats.canjeado}</strong>
            <small>Canjeados</small>
          </div>
        </div>
        <div className="stat-card stat-warn">
          <span className="stat-icon">⏳</span>
          <div>
            <strong>{stats.pendiente}</strong>
            <small>Pendientes</small>
          </div>
        </div>
        <div className="stat-card stat-danger">
          <span className="stat-icon">🚫</span>
          <div>
            <strong>{stats.anulado}</strong>
            <small>Anulados</small>
          </div>
        </div>
      </div>

      {/* ── TOOLBAR ── */}
      <div className="toolbar">
        <div className="search-wrapper">
          <span className="search-icon-inside">🔍</span>
          <input
            className="search-field"
            placeholder="Buscar por N° comprobante, cliente o RUC/DNI..."
            value={filter}
            onChange={e => setFilter(e.target.value)}
          />
        </div>

        <div className="filter-pills">
          {allStatuses.map(s => (
            <button
              key={s}
              className={`pill ${statusFilter === s ? 'pill-active' : ''}`}
              onClick={() => setStatus(s)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* ── TABLE ── */}
      <div className="table-container">
        {loading ? (
          <div className="loading-state">
            <div className="spinner" />
            <p>Cargando comprobantes…</p>
          </div>
        ) : (
          <table className="sales-table">
            <thead>
              <tr>
                <th>N° Comprobante</th>
                <th>Cliente</th>
                <th>Fecha</th>
                <th>Medio de Pago</th>
                <th>Situación</th>
                <th>Documentos</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? filtered.map(inv => {
                const st = STATUS_CONFIG[inv.situacion] ?? { label: inv.situacion, cls: 'status-default' };
                const isOpen = expandedId === inv._id;
                const payIcon = PAYMENT_ICONS[inv.medioPago] ?? '💰';

                return (
                  <React.Fragment key={inv._id}>
                    <tr className={isOpen ? 'row-expanded' : ''}>

                      {/* N° COMPROBANTE */}
                      <td className="td-code">
                        <span className="invoice-code">{inv.codigo}</span>
                      </td>

                      {/* CLIENTE */}
                      <td className="td-client">
                        <div className="client-block">
                          <strong>{inv.cliente?.nombre ?? '—'}</strong>
                          <span className="doc-num">{inv.cliente?.documento}</span>
                        </div>
                      </td>

                      {/* FECHA */}
                      <td className="td-date">
                        <div className="date-block">
                          <span className="date-main">{formatDate(inv.fecha)}</span>
                          <span className="date-time">{formatTime(inv.fecha)}</span>
                        </div>
                      </td>

                      {/* MEDIO PAGO */}
                      <td className="td-payment">
                        <span className="payment-badge">
                          {payIcon} {inv.medioPago}
                        </span>
                      </td>

                      {/* SITUACIÓN */}
                      <td className="td-status">
                        <span className={`status-badge ${st.cls}`}>{st.label}</span>
                      </td>

                      {/* DOCUMENTOS */}
                      <td className="td-docs">
                        {inv.links ? (
                          <div className="doc-links">
                            {inv.links['pdf-a4'] && (
                              <a href={inv.links['pdf-a4']} target="_blank" rel="noreferrer" className="doc-btn doc-pdf" title="PDF A4">
                                📄 PDF
                              </a>
                            )}
                            {inv.links['pdf-ticket'] && (
                              <a href={inv.links['pdf-ticket']} target="_blank" rel="noreferrer" className="doc-btn doc-ticket" title="Ticket">
                                🎫 Ticket
                              </a>
                            )}
                            {inv.links['xml-firmado'] && (
                              <a href={inv.links['xml-firmado']} target="_blank" rel="noreferrer" className="doc-btn doc-xml" title="XML Firmado">
                                🗂 XML
                              </a>
                            )}
                          </div>
                        ) : (
                          <span className="no-docs">Sin documentos</span>
                        )}
                      </td>

                      {/* EXPAND */}
                      <td className="td-expand">
                        <button
                          className={`btn-expand ${isOpen ? 'open' : ''}`}
                          onClick={() => toggleExpand(inv._id)}
                          title="Ver detalle"
                        >
                          ▾
                        </button>
                      </td>
                    </tr>

                    {/* FILA EXPANDIDA */}
                    {isOpen && (
                      <tr className="expanded-row">
                        <td colSpan="7">
                          <div className="expanded-content">
                            <div className="expand-item">
                              <label>📍 Dirección</label>
                              <span>{inv.cliente?.direccion ?? '—'}</span>
                            </div>
                            <div className="expand-item">
                              <label>🆔 ID Interno</label>
                              <span className="mono">{inv._id}</span>
                            </div>
                            {inv.links?.['xml-sin-firmar'] && (
                              <div className="expand-item">
                                <label>🗃 XML sin firmar</label>
                                <a href={inv.links['xml-sin-firmar']} target="_blank" rel="noreferrer">
                                  Descargar
                                </a>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              }) : (
                <tr>
                  <td colSpan="7" className="empty-message">
                    No se encontraron comprobantes para esta búsqueda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminSales;