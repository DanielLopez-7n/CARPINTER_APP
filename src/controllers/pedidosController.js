const pedidosService = require('../services/pedidosService');
const asyncHandler = require('../utils/asyncHandler');

const pedidosController = {
    // 1. Crear un pedido completo (Cabecera + Detalle)
    crearPedido: asyncHandler(async (req, res) => {
        const nuevoPedido = await pedidosService.crearPedido(req.body);
        res.status(201).json({
            status: 'success',
            data: nuevoPedido
        });
    }),

    // 2. Obtener el listado general de pedidos
    obtenerTodos: asyncHandler(async (req, res) => {
        const pedidos = await pedidosService.obtenerTodos();
        res.status(200).json({
            status: 'success',
            results: pedidos.length,
            data: pedidos
        });
    }),

    // 3. Obtener un pedido específico por ID con sus detalles
    obtenerPorId: asyncHandler(async (req, res) => {
        const { id } = req.params;
        const pedido = await pedidosService.obtenerPorId(id);
        res.status(200).json({
            status: 'success',
            data: pedido
        });
    })
};

module.exports = pedidosController;