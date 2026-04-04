const Product = require('../models/Product');

// GET: Obtener todos los productos
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener productos', error: error.message });
  }
};

// POST: Crear producto con imagen y especificaciones
exports.createProduct = async (req, res) => {
  try {
    const { nombre, descripcion, precio, stock, categoria, marca, especificaciones } = req.body;

    let imagenUrl = '';
    if (req.file) {
      // Guardamos en la subcarpeta de productos
      imagenUrl = `/uploads/products/${req.file.filename}`;
    }

    const nuevoProducto = new Product({
      nombre,
      descripcion,
      precio: Number(precio),
      stock: Number(stock),
      categoria,
      marca,
      imagenUrl,
      especificaciones: (especificaciones && especificaciones !== "undefined") 
    ? JSON.parse(especificaciones) 
    : {}
    });

    const productoGuardado = await nuevoProducto.save();
    res.status(201).json(productoGuardado);
  } catch (error) {
    console.error('❌ Error en POST:', error.message);
    res.status(400).json({ message: 'Error al crear', error: error.message });
  }
};

// PUT: Actualizar producto
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    let updateData = { ...req.body };

    if (req.file) {
      updateData.imagenUrl = `/uploads/products/${req.file.filename}`;
    }

    if (updateData.precio) updateData.precio = Number(updateData.precio);
    if (updateData.stock) updateData.stock = Number(updateData.stock);
    if (updateData.especificaciones) updateData.especificaciones = JSON.parse(updateData.especificaciones);

    const productoActualizado = await Product.findByIdAndUpdate(id, updateData, { new: true });
    
    if (!productoActualizado) return res.status(404).json({ message: 'Producto no encontrado' });
    
    res.json(productoActualizado);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar', error: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ msg: 'Producto no encontrado en la DB' });
        }
        res.json({ msg: 'Producto eliminado correctamente' });
    } catch (err) {
        res.status(500).send('Error del servidor');
    }
};