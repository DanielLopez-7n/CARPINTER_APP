import asyncHandler from '../utils/asyncHandler.js';
import * as productosService from '../services/productosService.js';

// obtenerProductos:
// - Devuelve todos los productos guardados.
// - No necesita datos del cliente (solo se llama al servidor).
// - Responde con la lista y la cantidad encontrada.
export const obtenerProductos = asyncHandler(async (req, res) => {
  const productos = await productosService.getAllProductos();
  res.status(200).json({
    status: 'success',
    results: productos.length,
    data: productos
  });
});

// obtenerProductoPorId:
// - Recibe el id en la URL (por ejemplo /api/productos/123).
// - Devuelve los datos de ese producto si existe, o un error si no existe.
export const obtenerProductoPorId = asyncHandler(async (req, res) => {
  const producto = await productosService.getProductoById(req.params.id);
  res.status(200).json({
    status: 'success',
    data: producto
  });
});

// crearProducto:
// - Recibe los datos del nuevo producto en el cuerpo de la petición.
// - Crea el producto y responde con sus datos y un mensaje de éxito.
export const crearProducto = asyncHandler(async (req, res) => {
  const nuevoProducto = await productosService.createProducto(req.body);
  res.status(201).json({
    status: 'success',
    message: 'Producto creado correctamente',
    data: nuevoProducto
  });
});

// actualizarProducto:
// - Recibe el id en la URL y los campos a cambiar en el cuerpo de la petición.
// - Actualiza esos datos y responde con lo que se envió.
export const actualizarProducto = asyncHandler(async (req, res) => {
  const productoActualizado = await productosService.updateProducto(req.params.id, req.body);
  res.status(200).json({
    status: 'success',
    message: 'Producto actualizado correctamente',
    data: productoActualizado
  });
});

// eliminarProducto:
// - Recibe el id en la URL.
// - Borra el producto y responde con un mensaje que confirma la eliminación.
export const eliminarProducto = asyncHandler(async (req, res) => {
  await productosService.deleteProducto(req.params.id);
  res.status(200).json({
    status: 'success',
    message: 'Producto eliminado correctamente'
  });
});