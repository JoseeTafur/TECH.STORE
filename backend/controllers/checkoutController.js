const axios = require('axios');

const emitirComprobante = async (req, res) => {
  const { cartItems, cliente, subtotal, igv, total } = req.body;

  const dataMiApi = {
    "claveSecreta": process.env.MIAPI_CLAVE_SECRETA,
    "comprobante": {
      "tipoOperacion": "0101",
      "tipoDoc": cliente.tipoDoc, 
      "serie": cliente.tipoDoc === '01' ? 'F001' : 'B001',
      "correlativo": Date.now().toString().slice(-6), 
      "fechaEmision": new Date().toISOString().split('T')[0],
      "tipoMoneda": "PEN",
      "total": total,
      "mtoIGV": igv,
      "mtoOperGravadas": subtotal,
      "totalTexto": `SON ${total.toFixed(2)} SOLES`
    },
    "cliente": {
      "tipoDoc": cliente.tipoDoc === '01' ? "6" : "1",
      "numDoc": cliente.numDoc,
      "rznSocial": cliente.nombre,
      "direccion": cliente.direccion || "Chiclayo, Lambayeque"
    },
    "items": cartItems.map(item => {
      const precioUnitario = item.precio; 
      const valorUnitario = precioUnitario / 1.18;
      const igvUnitario = precioUnitario - valorUnitario;

      return {
        "codProducto": item._id.substring(0, 5),
        "descripcion": `${item.marca} ${item.nombre}`,
        "cantidad": item.quantity,
        "mtoValorUnitario": valorUnitario,
        "mtoPrecioUnitario": precioUnitario,
        "mtoBaseIgv": valorUnitario * item.quantity,
        "igv": igvUnitario * item.quantity,
        "totalItem": precioUnitario * item.quantity,
        "codeAfect": "10", 
        "igvPorcent": 18
      };
    })
  };

  try {
    const response = await axios.post(`${process.env.MIAPI_BASE_URL}/emision`, dataMiApi, {
      headers: {
        'Authorization': `Bearer ${process.env.MIAPI_BEARER_TOKEN}`,
        'Accept': 'application/json'
      }
    });
    
    if (response.data.success) {
      return res.status(200).json({
        success: true,
        msg: "Venta procesada con éxito",
        links: response.data.links
      });
    }
    
    res.status(400).json({ success: false, error: response.data.message });
  } catch (error) {
    console.error("Error MiAPI:", error.response?.data || error.message);
    res.status(500).json({ error: "Falla en comunicación con el PSE" });
  }
};

module.exports = { emitirComprobante };