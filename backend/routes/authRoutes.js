const express = require('express');
const router = express.Router();
const {register, login} = require('../controllers/authController');

// 1. Ruta para registrarse: POST /api/auth/register
router.post('/register', register);

// 2. Ruta para iniciar sesión: POST /api/auth/login
router.post('/login', login);

module.exports = router;