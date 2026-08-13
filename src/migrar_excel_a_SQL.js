import pool from './config/db.js';
import xlsx from 'xlsx';
import dotenv from 'dotenv';

dotenv.config();

async function iniciarMigracion() {
    try {
        console.log("1. Conectando al servidor MySQL...");
        const dbName = process.env.DB_NAME;
        
        // Crear DB y seleccionarla
        await pool.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
        await pool.query(`USE \`${dbName}\``);

        console.log("2. Verificando tabla 'productos'...");
        // Se crea solo la de productos, asumiendo que clientes y vendedores ya existen en Workbench
        const createTableSQL = `
            CREATE TABLE IF NOT EXISTS productos (
                id INT PRIMARY KEY,
                codigo VARCHAR(50) UNIQUE,
                grupo VARCHAR(100),
                articulo VARCHAR(255) NOT NULL,
                unidad VARCHAR(20),
                codigo_barras VARCHAR(50),
                referencia VARCHAR(100),
                costo_promedio DECIMAL(12, 2) DEFAULT 0.00,
                proveedor VARCHAR(150),
                precio_venta DECIMAL(12, 2) DEFAULT 0.00,
                stock_cantidad INT DEFAULT 0
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `;
        await pool.query(createTableSQL);

        // ==========================================
// MIGRACIÓN DE PRODUCTOS
// ==========================================
console.log("\n3. Leyendo el archivo Excel 'inventario.xlsx'...");
const wbInventario = xlsx.readFile('data/inventario.xlsx');
const sheetName = wbInventario.SheetNames[0];
const sheet = wbInventario.Sheets[sheetName];

// 1. Leemos filas en bruto para ubicar la fila de encabezados
const filasBrutas = xlsx.utils.sheet_to_json(sheet, { header: 1 });

let filaEncabezadoIndex = 0;
for (let i = 0; i < filasBrutas.length; i++) {
    const filaTexto = JSON.stringify(filasBrutas[i] || []).toUpperCase();
    if (
        filaTexto.includes('ARTICULO') || 
        filaTexto.includes('CODIGO') || 
        filaTexto.includes('REFERENCIA') || 
        filaTexto.includes('VENTA')
    ) {
        filaEncabezadoIndex = i;
        break;
    }
}

console.log(`🔍 Encabezados detectados en la fila ${filaEncabezadoIndex + 1} del Excel.`);

// 2. Convertimos a JSON arrancando desde la fila encontrada
const filasInventario = xlsx.utils.sheet_to_json(sheet, { range: filaEncabezadoIndex, defval: null });

// 3. LIMPIEZA DE ESPACIOS: Normalizamos las llaves del objeto (quitamos espacios ' CODIGO ' -> 'CODIGO')
const filasLimpias = filasInventario.map(fila => {
    const filaLimpia = {};
    for (const key in fila) {
        if (Object.prototype.hasOwnProperty.call(fila, key)) {
            const claveLimpia = key.trim().toUpperCase();
            filaLimpia[claveLimpia] = fila[key];
        }
    }
    return filaLimpia;
});

if (filasLimpias.length === 0) {
    console.log("⚠️ No se encontraron filas de datos para procesar.");
} else {
    console.log("📌 Columnas normalizadas sin espacios:", Object.keys(filasLimpias[0]));
}

// 4. Consulta SQL de inserción
const sqlProductos = `
    INSERT INTO productos 
    (codigo, grupo, articulo, unidad, codigo_barras, referencia, costo_promedio, proveedor, precio_venta, stock_cantidad)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE 
        grupo = VALUES(grupo),
        articulo = VALUES(articulo),
        unidad = VALUES(unidad),
        codigo_barras = VALUES(codigo_barras),
        referencia = VALUES(referencia),
        costo_promedio = VALUES(costo_promedio),
        proveedor = VALUES(proveedor),
        precio_venta = VALUES(precio_venta),
        stock_cantidad = VALUES(stock_cantidad);
`;

let insertadosProd = 0;
for (const fila of filasLimpias) {
    // Ahora las llaves coinciden exactamente
    const codigo = fila['CODIGO'] || fila['COD. BARRAS'] || fila['COD'] || null;
    const articulo = fila['ARTICULO'] || fila['DESCRIPCION'] || null;
    const grupo = fila['GRUPO'] || null;
    const unidad = fila['UE'] || fila['U.E.'] || fila['UNIDAD'] || null;
    const codigoBarras = fila['COD. BARRAS'] || fila['CODIGO_BARRAS'] || null;
    const referencia = fila['REFERENCIA'] || null;
    const proveedor = fila['PROVEEDOR'] || null;

    const costoProm = parseFloat(fila['COSTO PROM'] || fila['COSTO_PROMEDIO'] || 0) || 0;
    const precioVenta = parseFloat(fila['VENTA'] || fila['PRECIO_VENTA'] || 0) || 0;
    const stockCant = parseInt(fila['CANT'] || fila['STOCK_CANTIDAD'] || 0, 10) || 0;

    // Si la fila no tiene ni artículo ni código, se ignora
    if (!articulo && !codigo) continue;

    await pool.query(sqlProductos, [
        codigo,
        grupo,
        articulo,
        unidad,
        codigoBarras,
        referencia,
        costoProm,
        proveedor,
        precioVenta,
        stockCant
    ]);

    insertadosProd++;
}

console.log(`-> ¡Éxito! ${insertadosProd} productos procesados correctamente.`);

        // ==========================================
        // MIGRACIÓN DE VENDEDORES
        // ==========================================
        console.log("\n4. Leyendo el archivo Excel 'VENDEDORES.xls'...");
        const wbVendedores = xlsx.readFile('data/VENDEDORES.xls'); // Nombre exacto
        const filasVendedores = xlsx.utils.sheet_to_json(wbVendedores.Sheets[wbVendedores.SheetNames[0]], { defval: null });

        const sqlVendedores = `
            INSERT INTO vendedores 
            (codigo, sucu, identificacion, nombre, apellidos, fecha_nac, direccion, telefono, celular, e_mail, comision, profesion, estado_civil, hijos, pre, hab)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE 
                sucu=VALUES(sucu), identificacion=VALUES(identificacion), nombre=VALUES(nombre), 
                apellidos=VALUES(apellidos), fecha_nac=VALUES(fecha_nac), direccion=VALUES(direccion), 
                telefono=VALUES(telefono), celular=VALUES(celular), e_mail=VALUES(e_mail), 
                comision=VALUES(comision), profesion=VALUES(profesion), estado_civil=VALUES(estado_civil), 
                hijos=VALUES(hijos), pre=VALUES(pre), hab=VALUES(hab);
        `;

        let insertadosVen = 0;
        for (const fila of filasVendedores) {
            if (!fila['CODIGO']) continue; 
            
            await pool.query(sqlVendedores, [
                fila['CODIGO'], fila['SUCU'], fila['IDENTIFICACION'], fila['NOMBRE'], 
                fila['APELLIDOS'], fila['FECHA_NAC'], fila['DIRECCION'], fila['TELEFONO'], 
                fila['CELULAR'], fila['E_MAIL'], fila['COMISION'], fila['PROFESION'], 
                fila['ESTADO_CIVIL'], fila['HIJOS'], fila['PRE'], fila['HAB']
            ]);
            insertadosVen++;
        }
        console.log(`-> ¡Éxito! ${insertadosVen} vendedores procesados correctamente.`);

        // ==========================================
        // MIGRACIÓN DE CLIENTES
        // ==========================================
        console.log("\n5. Leyendo el archivo Excel 'CLIENTES.xls'...");
        const wbClientes = xlsx.readFile('data/CLIENTES.xls'); // Nombre exacto
        const filasClientes = xlsx.utils.sheet_to_json(wbClientes.Sheets[wbClientes.SheetNames[0]], { defval: null });

        const sqlClientes = `
            INSERT INTO clientes 
            (codigo, identificacion, cliente, nombre_comercial, direccion, telefono, celulares, e_mail, email_status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE 
                identificacion=VALUES(identificacion), cliente=VALUES(cliente), 
                nombre_comercial=VALUES(nombre_comercial), direccion=VALUES(direccion), 
                telefono=VALUES(telefono), celulares=VALUES(celulares), 
                e_mail=VALUES(e_mail), email_status=VALUES(email_status);
        `;

        let insertadosCli = 0;
        for (const fila of filasClientes) {
            if (!fila['CODIGO']) continue;
            
            await pool.query(sqlClientes, [
                fila['CODIGO'], 
                fila['IDENTIFICACIN'] || fila['IDENTIFICACION'], // Manejo de la columna sin 'O'
                fila['CLIENTE'], 
                fila['NOMBRE_COMERCIAL'], 
                fila['DIRECCION'], 
                fila['TELEFONOS_758_1586'] || fila['TELEFONO'],  // Manejo de la columna combinada
                fila['CELULARES'], 
                fila['E_MAIL'], 
                fila['EMAIL_STATUS']
            ]);
            insertadosCli++;
        }
        console.log(`-> ¡Éxito! ${insertadosCli} clientes procesados correctamente.`);

    } catch (error) {
        console.error("Error crítico durante la migración:", error);
    } finally {
        await pool.end();
        console.log("\nProceso finalizado. Conexión cerrada.");
    }
}

iniciarMigracion();