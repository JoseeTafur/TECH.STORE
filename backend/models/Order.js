const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  // Relación con el usuario que compra
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  // Detalle de productos
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    nombre: String,
    cantidad: Number,
    precioUnitario: Number,
    subtotalItem: Number
  }],

  // --- CAPA DE FACTURACIÓN (Crítico para MiAPI) ---
  cliente: {
    tipoDocumento: { type: String, enum: ['DNI', 'RUC'], required: true },
    numeroDocumento: { type: String, required: true },
    nombreCompleto: { type: String, required: true }, // El que vino de la API
    direccion: { type: String, default: 'Chiclayo, Lambayeque' }
  },

  comprobante: {
    tipo: { type: String, enum: ['Boleta', 'Factura'], required: true },
    serie: String,      // Ej: B001 o F001
    correlativo: Number,
    pdfUrl: String,     // Aquí guardaremos el link que nos dé MiAPI
    xmlUrl: String
  },

  // --- FINANZAS Y LOGÍSTICA ---
  montos: {
    subtotal: { type: Number, required: true },
    igv: { type: Number, required: true },
    totalAmount: { type: Number, required: true }
  },

  metodoPago: { 
    type: String, 
    enum: ['tarjeta', 'yape', 'efectivo'], 
    default: 'tarjeta' 
  },

  metodoEnvio: { 
    type: String, 
    enum: ['tienda', 'domicilio'], 
    default: 'tienda' 
  },

  status: { type: String, default: 'Procesando' },
  trackingNumber: { type: String },
  carrier: { type: String, default: 'Servicio Local' },
  
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);