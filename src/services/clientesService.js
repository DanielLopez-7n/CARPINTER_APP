import pool from '../config/db.js';
import { AppError } from '../utils/AppError.js';

export const getAllClientes = async () => {
  const [rows] = await pool.query('SELECT * FROM clientes ORDER BY codigo DESC');
  return rows;
};

export const getClienteById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM clientes WHERE codigo = ?', [id]);
  if (rows.length === 0) {
    throw new AppError(`No se encontró ningún cliente con el código: ${id}`, 404);
  }
  return rows[0];
};

export const createCliente = async (clienteData) => {
  const { cliente, identificacion, e_mail, telefono, celulares, direccion, nombre_comercial } = clienteData;

  if (!cliente) {
    throw new AppError('El campo "cliente" (nombre) es obligatorio.', 400);
  }

  const [result] = await pool.query(
    `INSERT INTO clientes (cliente, identificacion, e_mail, telefono, celulares, direccion, nombre_comercial) 
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      cliente,
      identificacion || null,
      e_mail || null,
      telefono || null,
      celulares || null,
      direccion || null,
      nombre_comercial || null
    ]
  );

  return { codigo: result.insertId, ...clienteData };
};

export const updateCliente = async (id, clienteData) => {
  const { cliente, identificacion, e_mail, telefono, celulares, direccion, nombre_comercial } = clienteData;

  const [result] = await pool.query(
    `UPDATE clientes 
     SET cliente = ?, identificacion = ?, e_mail = ?, telefono = ?, celulares = ?, direccion = ?, nombre_comercial = ? 
     WHERE codigo = ?`,
    [cliente, identificacion, e_mail, telefono, celulares, direccion, nombre_comercial, id]
  );

  if (result.affectedRows === 0) {
    throw new AppError(`No se pudo actualizar. Cliente con código ${id} no existe.`, 404);
  }

  return { codigo: id, ...clienteData };
};

export const deleteCliente = async (id) => {
  const [result] = await pool.query('DELETE FROM clientes WHERE codigo = ?', [id]);

  if (result.affectedRows === 0) {
    throw new AppError(`No se pudo eliminar. Cliente con código ${id} no existe.`, 404);
  }

  return true;
};