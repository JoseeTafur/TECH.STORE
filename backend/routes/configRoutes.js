const express = require('express');
const router = express.Router();
const { getSerie, getConfig, getAndIncrementSerie } = require('../controllers/configController');

router.get('/:tipo', getAndIncrementSerie);
router.get('/', getConfig);

module.exports = router;