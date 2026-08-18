const db = require('../config/db'); // Importa la conexión a MySQL
const AppError = require('../utils/AppError');

const pedidosService = {

    // =======================================================
    // 1. CREAR UN NUEVO PEDIDO (CABECERA + DETALLE)
    // =======================================================
    crearPedido: async (datosPedido) => {
        const {
            cliente_codigo,
            vendedor_codigo,
            cliente_documento,
            cliente_nombre,
            cliente_direccion,
            cliente_ciudad,
            cliente_telefono,
            orden_compra,
            forma_pago,
            detalles // Arreglo con los productos [{ producto_id, producto_codigo, producto_articulo, cantidad, precio_unitario }]
        } = datosPedido;

        // Validar que el pedido contenga al menos un producto
        if (!detalles || !Array.isArray(detalles) || detalles.length === 0) {
            throw new AppError('El pedido debe contener al menos un producto en el detalle', 400);
        }

        // 1. Obtenemos una conexión individual del pool para la Transacción
        const connection = await db.getConnection();

        try {
            // 2. Iniciar la Transacción
            await connection.beginTransaction();

            // 3. Calcular el total acumulado del pedido
            const total_pedido = detalles.reduce((acc, item) => {
                return acc + (item.cantidad * item.precio_unitario);
            }, 0);

            // 4. Insertar la Cabecera del Pedido
            const sqlCabecera = `
                INSERT INTO pedidos (
                    cliente_codigo, vendedor_codigo, cliente_documento, cliente_nombre,
                    cliente_direccion, cliente_ciudad, cliente_telefono, orden_compra,
                    forma_pago, total_pedido
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

            const [resultCabecera] = await connection.execute(sqlCabecera, [
                cliente_codigo,
                vendedor_codigo,
                cliente_documento,
                cliente_nombre,
                cliente_direccion || null,
                cliente_ciudad || null,
                cliente_telefono || null,
                orden_compra || null,
                forma_pago || 'EFECTIVO',
                total_pedido
            ]);

            const pedidoId = resultCabecera.insertId;

            // 5. Insertar cada producto en 'pedidos_detalle'
            const sqlDetalle = `
                INSERT INTO pedidos_detalle (
                    pedido_id, producto_id, producto_codigo, producto_articulo, cantidad, precio_unitario
                ) VALUES (?, ?, ?, ?, ?, ?)
            `;

            for (const item of detalles) {
                await connection.execute(sqlDetalle, [
                    pedidoId,
                    item.producto_id,
                    item.producto_codigo,
                    item.producto_articulo,
                    item.cantidad,
                    item.precio_unitario
                ]);
            }

            // 6. Si todo salió bien, confirmamos los cambios en la BD
            await connection.commit();

            return {
                id: pedidoId,
                total_pedido,
                mensaje: 'Pedido creado exitosamente con su detalle'
            };

        } catch (error) {
            // 7. Si algo falla, revertimos absolutamente todos los cambios
            await connection.rollback();
            throw new AppError(`Error al procesar el pedido: ${error.message}`, 500);
        } finally {
            // 8. Siempre liberamos la conexión de vuelta al pool
            connection.release();
        }
    },

    // =======================================================
    // 2. OBTENER TODOS LOS PEDIDOS (LISTADO GENERAL)
    // =======================================================
    obtenerTodos: async () => {
        const sql = `
            SELECT id, cliente_nombre, cliente_documento, total_pedido, estado, fecha 
            FROM pedidos 
            ORDER BY fecha DESC
        `;
        const [filas] = await db.query(sql);
        return filas;
    },

    // =======================================================
    // 3. OBTENER UN PEDIDO COMPLETO POR ID (CABECERA + DETALLES)
    // =======================================================
    obtenerPorId: async (id) => {
        // Consulta Cabecera
        const sqlCabecera = `SELECT * FROM pedidos WHERE id = ?`;
        const [cabecera] = await db.query(sqlCabecera, [id]);

        if (cabecera.length === 0) {
            throw new AppError('El pedido solicitado no existe', 404);
        }

        // Consulta Detalles
        const sqlDetalle = `SELECT * FROM pedidos_detalle WHERE pedido_id = ?`;
        const [detalles] = await db.query(sqlDetalle, [id]);

        return {
            ...cabecera[0],
            detalles
        };
    }
};

module.exports = pedidosService;