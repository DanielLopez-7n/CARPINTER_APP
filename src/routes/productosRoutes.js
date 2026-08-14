import express from 'express';
import {
  obtenerProductos,
  obtenerProductoPorId,
  crearProducto,
  actualizarProducto,
  eliminarProducto
} from '../controllers/productosController.js';

const router = express.Router();

// Rutas para manejar productos
// - GET '/'       : devuelve todos los productos
// - POST '/'      : crea un producto nuevo (datos en req.body)
router.route('/')
  .get(obtenerProductos)
  .post(crearProducto);

// Rutas para un producto específico (usa :id en la URL)
// - GET '/:id'    : obtiene un producto por su id
// - PUT '/:id'    : actualiza el producto con los datos recibidos
// - DELETE '/:id' : elimina el producto indicado
router.route('/:id')
  .get(obtenerProductoPorId)
  .put(actualizarProducto)
  .delete(eliminarProducto);

export default router;