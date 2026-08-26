// Variable global para guardar los productos y filtrar sin recargar
let productosGlobales = [];

// ==========================================
// CONFIGURACIÓN DE SESIÓN (Usuario y LogOut)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // 1. Mostrar el nombre del usuario actual
    const usuarioGuardado = localStorage.getItem('usuario'); // O el nombre que uses al guardar en el Login
    if (usuarioGuardado) {
        // Asumiendo que guardas un objeto JSON con los datos del usuario
        try {
            const usuario = JSON.parse(usuarioGuardado);
            // Ajusta "usuario.nombre" y "usuario.rol" si en tu base de datos se llaman diferente
            const nombreMostrar = usuario.nombre || usuario.email || 'Daniel_7'; 
            const rolMostrar = usuario.rol || 'administrador';
            
            document.getElementById('usuarioActual').textContent = `${nombreMostrar} (${rolMostrar})`;
        } catch (e) {
            // Si lo guardaste como texto simple
            document.getElementById('usuarioActual').textContent = usuarioGuardado;
        }
    }

    // 2. Activar el botón de Salir
    const btnLogOut = document.getElementById('btnLogOut');
    if (btnLogOut) {
        btnLogOut.addEventListener('click', () => {
            localStorage.removeItem('token');
            localStorage.removeItem('usuario');
            window.location.href = '/login'; // O la ruta que uses para tu login html
        });
    }
});

// 1. FUNCIÓN PRINCIPAL: Traer los datos de la API
async function cargarCatalogoProductos() {
    try {
        const token = localStorage.getItem('token');
        const respuesta = await fetch('/api/productos', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const datos = await respuesta.json();

        if (respuesta.ok) {
            productosGlobales = datos.productos; // Guardamos en memoria
            // Buscamos en 'data' (tu estándar), o en 'productos', y si no hay nada, ponemos un array vacío []
            productosGlobales = datos.data || datos.productos || [];
            extraerCategorias(productosGlobales); // Llenamos el select
        } else {
            document.getElementById('cuerpo-tabla-productos').innerHTML = 
                `<tr><td colspan="6" class="text-center text-danger">Error: ${datos.error}</td></tr>`;
        }
    } catch (error) {
        console.error("Error al conectar con la API:", error);
    }
}

// 2. DIBUJAR LA TABLA (Mapeada a tus columnas reales)
function renderizarTabla(listaProductos) {
    const tbody = document.getElementById('cuerpo-tabla-productos');
    const contador = document.getElementById('contadorProductos');
    tbody.innerHTML = ''; 
    
    contador.textContent = `${listaProductos.length} productos`;

    if (listaProductos.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="text-center py-4 text-muted">No se encontraron productos.</td></tr>`;
        return;
    }

    listaProductos.forEach(producto => {
        // Le ponemos un color rojo al stock si está en 0
        const colorStock = producto.existencia > 0 ? 'bg-success' : 'bg-danger';

        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td class="fw-bold text-secondary ps-4">${producto.codigo || 'S/C'}</td>
            <td class="fw-semibold text-dark">${producto.articulo || 'Sin descripción'}</td>
            <td><span class="badge bg-info text-dark bg-opacity-25">${producto.grupo || 'Sin grupo'}</span></td>
            <td>${producto.referencia || '-'}</td>
            <td><span class="badge ${colorStock}">${producto.existencia || 0}</span></td>
            <td>
                <div class="d-flex justify-content-center gap-2">
                    <button class="btn btn-sm btn-outline-primary" title="Editar"><i class="ri-edit-line"></i></button>
                    <button class="btn btn-sm btn-outline-danger" title="Borrar"><i class="ri-delete-bin-line"></i></button>
                </div>
            </td>
        `;
        tbody.appendChild(fila);
    });
}

// 3. LLENAR EL SELECT CON LOS "GRUPOS" (En lugar de "Categorías")
function extraerCategorias(listaProductos) {
    const select = document.getElementById('selectCategoria');
    // Mapeamos usando 'grupo'
    const categoriasUnicas = [...new Set(listaProductos.map(p => p.grupo).filter(c => c))];
    
    // Limpiamos las opciones previas (dejando solo la opción 'Todas')
    select.innerHTML = '<option value="todas">Todos los grupos</option>';

    categoriasUnicas.forEach(cat => {
        const opcion = document.createElement('option');
        opcion.value = cat;
        opcion.textContent = cat;
        select.appendChild(opcion);
    });
}

// 4. EL BUSCADOR (Buscando por articulo y codigo)
function filtrarProductos() {
    const textoBusqueda = document.getElementById('inputBusqueda').value.toLowerCase();
    const categoriaSeleccionada = document.getElementById('selectCategoria').value;

    const productosFiltrados = productosGlobales.filter(producto => {
        // Buscamos dentro de 'articulo' o 'codigo'
        const coincideTexto = (producto.articulo && producto.articulo.toLowerCase().includes(textoBusqueda)) || 
                              (producto.codigo && producto.codigo.toLowerCase().includes(textoBusqueda));
        
        // Filtramos por 'grupo'
        const coincideCategoria = categoriaSeleccionada === 'todas' || producto.grupo === categoriaSeleccionada;

        return coincideTexto && coincideCategoria;
    });

    renderizarTabla(productosFiltrados);
}

// Arrancamos el motor al cargar la página
cargarCatalogoProductos();