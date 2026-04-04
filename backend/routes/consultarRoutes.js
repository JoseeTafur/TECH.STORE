const express = require('express');
const router = express.Router();
const { consultarDocumento } = require('../controllers/consultarController');

router.get('/:tipo/:num', consultarDocumento);

module.exports = router;