import pool from '../config/db.js';
import AppError from '../utils/AppError.js';

// Devuelve todos los clientes
// - No necesita parámetros.
// - Retorna un arreglo con todos los clientes (ordenados por código desc).
export const getAllClientes = async () => {
  const [rows] = await pool.query('SELECT * FROM clientes ORDER BY codigo DESC');
  return rows;
};

// Busca un cliente por su id (codigo)
// - id: identificador del cliente (req.params.id desde la ruta).
// - Si no existe, lanza un error 404.
// - Si existe, devuelve el objeto del cliente.
export const getClienteById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM clientes WHERE codigo = ?', [id]);
  if (rows.length === 0) {
    throw new AppError(`No se encontró ningún cliente con el código: ${id}`, 404);
  }
  return rows[0];
};

// Crea un cliente nuevo
// - clienteData: objeto con los campos del cliente (cliente = nombre es obligatorio).
// - Devuelve el cliente creado con su nuevo codigo.
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

// Actualiza los datos de un cliente existente
// - id: codigo del cliente a actualizar.
// - clienteData: campos que se quieren cambiar.
// - Si el cliente no existe, lanza un error 404.
// - Devuelve el objeto con el codigo y los datos enviados.
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

// Elimina un cliente por su id
// - id: codigo del cliente a borrar.
// - Si no existe, lanza un error 404.
// - Si se elimina, devuelve true.
export const deleteCliente = async (id) => {
  const [result] = await pool.query('DELETE FROM clientes WHERE codigo = ?', [id]);

  if (result.affectedRows === 0) {
    throw new AppError(`No se pudo eliminar. Cliente con código ${id} no existe.`, 404);
  }

  return true;
};