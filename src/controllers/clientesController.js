import { asyncHandler } from '../utils/asyncHandler.js';
import * as clientesService from '../services/clientesService.js';

export const obtenerClientes = asyncHandler(async (req, res) => {
  const clientes = await clientesService.getAllClientes();
  res.status(200).json({
    status: 'success',
    results: clientes.length,
    data: clientes
  });
});

export const obtenerClientePorId = asyncHandler(async (req, res) => {
  const cliente = await clientesService.getClienteById(req.params.id);
  res.status(200).json({
    status: 'success',
    data: cliente
  });
});

export const crearCliente = asyncHandler(async (req, res) => {
  const nuevoCliente = await clientesService.createCliente(req.body);
  res.status(201).json({
    status: 'success',
    message: 'Cliente creado correctamente',
    data: nuevoCliente
  });
});

export const actualizarCliente = asyncHandler(async (req, res) => {
  const clienteActualizado = await clientesService.updateCliente(req.params.id, req.body);
  res.status(200).json({
    status: 'success',
    message: 'Cliente actualizado correctamente',
    data: clienteActualizado
  });
});

export const eliminarCliente = asyncHandler(async (req, res) => {
  await clientesService.deleteCliente(req.params.id);
  res.status(200).json({
    status: 'success',
    message: 'Cliente eliminado correctamente'
  });
});