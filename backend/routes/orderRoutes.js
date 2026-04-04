const Order = require('../models/Order'); // Importa tu nuevo modelo
const Product = require('../models/Product'); // Para validar precios reales

app.post('/api/orders', async (req, res) => {
    try {
        const { items, cliente, envio, pago, userId } = req.body;

        // 1. RECALCULAR MONTOS (Seguridad de Ciclo 7)
        let subtotalCalculado = 0;
        const itemsProcesados = [];

        for (const item of items) {
            // Buscamos el producto real en la DB para validar el precio
            const productoReal = await Product.findById(item._id);
            if (!productoReal) continue;

            const subtotalItem = productoReal.precio * item.quantity;
            subtotalCalculado += subtotalItem;

            itemsProcesados.push({
                productId: productoReal._id,
                nombre: productoReal.nombre,
                cantidad: item.quantity,
                precioUnitario: productoReal.precio,
                subtotalItem: subtotalItem
            });
        }

        const igvCalculado = subtotalCalculado * 0.18;
        const costoEnvio = envio === 'domicilio' ? (subtotalCalculado > 5000 ? 0 : 50) : 0;
        const totalFinal = subtotalCalculado + igvCalculado + costoEnvio;

        // 2. CREAR EL OBJETO DE LA ORDEN
        const nuevaOrden = new Order({
            user: userId,
            items: itemsProcesados,
            cliente: {
                tipoDocumento: cliente.tipoDoc === '01' ? 'RUC' : 'DNI',
                numeroDocumento: cliente.numDoc,
                nombreCompleto: cliente.nombre,
                direccion: cliente.direccion
            },
            comprobante: {
                tipo: cliente.tipoDoc === '01' ? 'Factura' : 'Boleta',
                serie: cliente.tipoDoc === '01' ? 'F001' : 'B001',
                correlativo: Math.floor(Math.random() * 10000) // Simulación por ahora
            },
            montos: {
                subtotal: subtotalCalculado,
                igv: igvCalculado,
                totalAmount: totalFinal
            },
            metodoPago: pago.metodo,
            metodoEnvio: envio,
            status: 'Completado' // Como es simulación, lo marcamos como pagado
        });

        // 3. GUARDAR EN MONGODB
        const ordenGuardada = await nuevaOrden.save();

        console.log(`✅ Orden ${ordenGuardada._id} guardada exitosamente.`);

        res.status(201).json({
            success: true,
            message: "¡Compra realizada con éxito!",
            orderId: ordenGuardada._id,
            total: totalFinal
        });

    } catch (error) {
        console.error('❌ Error al procesar la orden:', error);
        res.status(500).json({ success: false, message: "Error interno al guardar la orden." });
    }
});