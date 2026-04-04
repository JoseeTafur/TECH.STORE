const mongoose = require('mongoose');
const Product = require('./models/Product'); // Ajusta la ruta a tu modelo

// 🔗 CAMBIA ESTO por tu cadena de conexión real de MongoDB
const MONGO_URI = 'mongodb://localhost:27017/tu_base_de_datos'; 

const products = [
  {
    nombre: "MacBook Pro 14\" M3 Max",
    marca: "Apple",
    categoria: "Laptops",
    precio: 14999.00,
    stock: 5,
    descripcion: "Chip M3 Max, 36GB RAM Uni, 1TB SSD, Pantalla Liquid Retina XDR 120Hz.",
    imagenUrl: "" // Luego subes las fotos desde el Admin
  },
  {
    nombre: "GeForce RTX 4090 Gaming OC",
    marca: "Gigabyte",
    categoria: "Tarjetas de Video (GPU)",
    precio: 8450.00,
    stock: 3,
    descripcion: "24GB GDDR6X, DLSS 3.5, Sistema de enfriamiento Windforce, RGB Fusion.",
    imagenUrl: ""
  },
  {
    nombre: "Ryzen 9 7950X3D",
    marca: "AMD",
    categoria: "Procesadores (CPU)",
    precio: 2890.00,
    stock: 10,
    descripcion: "16 núcleos, 32 hilos, 144MB Caché L3 con tecnología 3D V-Cache. Socket AM5.",
    imagenUrl: ""
  },
  {
    nombre: "Samsung Odyssey Neo G9 49\"",
    marca: "Samsung",
    categoria: "Monitores",
    precio: 6150.00,
    stock: 2,
    descripcion: "Curvatura 1000R, Dual QHD, Quantum Mini LED, 240Hz, 1ms respuesta.",
    imagenUrl: ""
  },
  {
    nombre: "Logitech G Pro X Superlight 2",
    marca: "Logitech",
    categoria: "Periféricos",
    precio: 590.00,
    stock: 25,
    descripcion: "Sensor HERO 2, 32k DPI, 60g de peso, Interruptores híbridos LIGHTFORCE.",
    imagenUrl: ""
  }
  // Puedes añadir aquí todos los demás de la lista anterior...
];

const seedDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Conexión exitosa para el sembrado.");

    // Opcional: Limpiar la colección antes de subir (CUIDADO: Borra lo anterior)
    // await Product.deleteMany({}); 

    await Product.insertMany(products);
    console.log("🚀 ¡Productos insertados correctamente en MongoDB!");
    
    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Error al sembrar:", error);
  }
};

seedDB();