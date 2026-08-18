import pedidosService from '../services/pedidosService.js';
import asyncHandler from '../utils/asyncHandler.js';

// Controlador para manejar las operaciones relacionadas con los pedidos
const pedidosController = {
    crearPedido: asyncHandler(async (req, res) => {
        const nuevoPedido = await pedidosService.crearPedido(req.body);
        res.status(201).json({
            status: 'success',
            data: nuevoPedido
        });
    }),

    // Obtener todos los pedidos
    obtenerTodos: asyncHandler(async (req, res) => {
        const pedidos = await pedidosService.obtenerTodos();
        res.status(200).json({
            status: 'success',
            results: pedidos.length,
            data: pedidos
        });
    }),

    // Obtener un pedido por su ID
    obtenerPorId: asyncHandler(async (req, res) => {
        const { id } = req.params;
        const pedido = await pedidosService.obtenerPorId(id);
        res.status(200).json({
            status: 'success',
            data: pedido
        });
    })
};

export default pedidosController;