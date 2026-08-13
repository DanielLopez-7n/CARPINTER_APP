import pool from '../config/db.js';
import { AppError } from '../utils/AppError.js';

export const getAllVendedores = async () => {
  const [rows] = await pool.query('SELECT * FROM vendedores ORDER BY CODIGO DESC');
  return rows;
};

export const getVendedorById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM vendedores WHERE CODIGO = ?', [id]);
  if (rows.length === 0) {
    throw new AppError(`No se encontró ningún vendedor con el código: ${id}`, 404);
  }
  return rows[0];
};

export const createVendedor = async (vendedorData) => {
  const { nombre, apellidos, identificacion, direccion, telefono, celular, e_mail } = vendedorData;

  if (!nombre) {
    throw new AppError('El campo "nombre" es obligatorio.', 400);
  }

  const [result] = await pool.query(
    `INSERT INTO vendedores (NOMBRE, APELLIDOS, IDENTIFICACION, DIRECCION, TELEFONO, CELULAR, E_MAIL) 
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      nombre,
      apellidos || null,
      identificacion || null,
      direccion || null,
      telefono || null,
      celular || null,
      e_mail || null
    ]
  );

  return { codigo: result.insertId, ...vendedorData };
};

export const updateVendedor = async (id, vendedorData) => {
  const { nombre, apellidos, identificacion, direccion, telefono, celular, e_mail } = vendedorData;

  const [result] = await pool.query(
    `UPDATE vendedores 
     SET NOMBRE = ?, APELLIDOS = ?, IDENTIFICACION = ?, DIRECCION = ?, TELEFONO = ?, CELULAR = ?, E_MAIL = ? 
     WHERE CODIGO = ?`,
    [nombre, apellidos, identificacion, direccion, telefono, celular, e_mail, id]
  );

  if (result.affectedRows === 0) {
    throw new AppError(`No se pudo actualizar. Vendedor con código ${id} no existe.`, 404);
  }

  return { codigo: id, ...vendedorData };
};

export const deleteVendedor = async (id) => {
  const [result] = await pool.query('DELETE FROM vendedores WHERE CODIGO = ?', [id]);

  if (result.affectedRows === 0) {
    throw new AppError(`No se pudo eliminar. Vendedor con código ${id} no existe.`, 404);
  }

  return true;
};