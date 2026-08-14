import { asyncHandler } from '../utils/asyncHandler.js';
import * as vendedoresService from '../services/vendedoresService.js';

// Trae todos los vendedores
// - No necesita datos en la ruta.
// - Devuelve la lista de vendedores y el total.
export const obtenerVendedores = asyncHandler(async (req, res) => {
  const vendedores = await vendedoresService.getAllVendedores();
  res.status(200).json({
    status: 'success',
    results: vendedores.length,
    data: vendedores
  });
});

// Trae un vendedor por su id
// - req.params.id: id del vendedor.
// - Devuelve los datos de ese vendedor.
export const obtenerVendedorPorId = asyncHandler(async (req, res) => {
  const vendedor = await vendedoresService.getVendedorById(req.params.id);
  res.status(200).json({
    status: 'success',
    data: vendedor
  });
});

// Crea un nuevo vendedor
// - req.body: datos del vendedor (nombre, contacto, etc.).
// - Devuelve el vendedor creado y un mensaje de confirmación.
export const crearVendedor = asyncHandler(async (req, res) => {
  const nuevoVendedor = await vendedoresService.createVendedor(req.body);
  res.status(201).json({
    status: 'success',
    message: 'Vendedor creado correctamente',
    data: nuevoVendedor
  });
});

// Actualiza un vendedor existente
// - req.params.id: id del vendedor a actualizar.
// - req.body: campos a modificar.
// - Devuelve el vendedor actualizado.
export const actualizarVendedor = asyncHandler(async (req, res) => {
  const vendedorActualizado = await vendedoresService.updateVendedor(req.params.id, req.body);
  res.status(200).json({
    status: 'success',
    message: 'Vendedor actualizado correctamente',
    data: vendedorActualizado
  });
});

// Elimina un vendedor por su id
// - req.params.id: id del vendedor a eliminar.
// - Devuelve un mensaje que confirma la eliminación.
export const eliminarVendedor = asyncHandler(async (req, res) => {
  await vendedoresService.deleteVendedor(req.params.id);
  res.status(200).json({
    status: 'success',
    message: 'Vendedor eliminado correctamente'
  });
});