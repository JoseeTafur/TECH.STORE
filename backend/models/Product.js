const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  nombre: { 
    type: String, 
    required: [true, 'El nombre es obligatorio'],
    trim: true 
  },
  descripcion: { 
    type: String, 
    required: true 
  },
  precio: { 
    type: Number, 
    required: true,
    default: 0.0
  },
  stock: { 
    type: Number, 
    required: true,
    default: 0 
  },
  categoria: { 
  type: String, 
  required: true,
  trim: true 
},
  marca: { 
    type: String, 
    required: true 
  },
  imagenUrl: { 
    type: String, 
    default: '' 
  },
  especificaciones: {
    type: Map,
    of: String 
  },
  fechaCreacion: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Product', productSchema);