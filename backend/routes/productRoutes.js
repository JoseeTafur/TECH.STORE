const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const upload = require('../middleware/upload'); 
const { protect, admin } = require('../middleware/authMiddleware');

// Obtener productos (Público)
router.get('/', productController.getProducts);

// Crear producto (Protegido + Solo Admin)
router.post('/', protect, admin, upload.single('image'), productController.createProduct);

// Editar producto (Protegido + Solo Admin)
router.put('/:id', protect, admin, upload.single('image'), productController.updateProduct);

// Eliminar producto (Protegido + Solo Admin)
router.delete('/:id', protect, admin, productController.deleteProduct);

module.exports = router;