const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { 
    updateUserProfile, 
    getUserProfile, 
    getUsers, 
    updateUserRole 
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

// Configuración de Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/profiles/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) cb(null, true);
        else cb(new Error('Solo se permiten imágenes'), false);
    }
});

// --- RUTAS DE USUARIO LOGUEADO ---
router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, upload.single('image'), updateUserProfile);

// --- RUTAS DE ADMINISTRACIÓN ---
router.route('/')
    .get(protect, admin, getUsers); 

router.route('/:id/role')
    .put(protect, admin, updateUserRole);

module.exports = router;