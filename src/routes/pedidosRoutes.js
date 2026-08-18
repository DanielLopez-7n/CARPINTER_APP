import express from 'express';
import pedidosController from '../controllers/pedidosController.js';

const router = express.Router();

// Rutas para Pedidos
router.route('/')
    .post(pedidosController.crearPedido)
    .get(pedidosController.obtenerTodos);
// Rutas para Pedidos por ID
router.route('/:id')
    .get(pedidosController.obtenerPorId);

export default router;