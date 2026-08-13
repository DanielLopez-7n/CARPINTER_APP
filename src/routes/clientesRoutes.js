import express from 'express';
import {
  obtenerClientes,
  obtenerClientePorId,
  crearCliente,
  actualizarCliente,
  eliminarCliente
} from '../controllers/clientesController.js';

const router = express.Router();

router.route('/')
  .get(obtenerClientes)
  .post(crearCliente);

router.route('/:id')
  .get(obtenerClientePorId)
  .put(actualizarCliente)
  .delete(eliminarCliente);

export default router;