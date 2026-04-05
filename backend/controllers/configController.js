const Config = require('../models/Config');

const getConfig = async (req, res) => {
  try {
    const config = await Config.find();
    res.json(config);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener comprobantes', error: error.message });
  }
};

// GET: Obtener serie
const getSerie = async (req, res) => {
    const {tipo} = req.params;
  try {
    const config = await Config.findOne();
    if (!config) {
      return res.status(404).json({ message: 'No se encontró la configuración' });
    }

    let respuesta;
    switch(tipo) {
        case 'boleta':
            respuesta = config.configBoleta;
            break;
        case 'factura':
            respuesta = config.configFactura;
            break;
        case 'nota':
            respuesta = config.configNota;
            break;
        default:
            return res.status(400).json({ message: 'Tipo de comprobante inválido' });
    }
     res.json(respuesta);   
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener serie', error: error.message });
  }
};

const getAndIncrementSerie = async (req, res) => {
  const { tipo } = req.params;
  try {
    const config = await Config.findOne();
    if (!config) return res.status(404).json({ message: 'No se encontró la configuración' });

    let serieObj;
    switch(tipo) {
      case 'boleta': serieObj = config.configBoleta; break;
      case 'factura': serieObj = config.configFactura; break;
      case 'nota': serieObj = config.configNota; break;
      default: return res.status(400).json({ message: 'Tipo de comprobante inválido' });
    }

    const resultado = { serie: serieObj.serie, correlativo: serieObj.correlativo };
    serieObj.correlativo += 1; // incrementa
    await config.save();

    res.json(resultado);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener y actualizar serie', error: error.message });
  }
};

module.exports = {getSerie, getConfig, getAndIncrementSerie};