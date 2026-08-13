import pool from '../config/db.js';
import { AppError } from '../utils/AppError.js';

export const getAllProductos = async () => {
  const [rows] = await pool.query('SELECT * FROM productos ORDER BY id DESC');
  return rows;
};

export const getProductoById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM productos WHERE id = ?', [id]);
  if (rows.length === 0) {
    throw new AppError(`No se encontró ningún producto con el ID: ${id}`, 404);
  }
  return rows[0];
};

export const createProducto = async (productoData) => {
  const {
    codigo,
    grupo,
    articulo,
    unidad,
    codigo_barras,
    referencia,
    costo_promedio,
    proveedor,
    precio_venta,
    stock_cantidad
  } = productoData;

  if (!articulo && !codigo) {
    throw new AppError('El producto debe contener al menos un código o una descripción/artículo.', 400);
  }

  const [result] = await pool.query(
    `INSERT INTO productos 
     (codigo, grupo, articulo, unidad, codigo_barras, referencia, costo_promedio, proveedor, precio_venta, stock_cantidad)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      codigo || null,
      grupo || null,
      articulo || null,
      unidad || null,
      codigo_barras || null,
      referencia || null,
      costo_promedio || 0,
      proveedor || null,
      precio_venta || 0,
      stock_cantidad || 0
    ]
  );

  return { id: result.insertId, ...productoData };
};

export const updateProducto = async (id, productoData) => {
  const {
    codigo,
    grupo,
    articulo,
    unidad,
    codigo_barras,
    referencia,
    costo_promedio,
    proveedor,
    precio_venta,
    stock_cantidad
  } = productoData;

  const [result] = await pool.query(
    `UPDATE productos 
     SET codigo = ?, grupo = ?, articulo = ?, unidad = ?, codigo_barras = ?, referencia = ?, costo_promedio = ?, proveedor = ?, precio_venta = ?, stock_cantidad = ?
     WHERE id = ?`,
    [
      codigo,
      grupo,
      articulo,
      unidad,
      codigo_barras,
      referencia,
      costo_promedio,
      proveedor,
      precio_venta,
      stock_cantidad,
      id
    ]
  );

  if (result.affectedRows === 0) {
    throw new AppError(`No se pudo actualizar. Producto con ID ${id} no existe.`, 404);
  }

  return { id, ...productoData };
};

export const deleteProducto = async (id) => {
  const [result] = await pool.query('DELETE FROM productos WHERE id = ?', [id]);

  if (result.affectedRows === 0) {
    throw new AppError(`No se pudo eliminar. Producto con ID ${id} no existe.`, 404);
  }

  return true;
};