const axios = require('axios');
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

// Importación de rutas originales
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
// Nueva ruta para evitar el desorden en server.js
const consultarRoutes = require('./routes/consultarRoutes'); 

dotenv.config();

// Lógica de carpetas (Se mantiene intacta como pediste)
const uploadPath = path.join(__dirname, 'uploads/profiles');
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
    console.log('📁 Directorio de "uploads/profiles" creado automáticamente.');
}

const productUploadPath = path.join(__dirname, 'uploads/products');
if (!fs.existsSync(productUploadPath)) {
    fs.mkdirSync(productUploadPath, { recursive: true });
    console.log('📁 Directorio de "uploads/products" creado.');
}

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('✅ Conectó con la base de datos MongoDB.'))
.catch((err)=> console.log('❌ Error al conectar con MongoDB:', err));

// Registro de rutas
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
// Registramos la nueva ruta de consulta
app.use('/api/consultar', consultarRoutes); 

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>{
    console.log(`🚀 Server ejecutándose en: http://localhost:${PORT}`);
});