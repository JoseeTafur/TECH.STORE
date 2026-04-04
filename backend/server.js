const axios = require('axios');
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const fs = require('fs');

dotenv.config();

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
app.use(express.json())

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('Conecto con la base de datos MongoDB.'))
.catch((err)=> console.log('Error al conectar con la base de datos MongoDB.'));

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/api/consultar/:tipo/:numero', async (req, res) => {
    try {
        const { tipo, numero } = req.params;
        const token = process.env.MIAPI_TOKEN; // miap-7ci-u47-raa

        // URL limpia sin parámetros
        const url = `https://miapi.cloud/v1/${tipo}/${numero}`;

        console.log(`📡 Consultando ${tipo} para: ${numero}`);

        const response = await axios.get(url, {
    headers: {
        // Probamos enviando el token directamente si el Bearer falla
        'Authorization': token, 
        'Accept': 'application/json',
        'User-Agent': 'Axios/1.6.0' // Algunos servidores bloquean peticiones sin User-Agent
    }
});
        
        console.log(`✅ ¡Éxito! Datos de ${numero} recibidos.`);
        res.json(response.data);

    } catch (error) {
        // Log para ver si el error cambia ahora
        console.error('❌ Error en el Proxy:', error.response?.data || error.message);
        
        res.status(error.response?.status || 500).json({ 
            success: false, 
            message: 'Error en la autenticación con MiAPI Cloud',
            details: error.response?.data
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>{
    console.log(`Server ejecutandose en: http://localhost:${PORT}`);
});