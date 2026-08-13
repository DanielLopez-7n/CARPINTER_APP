import express from 'express';
import {
  obtenerProductos,
  obtenerProductoPorId,
  crearProducto,
  actualizarProducto,
  eliminarProducto
} from '../controllers/productosController.js';

const router = express.Router();

router.route('/')
  .get(obtenerProductos)
  .post(crearProducto);

router.route('/:id')
  .get(obtenerProductoPorId)
  .put(actualizarProducto)
  .delete(eliminarProducto);

export default router;