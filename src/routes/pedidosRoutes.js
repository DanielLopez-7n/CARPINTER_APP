const express = require('express');
const router = express.Router();
const pedidosController = require('../controllers/pedidosController');

// Rutas base: /api/pedidos
router.route('/')
    .post(pedidosController.crearPedido)
    .get(pedidosController.obtenerTodos);

// Rutas con parámetro: /api/pedidos/:id
router.route('/:id')
    .get(pedidosController.obtenerPorId);

module.exports = router;