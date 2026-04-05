const Invoice = require('../models/Invoices');

// GET: Obtener todos los comprobantes
exports.getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find();
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener comprobantes', error: error.message });
  }
};

// POST: Crear comprobante
exports.createInvoice = async (req, res) => {

  try {
    const { codigo, fecha, medioPago, cliente, links, situacion } = req.body;
    console.log(links);

    // Validar duplicado
    const existe = await Invoice.findOne({ codigo });
    if (existe) {
      return res.status(400).json({ message: 'El comprobante ya existe' });
    }

    const nuevaInvoice = new Invoice({
      codigo,
      fecha: new Date(fecha),
      medioPago,
      cliente,
      links,
      situacion
    });

    const invoiceGuardada = await nuevaInvoice.save();
    res.status(201).json(invoiceGuardada);

  } catch (error) {
    console.error('❌ Error en POST Invoice:', error.message);
    res.status(400).json({ message: 'Error al crear comprobante', error: error.message });
  }
};