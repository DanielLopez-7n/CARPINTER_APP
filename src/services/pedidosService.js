import db from '../config/db.js';
import AppError from '../utils/AppError.js';

// Servicio para manejar la lógica de negocio relacionada con los pedidos
const pedidosService = {
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
            detalles
        } = datosPedido;
        // Validación básica de los datos del pedido
        if (!detalles || !Array.isArray(detalles) || detalles.length === 0) {
            throw new AppError('El pedido debe contener al menos un producto en el detalle', 400);
        }

        const connection = await db.getConnection();
        // Iniciar una transacción para asegurar la consistencia de los datos
        try {
            await connection.beginTransaction();

            const total_pedido = detalles.reduce((acc, item) => {
                return acc + (item.cantidad * item.precio_unitario);
            }, 0);

            const sqlCabecera = `
                INSERT INTO pedidos (
                    cliente_codigo, vendedor_codigo, cliente_documento, cliente_nombre,
                    cliente_direccion, cliente_ciudad, cliente_telefono, orden_compra,
                    forma_pago, total_pedido
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;
            // Ejecutar la inserción de la cabecera del pedido
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
            
            // Preparar la inserción de los detalles del pedido
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

            await connection.commit();

            return {
                id: pedidoId,
                total_pedido,
                mensaje: 'Pedido creado exitosamente con su detalle'
            };

        } catch (error) {
            await connection.rollback();
            throw new AppError(`Error al procesar el pedido: ${error.message}`, 500);
        } finally {
            connection.release();
        }
    },
    // Obtener todos los pedidos
    obtenerTodos: async () => {
        const sql = `
            SELECT id, cliente_nombre, cliente_documento, total_pedido, estado, fecha 
            FROM pedidos 
            ORDER BY fecha DESC
        `;
        const [filas] = await db.query(sql);
        return filas;
    },
    // Obtener un pedido por su ID, incluyendo su detalle
    obtenerPorId: async (id) => {
        const sqlCabecera = `SELECT * FROM pedidos WHERE id = ?`;
        const [cabecera] = await db.query(sqlCabecera, [id]);

        if (cabecera.length === 0) {
            throw new AppError('El pedido solicitado no existe', 404);
        }

        const sqlDetalle = `SELECT * FROM pedidos_detalle WHERE pedido_id = ?`;
        const [detalles] = await db.query(sqlDetalle, [id]);

        return {
            ...cabecera[0],
            detalles
        };
    }
};

export default pedidosService;