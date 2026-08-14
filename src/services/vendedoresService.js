import pool from '../config/db.js';
import { AppError } from '../utils/AppError.js';

// Devuelve todos los vendedores
// - No necesita parámetros.
// - Retorna un arreglo con todos los vendedores (ordenados por CODIGO desc).
export const getAllVendedores = async () => {
  const [rows] = await pool.query('SELECT * FROM vendedores ORDER BY CODIGO DESC');
  return rows;
};

// Busca un vendedor por su id (CODIGO)
// - id: identificador del vendedor (req.params.id desde la ruta).
// - Si no existe, lanza un error 404.
// - Si existe, devuelve el objeto del vendedor.
export const getVendedorById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM vendedores WHERE CODIGO = ?', [id]);
  if (rows.length === 0) {
    throw new AppError(`No se encontró ningún vendedor con el código: ${id}`, 404);
  }
  return rows[0];
};

// Crea un vendedor nuevo
// - vendedorData: objeto con nombre (obligatorio) y otros campos opcionales.
// - Devuelve el vendedor creado con su nuevo codigo.
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

// Actualiza un vendedor existente
// - id: codigo del vendedor a actualizar.
// - vendedorData: campos a modificar.
// - Si no existe, lanza un error 404.
// - Devuelve el objeto con el codigo y los datos enviados.
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

// Elimina un vendedor por su id
// - id: codigo del vendedor a borrar.
// - Si no existe, lanza un error 404.
// - Si se elimina, devuelve true.
export const deleteVendedor = async (id) => {
  const [result] = await pool.query('DELETE FROM vendedores WHERE CODIGO = ?', [id]);

  if (result.affectedRows === 0) {
    throw new AppError(`No se pudo eliminar. Vendedor con código ${id} no existe.`, 404);
  }

  return true;
};