import { Router } from 'express';
import { 
    obtenerProductos, 
    obtenerProductoPorId, 
    crearProducto,
    actualizarProducto,
    eliminarProducto
} from '../controllers/productos.controller.js';

const router = Router();

// Definición del CRUD completo
router.get('/', obtenerProductos);           // Leer todos
router.get('/:id', obtenerProductoPorId);     // Leer uno
router.post('/', crearProducto);             // Crear
router.put('/:id', actualizarProducto);       // Actualizar
router.delete('/:id', eliminarProducto);     // Eliminar

export default router;