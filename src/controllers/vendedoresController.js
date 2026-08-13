import { asyncHandler } from '../utils/asyncHandler.js';
import * as vendedoresService from '../services/vendedoresService.js';

export const obtenerVendedores = asyncHandler(async (req, res) => {
  const vendedores = await vendedoresService.getAllVendedores();
  res.status(200).json({
    status: 'success',
    results: vendedores.length,
    data: vendedores
  });
});

export const obtenerVendedorPorId = asyncHandler(async (req, res) => {
  const vendedor = await vendedoresService.getVendedorById(req.params.id);
  res.status(200).json({
    status: 'success',
    data: vendedor
  });
});

export const crearVendedor = asyncHandler(async (req, res) => {
  const nuevoVendedor = await vendedoresService.createVendedor(req.body);
  res.status(201).json({
    status: 'success',
    message: 'Vendedor creado correctamente',
    data: nuevoVendedor
  });
});

export const actualizarVendedor = asyncHandler(async (req, res) => {
  const vendedorActualizado = await vendedoresService.updateVendedor(req.params.id, req.body);
  res.status(200).json({
    status: 'success',
    message: 'Vendedor actualizado correctamente',
    data: vendedorActualizado
  });
});

export const eliminarVendedor = asyncHandler(async (req, res) => {
  await vendedoresService.deleteVendedor(req.params.id);
  res.status(200).json({
    status: 'success',
    message: 'Vendedor eliminado correctamente'
  });
});