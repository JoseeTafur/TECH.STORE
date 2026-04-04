const axios = require('axios');

const consultarDocumento = async (req, res) => {
  const { tipo, num } = req.params;
  const token = process.env.MIAPI_BEARER_TOKEN.trim();

  try {
    // 📡 La URL exacta según tu imagen: https://miapi.cloud/v1/dni/60812709
    const url = `${process.env.MIAPI_BASE_URL}/${tipo}/${num}`;
    
    console.log(`📡 Consultando Plan Básico (GET) en: ${url}`);

    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });

    // Según tu captura, la respuesta trae { success: true, datos: {...} }
    if (response.data.success) {
      return res.status(200).json({
        success: true,
        data: response.data.datos // 👈 Enviamos solo el contenido de 'datos' al frontend
      });
    } else {
      return res.status(404).json({ success: false, message: "No se encontraron resultados" });
    }

  } catch (error) {
    console.error("❌ Error en MiAPI Cloud:");
    console.error(error.response?.data || error.message);
    
    res.status(error.response?.status || 500).json({
      success: false,
      message: "Error del servidor de MiAPI Cloud",
      details: error.response?.data
    });
  }
};

module.exports = { consultarDocumento };