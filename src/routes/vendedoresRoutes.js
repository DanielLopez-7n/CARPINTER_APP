import { Router } from 'express';
import {
  obtenerVendedores,
  obtenerVendedorPorId,
  crearVendedor,
  actualizarVendedor,
  eliminarVendedor
} from '../controllers/vendedoresController.js';

const router = Router();

// Rutas para manejar vendedores
// - GET '/'       : lista todos los vendedores
// - GET '/:id'    : obtiene el vendedor con ese id
// - POST '/'      : crea un nuevo vendedor (datos en req.body)
// - PUT '/:id'    : actualiza el vendedor indicado
// - DELETE '/:id' : elimina el vendedor indicado
router.get('/', obtenerVendedores);
router.get('/:id', obtenerVendedorPorId);
router.post('/', crearVendedor);
router.put('/:id', actualizarVendedor);
router.delete('/:id', eliminarVendedor);

export default router;