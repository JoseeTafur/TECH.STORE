const express = require('express');
const router = express.Router();
const { emitirComprobante, msg } = require('../controllers/checkoutController');

router.get('/', msg)
router.post('/', emitirComprobante);

module.exports = router;