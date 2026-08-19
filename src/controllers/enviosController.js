import asyncHandler from '../utils/asyncHandler.js';
import * as enviosService from '../services/enviosService.js';

// Obtener los datos para llenar las listas desplegables del formulario
export const getDatosForm = asyncHandler(async (req, res) => {
  const datos = await enviosService.obtenerDatosFormulario();

  res.status(200).json({
    status: 'success',
    data: datos
  });
});

// Obtener todos los envíos registrados
export const obtenerEnvios = asyncHandler(async (req, res) => {
  const envios = await enviosService.obtenerEnvios();

  res.status(200).json({
    status: 'success',
    data: envios
  });
});

// Registrar un nuevo envío en la base de datos
export const crearEnvio = asyncHandler(async (req, res) => {
  const idNuevoEnvio = await enviosService.registrarEnvio(req.body);

  res.status(201).json({
    status: 'success',
    message: 'Envío registrado exitosamente',
    data: {
      id: idNuevoEnvio
    }
  });
});