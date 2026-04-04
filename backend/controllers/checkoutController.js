// En tu backend (Node.js + Express)
const axios = require('axios');

const emitirComprobante = async (req, res) => {
  const { cartItems, cliente, shipping, subtotal, igv, total } = req.body;
  
  // Tu llave de MiAPI Cloud (¡Mantenla en un archivo .env!)
  const MIAPI_TOKEN = "miap-7ci-u47-raa"; 

  const dataMiApi = {
    "claveSecreta": MIAPI_TOKEN,
    "comprobante": {
      "tipoOperacion": "0101",
      "tipoDoc": cliente.tipoDoc, // '01' Factura o '03' Boleta
      "serie": cliente.tipoDoc === '01' ? 'F001' : 'B001',
      "correlativo": Math.floor(Math.random() * 100000).toString(), // Aquí deberías usar un contador real de tu DB
      "fechaEmision": new Date().toISOString().split('T')[0],
      "tipoMoneda": "PEN",
      "total": total,
      "mtoIGV": igv,
      "mtoOperGravadas": subtotal,
      "totalTexto": `SON ${total.toFixed(2)} SOLES`
    },
    "cliente": {
      "tipoDoc": cliente.numDoc.length === 11 ? "6" : "1", // 6 RUC, 1 DNI
      "numDoc": cliente.numDoc,
      "rznSocial": cliente.nombre,
      "direccion": cliente.direccion || "Chiclayo, Lambayeque"
    },
    "items": cartItems.map(item => ({
      "codProducto": item._id.substring(0, 5),
      "descripcion": `${item.marca} ${item.nombre}`,
      "cantidad": item.quantity,
      "mtoValorUnitario": item.precio,
      "mtoPrecioUnitario": item.precio * 1.18, // Precio con IGV
      "mtoBaseIgv": item.precio * item.quantity,
      "igv": item.precio * 0.18 * item.quantity,
      "totalItem": (item.precio * 1.18) * item.quantity,
      "codeAfect": 1000, // Código para IGV Gravado
      "igvPorcent": 18
    }))
  };

  try {
    const response = await axios.post('https://miapi.cloud/api/v1/emision', dataMiApi);
    
    if (response.data.success) {
      return res.status(200).json({
        msg: "Venta procesada con éxito",
        pdf: response.data.links.pdf,
        xml: response.data.links.xml,
        cdr: response.data.links.cdr
      });
    }
    
    res.status(400).json({ error: "Error en SUNAT", detalle: response.data.message });
  } catch (error) {
    console.error("Error MiAPI:", error.response?.data || error.message);
    res.status(500).json({ error: "Error interno en el servidor de facturación" });
  }
};