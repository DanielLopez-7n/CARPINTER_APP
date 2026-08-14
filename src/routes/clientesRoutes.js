import express from 'express';
import {
  obtenerClientes,
  obtenerClientePorId,
  crearCliente,
  actualizarCliente,
  eliminarCliente
} from '../controllers/clientesController.js';

const router = express.Router();

// Rutas para manejar clientes
// - GET '/'       : lista todos los clientes
// - POST '/'      : crea un nuevo cliente (lee datos en req.body)
router.route('/')
  .get(obtenerClientes)
  .post(crearCliente);

// Rutas para operaciones sobre un cliente específico
// :id en la URL corresponde al identificador del cliente
// - GET '/:id'    : trae los datos del cliente con ese id
// - PUT '/:id'    : actualiza el cliente con los campos de req.body
// - DELETE '/:id' : elimina el cliente indicado por id
router.route('/:id')
  .get(obtenerClientePorId)
  .put(actualizarCliente)
  .delete(eliminarCliente);

export default router;