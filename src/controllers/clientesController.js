import { asyncHandler } from '../utils/asyncHandler.js';
import * as clientesService from '../services/clientesService.js';

// Trae todos los clientes
// - No necesita datos especiales en la petición.
// - Devuelve un listado de clientes y cuántos hay.
export const obtenerClientes = asyncHandler(async (req, res) => {
  const clientes = await clientesService.getAllClientes();
  res.status(200).json({
    status: 'success',
    results: clientes.length,
    data: clientes
  });
});

// Trae un solo cliente por su id
// - req.params.id: id del cliente que se busca.
// - Devuelve los datos de ese cliente si existe.
export const obtenerClientePorId = asyncHandler(async (req, res) => {
  const cliente = await clientesService.getClienteById(req.params.id);
  res.status(200).json({
    status: 'success',
    data: cliente
  });
});

// Crea un nuevo cliente
// - req.body: objeto con los datos del cliente (nombre, contacto, etc.).
// - Devuelve el cliente recién creado y un mensaje de confirmación.
export const crearCliente = asyncHandler(async (req, res) => {
  const nuevoCliente = await clientesService.createCliente(req.body);
  res.status(201).json({
    status: 'success',
    message: 'Cliente creado correctamente',
    data: nuevoCliente
  });
});

// Actualiza los datos de un cliente existente
// - req.params.id: id del cliente a actualizar.
// - req.body: campos a modificar.
// - Devuelve el cliente ya actualizado.
export const actualizarCliente = asyncHandler(async (req, res) => {
  const clienteActualizado = await clientesService.updateCliente(req.params.id, req.body);
  res.status(200).json({
    status: 'success',
    message: 'Cliente actualizado correctamente',
    data: clienteActualizado
  });
});

// Elimina un cliente por su id
// - req.params.id: id del cliente a eliminar.
// - Devuelve un mensaje que confirma la eliminación.
export const eliminarCliente = asyncHandler(async (req, res) => {
  await clientesService.deleteCliente(req.params.id);
  res.status(200).json({
    status: 'success',
    message: 'Cliente eliminado correctamente'
  });
});