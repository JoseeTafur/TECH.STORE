const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({

  codigo: {
    type: String,
    required: true,
    unique: true
  },
  fecha: {
    type: Date,
    required: true
  },

  medioPago: {
    type: String,
    enum: ['Contado', 'Credito'],
    default: 'Contado'
  },

  cliente: {
    nombre: { type: String, required: true },
    documento: { type: String, required: true },
    direccion: { type: String }
  },

  // 🔹 Links (MiAPI / SUNAT)
  links: {
    "xml-sin-firmar": String,
    "xml-firmado": String,
    "pdf-a4": String,
    "pdf-ticket": String
  },

  // 🔹 Estado
  situacion: {
    type: String,
    enum: ['Pendiente', 'Canjeado', 'Anulado'],
    default: 'Pendiente'
  },

});

module.exports = mongoose.model('Invoice', invoiceSchema);