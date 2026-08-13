import { asyncHandler } from '../utils/asyncHandler.js';
import * as productosService from '../services/productosService.js';

export const obtenerProductos = asyncHandler(async (req, res) => {
  const productos = await productosService.getAllProductos();
  res.status(200).json({
    status: 'success',
    results: productos.length,
    data: productos
  });
});

export const obtenerProductoPorId = asyncHandler(async (req, res) => {
  const producto = await productosService.getProductoById(req.params.id);
  res.status(200).json({
    status: 'success',
    data: producto
  });
});

export const crearProducto = asyncHandler(async (req, res) => {
  const nuevoProducto = await productosService.createProducto(req.body);
  res.status(201).json({
    status: 'success',
    message: 'Producto creado correctamente',
    data: nuevoProducto
  });
});

export const actualizarProducto = asyncHandler(async (req, res) => {
  const productoActualizado = await productosService.updateProducto(req.params.id, req.body);
  res.status(200).json({
    status: 'success',
    message: 'Producto actualizado correctamente',
    data: productoActualizado
  });
});

export const eliminarProducto = asyncHandler(async (req, res) => {
  await productosService.deleteProducto(req.params.id);
  res.status(200).json({
    status: 'success',
    message: 'Producto eliminado correctamente'
  });
});