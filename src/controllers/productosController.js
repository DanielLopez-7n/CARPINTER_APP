import { asyncHandler } from '../utils/asyncHandler.js';
import * as productosService from '../services/productosService.js';

// Trae todos los productos
// - No requiere datos en la petición.
// - Devuelve la lista de productos y cuántos hay.
export const obtenerProductos = asyncHandler(async (req, res) => {
  const productos = await productosService.getAllProductos();
  res.status(200).json({
    status: 'success',
    results: productos.length,
    data: productos
  });
});

// Trae un producto por su id
// - req.params.id: id del producto que se quiere ver.
// - Devuelve los datos de ese producto.
export const obtenerProductoPorId = asyncHandler(async (req, res) => {
  const producto = await productosService.getProductoById(req.params.id);
  res.status(200).json({
    status: 'success',
    data: producto
  });
});

// Crea un nuevo producto
// - req.body: datos del producto (nombre, precio, stock, etc.).
// - Devuelve el producto creado y un mensaje de confirmación.
export const crearProducto = asyncHandler(async (req, res) => {
  const nuevoProducto = await productosService.createProducto(req.body);
  res.status(201).json({
    status: 'success',
    message: 'Producto creado correctamente',
    data: nuevoProducto
  });
});

// Actualiza un producto existente
// - req.params.id: id del producto a actualizar.
// - req.body: campos a cambiar.
// - Devuelve el producto actualizado.
export const actualizarProducto = asyncHandler(async (req, res) => {
  const productoActualizado = await productosService.updateProducto(req.params.id, req.body);
  res.status(200).json({
    status: 'success',
    message: 'Producto actualizado correctamente',
    data: productoActualizado
  });
});

// Elimina un producto por su id
// - req.params.id: id del producto a eliminar.
// - Devuelve un mensaje que confirma la eliminación.
export const eliminarProducto = asyncHandler(async (req, res) => {
  await productosService.deleteProducto(req.params.id);
  res.status(200).json({
    status: 'success',
    message: 'Producto eliminado correctamente'
  });
});