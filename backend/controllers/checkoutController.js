const axios = require('axios');

const emitirComprobante = async (req, res) => {
  const { cliente, comprobante, cartItems } = req.body;
  // console.log(`Body: ${JSON.stringify(req.body, null, 2)} `);

  const dataMiApi = {
    "claveSecreta": process.env.MIAPI_SECRET_KEY,
    "comprobante": {
      "tipoOperacion": comprobante.tipoOperacion,
      "tipoDoc": comprobante.tipoDoc, 
      "serie": comprobante.serie,
      "correlativo": comprobante.correlativo,
      "fechaEmision": new Date().toISOString().split('T')[0],
      "horaEmision": new Date().toTimeString().split(' ')[0],
      "tipoMoneda": "PEN",
      "tipoPago": comprobante.tipoPago,
      "observacion": comprobante.observacion || "",
    },
    "cliente": {
      "codigoPais": "PE",
      "tipoDoc": cliente.numDoc.length === 11 ? "6" : "1",
      "numDoc": cliente.numDoc,
      "rznSocial": cliente.nombre,
      "direccion": cliente.direccion || "Chiclayo, Lambayeque"
    },
    "items": cartItems.map(item => {
      const precioUnitario = item.precio; 
      const valorUnitario = precioUnitario / 1.18;
      const igvUnitario = precioUnitario - valorUnitario;

      return {
        "codProducto": item.codProducto,
        "descripcion": `${item.marca} ${item.nombre}`,
        "unidad": "NIU",
        "cantidad": item.quantity,
        "mtoBaseIgv": valorUnitario * item.quantity,
        "mtoValorUnitario": valorUnitario,
        "mtoPrecioUnitario": precioUnitario,
        "codeAfect": "10", 
        "igvPorcent": 18,
        "igv": igvUnitario * item.quantity,
        // "totalItem": precioUnitario * item.quantity,
      };
    }),
  };

  // console.log(dataMiApi);

  try {
    const response = await axios.post('https://miapi.cloud/apifact/invoice/create', dataMiApi, {
      headers: {
        'Authorization': `Bearer ${process.env.MIAPI_BEARER_TOKEN}`,
        'Accept': 'application/json'
      }
    });

    const cleanJSON = (d) => {
      const firstBrace = d.indexOf("{");
      const lastBrace = d.lastIndexOf("}");

      if (firstBrace !== -1 && lastBrace !== -1) {
        const jsonString = d.slice(firstBrace, lastBrace + 1); // extrae solo el JSON
        try {
          const clean = JSON.parse(jsonString);
          return clean;
        } catch (err) {
          console.error("JSON inválido después de limpiar:", err);
        }
      } else {
        console.error("No se encontró JSON en la respuesta de MiAPI");
      }
    };

    const apiRes = cleanJSON(typeof response.data === "string" 
      ? response.data 
      : JSON.stringify(response.data));

      // console.log("Datos: ", apiRes.respuesta);
    

    if (apiRes) {
      return res.status(200).json({
        success: true,
        msg: "Venta procesada con éxito",
        data: {
          codigo: `${dataMiApi.comprobante.serie}-${dataMiApi.comprobante.correlativo.toString().padStart(8, "0")}`,
          fecha: `${dataMiApi.comprobante.fechaEmision} ${dataMiApi.comprobante.horaEmision}`,
          medioPago: dataMiApi.comprobante.tipoPago,
          cliente: {
            nombre: dataMiApi.cliente.rznSocial,
            documento: dataMiApi.cliente.numDoc,
            direccion: dataMiApi.cliente.direccion
          },
          links: {
            "xml-sin-firmar": apiRes.respuesta["xml-sin-firmar"],
            "xml-firmado": apiRes.respuesta["xml-firmado"],
            "pdf-a4": apiRes.respuesta["pdf-a4"],
            "pdf-ticket": apiRes.respuesta["pdf-ticket"],
          },
          situacion: "Canjeado"
        }
      });
    }
    
    res.status(400).json({ success: false, error: response.data.message });
  } catch (error) {
    console.error("Error MiAPI:", error.response?.data || error.message);
    res.status(500).json({ error: "Falla en comunicación con el PSE" });
  }
};

const msg = async (req, res) => {
  return res.status(200).json({msg: "Funciona"});
}

module.exports = { emitirComprobante, msg };