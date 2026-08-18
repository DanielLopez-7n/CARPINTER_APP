import asyncHandler from '../utils/asyncHandler.js';
import * as vendedoresService from '../services/vendedoresService.js';

// obtenerVendedores:
// - Devuelve todos los vendedores guardados.
// - No necesita datos del cliente.
// - Responde con la lista y la cantidad encontrada.
export const obtenerVendedores = asyncHandler(async (req, res) => {
  const vendedores = await vendedoresService.getAllVendedores();
  res.status(200).json({
    status: 'success',
    results: vendedores.length,
    data: vendedores
  });
});

// obtenerVendedorPorId:
// - Recibe el id en la URL.
// - Devuelve los datos de ese vendedor si existe, o un error si no existe.
export const obtenerVendedorPorId = asyncHandler(async (req, res) => {
  const vendedor = await vendedoresService.getVendedorById(req.params.id);
  res.status(200).json({
    status: 'success',
    data: vendedor
  });
});

// crearVendedor:
// - Recibe los datos del vendedor en el cuerpo de la petición.
// - Crea el vendedor y responde con sus datos y un mensaje de éxito.
export const crearVendedor = asyncHandler(async (req, res) => {
  const nuevoVendedor = await vendedoresService.createVendedor(req.body);
  res.status(201).json({
    status: 'success',
    message: 'Vendedor creado correctamente',
    data: nuevoVendedor
  });
});

// actualizarVendedor:
// - Recibe el id en la URL y los campos a cambiar en el cuerpo de la petición.
// - Actualiza el vendedor y responde con los datos enviados.
export const actualizarVendedor = asyncHandler(async (req, res) => {
  const vendedorActualizado = await vendedoresService.updateVendedor(req.params.id, req.body);
  res.status(200).json({
    status: 'success',
    message: 'Vendedor actualizado correctamente',
    data: vendedorActualizado
  });
});

// eliminarVendedor:
// - Recibe el id en la URL.
// - Borra el vendedor y responde con un mensaje que confirma la eliminación.
export const eliminarVendedor = asyncHandler(async (req, res) => {
  await vendedoresService.deleteVendedor(req.params.id);
  res.status(200).json({
    status: 'success',
    message: 'Vendedor eliminado correctamente'
  });
});