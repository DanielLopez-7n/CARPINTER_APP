import db from '../config/db.js';
import AppError from '../utils/AppError.js';

// Servicio para obtener los clientes y transportadoras que llenan el formulario
export const obtenerDatosFormulario = async () => {
  const [clientes] = await db.query('SELECT id, nombre FROM clientes ORDER BY nombre ASC');
  const [transportadoras] = await db.query('SELECT id, nombre FROM transportadoras ORDER BY nombre ASC');

  return { clientes, transportadoras };
};

// Servicio para insertar un nuevo envío en la base de datos
export const registrarEnvio = async (datos) => {
  const {
    fecha_envio,
    fecha,
    id_cliente,
    cliente_id,
    numero_factura,
    num_factura,
    numero_guia = null,
    unidades,
    detalle_unidades,
    peso_kg,
    peso,
    valor_factura,
    ciudad_destino,
    ciudad,
    departamento_destino,
    departamento,
    id_transportadora,
    transportadora_id,
    valor_flete,
    estado_envio = 'Pendiente'
  } = datos;

  // Normalizamos las variables para aceptar la nomenclatura exacta de la BD
  const fechaFinal = fecha_envio || fecha;
  const clienteIdFinal = id_cliente || cliente_id;
  const numFacturaFinal = numero_factura || num_factura;
  const pesoFinal = peso_kg || peso;
  const ciudadFinal = ciudad_destino || ciudad;
  const departamentoFinal = departamento_destino || departamento;
  const transportadoraIdFinal = id_transportadora || transportadora_id;

  // Validación básica de campos obligatorios
  if (!clienteIdFinal || !numFacturaFinal || !transportadoraIdFinal) {
    throw new AppError('Los campos cliente, número de factura y transportadora son obligatorios', 400);
  }

  // Consulta INSERT con las columnas exactas de la tabla envios
  const query = `
    INSERT INTO envios (
      fecha_envio,
      id_cliente,
      numero_factura,
      numero_guia,
      unidades,
      detalle_unidades,
      peso_kg,
      valor_factura,
      ciudad_destino,
      departamento_destino,
      id_transportadora,
      valor_flete,
      estado_envio
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const [result] = await db.query(query, [
    fechaFinal,
    clienteIdFinal,
    numFacturaFinal,
    numero_guia,
    unidades,
    detalle_unidades,
    pesoFinal,
    valor_factura,
    ciudadFinal,
    departamentoFinal,
    transportadoraIdFinal,
    valor_flete,
    estado_envio
  ]);

  return result.insertId;
};

// Servicio para consultar todos los envíos registrados
export const obtenerEnvios = async () => {
  const query = `
    SELECT * FROM envios 
    ORDER BY id_envio DESC
  `;

  const [envios] = await db.query(query);
  return envios;
};