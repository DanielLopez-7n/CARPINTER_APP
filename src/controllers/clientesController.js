import { asyncHandler } from '../utils/asyncHandler.js';
import * as clientesService from '../services/clientesService.js';

// obtenerClientes:
// - Devuelve todos los clientes guardados.
// - No necesita datos del cliente.
// - Responde con la lista y la cantidad encontrada.
export const obtenerClientes = asyncHandler(async (req, res) => {
  const clientes = await clientesService.getAllClientes();
  res.status(200).json({
    status: 'success',
    results: clientes.length,
    data: clientes
  });
});

// obtenerClientePorId:
// - Recibe el id en la URL.
// - Devuelve los datos de ese cliente si existe, o un error si no existe.
export const obtenerClientePorId = asyncHandler(async (req, res) => {
  const cliente = await clientesService.getClienteById(req.params.id);
  res.status(200).json({
    status: 'success',
    data: cliente
  });
});

// crearCliente:
// - Recibe los datos del cliente en el cuerpo de la petición.
// - Crea el cliente y responde con sus datos y un mensaje de éxito.
export const crearCliente = asyncHandler(async (req, res) => {
  const nuevoCliente = await clientesService.createCliente(req.body);
  res.status(201).json({
    status: 'success',
    message: 'Cliente creado correctamente',
    data: nuevoCliente
  });
});

// actualizarCliente:
// - Recibe el id en la URL y los campos a cambiar en el cuerpo de la petición.
// - Actualiza el cliente y responde con los datos enviados.
export const actualizarCliente = asyncHandler(async (req, res) => {
  const clienteActualizado = await clientesService.updateCliente(req.params.id, req.body);
  res.status(200).json({
    status: 'success',
    message: 'Cliente actualizado correctamente',
    data: clienteActualizado
  });
});

// eliminarCliente:
// - Recibe el id en la URL.
// - Borra el cliente y responde con un mensaje que confirma la eliminación.
export const eliminarCliente = asyncHandler(async (req, res) => {
  await clientesService.deleteCliente(req.params.id);
  res.status(200).json({
    status: 'success',
    message: 'Cliente eliminado correctamente'
  });
});