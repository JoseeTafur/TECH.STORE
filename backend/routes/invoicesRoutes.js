const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');

// Obtener invoiceos (Público)
router.get('/', invoiceController.getInvoices);

router.post('/', invoiceController.createInvoice);

module.exports = router;