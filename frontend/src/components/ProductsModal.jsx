import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import '../styles/ProductsModal.css';

const ProductsModal = ({ isOpen, onClose, onSuccess, product }) => {
  const [formData, setFormData] = useState({
    nombre: '', categoria: 'Laptops', precio: '', stock: '', marca: '', otraMarca: '', descripcion: ''
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  // --- CONFIGURACIÓN DE DATOS MASIVOS ---
  const categoriasHardware = [
    'Laptops', 'Procesadores (CPU)', 'Tarjetas de Video (GPU)', 'Memorias RAM', 
    'Almacenamiento (SSD/HDD)', 'Placas Base (Motherboards)', 'Fuentes de Poder (PSU)',
    'Cases/Gabinetes', 'Refrigeración', 'Monitores', 'Periféricos', 'Audio / Streaming',
    'Sillas Gamer', 'Conectividad/Redes'
  ];

  const marcasHardware = [
    'Apple', 'Nvidia', 'AMD', 'Intel', 'Asus', 'MSI', 'Gigabyte', 'EVGA', 'Zotac',
    'HP', 'Lenovo', 'Dell', 'Samsung', 'LG', 'Logitech', 'Razer', 'Corsair', 
    'Kingston', 'Crucial', 'Western Digital', 'Seagate', 'Cooler Master', 
    'Seasonic', 'HyperX', 'Redragon', 'Cougar', 'Noctua', 'Thermaltake'
  ].sort(); // Ordenadas alfabéticamente
  // --------------------------------------

  useEffect(() => {
    if (product) {
      setFormData({
        nombre: product.nombre || '',
        categoria: product.categoria || 'Laptops',
        precio: product.precio || '',
        stock: product.stock || '',
        marca: product.marca || '',
        otraMarca: '', 
        descripcion: product.descripcion || ''
      });
      setPreview(product.imagenUrl ? `http://localhost:3000${product.imagenUrl}` : null);
    } else {
      setFormData({ nombre: '', categoria: 'Laptops', precio: '', stock: '', marca: '', otraMarca: '', descripcion: '' });
      setPreview(null);
      setImage(null);
    }
  }, [product, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) { setImage(file); setPreview(URL.createObjectURL(file)); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const data = new FormData();
    const marcaFinal = formData.marca === 'OTRA' ? formData.otraMarca : formData.marca;
    
    data.append('nombre', formData.nombre);
    data.append('descripcion', formData.descripcion);
    data.append('precio', Number(formData.precio));
    data.append('stock', Number(formData.stock));
    data.append('categoria', formData.categoria);
    data.append('marca', marcaFinal);
    
    if (image) data.append('image', image);

    try {
      const config = { headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` } };
      if (product) { 
        await api.put(`/products/${product._id}`, data, config); 
      } else { 
        await api.post('/products', data, config); 
      }
      onSuccess();
    } catch (err) { 
      alert("Error al procesar el registro."); 
    }
  };

  return (
    <div className="pm-overlay">
      <div className="pm-container">
        <header className="pm-header">
          <h2>{product ? '📝 Editar Componente' : '📦 Registro de Hardware Pro'}</h2>
          <button className="pm-close-btn" onClick={onClose}>&times;</button>
        </header>

        <form onSubmit={handleSubmit} className="pm-grid-body">
          <div className="pm-form-section">
            <div className="pm-group">
              <label>Nombre del Producto / Modelo</label>
              <input className="pm-input" name="nombre" value={formData.nombre} onChange={handleChange} required placeholder="Ej. GeForce RTX 4090 OC Edition" />
            </div>

            <div className="pm-row">
              <div className="pm-group">
                <label>Marca</label>
                <select className="pm-input" name="marca" value={formData.marca} onChange={handleChange} required>
                  <option value="">Seleccionar...</option>
                  {marcasHardware.map(m => <option key={m} value={m}>{m}</option>)}
                  <option value="OTRA">Otra (Especificar)...</option>
                </select>
              </div>
              <div className="pm-group">
                <label>Categoría Técnica</label>
                <select className="pm-input" name="categoria" value={formData.categoria} onChange={handleChange} required>
                  {categoriasHardware.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            {formData.marca === 'OTRA' && (
              <div className="pm-group pm-animate-fade">
                <label>Marca Personalizada</label>
                <input className="pm-input" name="otraMarca" value={formData.otraMarca} onChange={handleChange} required placeholder="Nombre de la nueva marca" />
              </div>
            )}

            <div className="pm-row">
              <div className="pm-group">
                <label>Precio Unitario (S/)</label>
                <input className="pm-input" type="number" step="0.01" name="precio" value={formData.precio} onChange={handleChange} required />
              </div>
              <div className="pm-group">
                <label>Stock Inicial</label>
                <input className="pm-input" type="number" name="stock" value={formData.stock} onChange={handleChange} required />
              </div>
            </div>

            <div className="pm-group">
              <label>Especificaciones Técnicas (Ficha)</label>
              <textarea 
                className="pm-textarea" 
                name="descripcion" 
                value={formData.descripcion} 
                onChange={handleChange} 
                rows="4"
                placeholder="Detalla Hz, GB, Watts, etc..."
              ></textarea>
            </div>
          </div>

          <div className="pm-image-section">
            <div className="pm-dropzone">
              {preview ? <img src={preview} alt="preview" className="pm-img" /> : <div className="pm-icon">📷</div>}
              <input type="file" onChange={handleImageChange} id="file-p" hidden />
              <label htmlFor="file-p" className="pm-upload-btn">Cargar Fotografía</label>
            </div>
          </div>

          <footer className="pm-footer">
            <button type="button" className="pm-btn-cancel" onClick={onClose}>Descartar</button>
            <button type="submit" className="pm-btn-save">{product ? 'Actualizar Stock' : 'Ingresar a Inventario'}</button>
          </footer>
        </form>
      </div>
    </div>
  );
};

export default ProductsModal;