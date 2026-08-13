import { Router } from 'express';
import {
  obtenerVendedores,
  obtenerVendedorPorId,
  crearVendedor,
  actualizarVendedor,
  eliminarVendedor
} from '../controllers/vendedoresController.js';

const router = Router();

// Rutas de Vendedores
router.get('/', obtenerVendedores);
router.get('/:id', obtenerVendedorPorId);
router.post('/', crearVendedor);
router.put('/:id', actualizarVendedor);
router.delete('/:id', eliminarVendedor);

export default router;