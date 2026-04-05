const mongoose = require('mongoose');

const configSchema = new mongoose.Schema({
  configNota: {
    serie: { type: String, required: true, default: 'N001' },
    correlativo: { type: Number, required: true, default: 1 }
  },
  configBoleta: {
    serie: { type: String, required: true, default: 'B001' },
    correlativo: { type: Number, required: true, default: 1 }
  },
  configFactura: {
    serie: { type: String, required: true, default: 'F001' },
    correlativo: { type: Number, required: true, default: 1 }
  }
}, { collection: 'config', timestamps: true });

module.exports = mongoose.model('Config', configSchema);