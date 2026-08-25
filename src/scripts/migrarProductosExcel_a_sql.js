import pool from '../config/db.js';
import xlsx from 'xlsx'; // importar la librería para leer archivos Excel
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

async function migrarProductosYPrecios() {
    try {
        console.log("======================================================");
        console.log("🚀 INICIANDO MIGRACIÓN: PRODUCTOS + LISTAS DE PRECIOS");
        console.log("======================================================");

        // 1. Cargar las listas de precios desde MySQL para saber sus IDs
        console.log("1. Obteniendo IDs de las listas de precios oficiales...");
        const [listasDb] = await pool.query('SELECT id, nombre FROM lista_precios');
        
        // Creamos un diccionario para buscar rápido el ID por el nombre
        const mapaListasId = {};
        listasDb.forEach(lista => {
            mapaListasId[lista.nombre] = lista.id;
        });

        // 📌 DICCIONARIO CLAVE: Conecta el nombre de la columna en Excel con el nombre en MySQL
        const equivalenciasExcelDb = {
            'GENERAL': 'GENERAL',
            'MAYORISTA': 'MAYORISTA',
            'CUNDINAMARCA': 'CUNDINAMARCA + 10%',
            'JULIAN': 'FACT JULIAN', 
            'ARAUCA': 'REMISION ARAUCA-CASANARE',
            'NACIONALES': 'TERRITORIOS NACIONALES'
        };

        // 2. Leer Excel
        const excelPath = path.resolve(process.cwd(), 'data/inventario.xlsx');
        console.log(`2. Leyendo archivo Excel: ${excelPath}`);
        const wbInventario = xlsx.readFile(excelPath);
        const sheet = wbInventario.Sheets[wbInventario.SheetNames[0]];

        // 3. Buscar automáticamente en qué fila empiezan los datos reales
        const filasBrutas = xlsx.utils.sheet_to_json(sheet, { header: 1 });
        let filaEncabezadoIndex = 0;
        for (let i = 0; i < filasBrutas.length; i++) {
            const filaTexto = JSON.stringify(filasBrutas[i] || []).toUpperCase();
            if (filaTexto.includes('ARTICULO') && filaTexto.includes('ID')) {
                filaEncabezadoIndex = i;
                break;
            }
        }

        // Convertir y limpiar los datos quitando espacios extra
        const filasInventario = xlsx.utils.sheet_to_json(sheet, { range: filaEncabezadoIndex, defval: null });
        const filasLimpias = filasInventario.map(fila => {
            const filaLimpia = {};
            for (const key in fila) {
                if (Object.prototype.hasOwnProperty.call(fila, key)) {
                    filaLimpia[key.trim().toUpperCase()] = fila[key];
                }
            }
            return filaLimpia;
        });

        console.log("3. Guardando y cruzando información en la base de datos...");

        // Sentencia para el producto (datos físicos)
        const sqlProducto = `
            INSERT INTO productos (id, codigo, grupo, articulo, ue, referencia, existencia)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE 
                codigo = VALUES(codigo), grupo = VALUES(grupo), articulo = VALUES(articulo),
                ue = VALUES(ue), referencia = VALUES(referencia), existencia = VALUES(existencia);
        `;

        // Sentencia para los precios (tabla pivote)
        const sqlPrecio = `
            INSERT INTO producto_precios (id_producto, id_lista_precio, precio)
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE precio = VALUES(precio);
        `;

        let insertadosProd = 0;
        let insertadosPrecios = 0;

        for (const fila of filasLimpias) {
            // Usamos el ID explícito que trae Orion
            const id = parseInt(fila['ID']);
            if (!id || isNaN(id)) continue; 

            const codigo = fila['CODIGO'] || null;
            const grupo = fila['GRUPO'] || null;
            const articulo = fila['ARTICULO'] || null;
            const ue = fila['UE'] || null;
            const referencia = fila['REFERENCIA'] || null;
            const existencia = parseInt(fila['EXISTENCIA'] || 0, 10);

            // A) Insertar el Producto Base
            await pool.query(sqlProducto, [id, codigo, grupo, articulo, ue, referencia, existencia]);
            insertadosProd++;

            // B) Procesar todos los precios de esa fila dinámicamente
            for (const [columnaExcel, nombreDb] of Object.entries(equivalenciasExcelDb)) {
                
                // Si la celda en el Excel tiene algo de dinero anotado
                if (fila[columnaExcel] !== undefined && fila[columnaExcel] !== null) {
                    
                    // Asegurarnos de limpiar símbolos de moneda si los trae el Excel
                    const precioRaw = String(fila[columnaExcel]).replace(/[^0-9.-]+/g, "");
                    const precio = parseFloat(precioRaw) || 0;
                    
                    const idLista = mapaListasId[nombreDb]; // Buscar el ID de la lista en nuestro diccionario

                    if (idLista && precio > 0) {
                        await pool.query(sqlPrecio, [id, idLista, precio]);
                        insertadosPrecios++;
                    }
                }
            }
        }

        console.log(`\n================== RESUMEN ==================`);
        console.log(`✅ Productos guardados/actualizados: ${insertadosProd}`);
        console.log(`✅ Precios distribuidos en listas: ${insertadosPrecios}`);
        console.log(`=============================================`);

    } catch (error) {
        console.error("❌ Error crítico durante la migración:", error);
    } finally {
        await pool.end();
        console.log("🔌 Conexión cerrada.");
    }
}

migrarProductosYPrecios();