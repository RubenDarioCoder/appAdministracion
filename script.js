let produccion = [];
let pedidos = [];
let ventas = [];
let insumos = [];
let clientes = [];
let productos = [];

// Cargar datos desde localStorage al iniciar
const cargarDatos = () => {
    produccion = JSON.parse(localStorage.getItem('produccion')) || [];
    pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
    ventas = JSON.parse(localStorage.getItem('ventas')) || [];
    insumos = JSON.parse(localStorage.getItem('insumos')) || [];
    clientes = JSON.parse(localStorage.getItem('clientes')) || [];
    productos = JSON.parse(localStorage.getItem('productos')) || [];
};

// Guardar datos en localStorage
const guardarDatos = () => {
    localStorage.setItem('produccion', JSON.stringify(produccion));
    localStorage.setItem('pedidos', JSON.stringify(pedidos));
    localStorage.setItem('ventas', JSON.stringify(ventas));
    localStorage.setItem('insumos', JSON.stringify(insumos));
    localStorage.setItem('clientes', JSON.stringify(clientes));
    localStorage.setItem('productos', JSON.stringify(productos));
};

document.addEventListener('DOMContentLoaded', () => {
    // Cargar datos al iniciar
    cargarDatos();

    // Mostrar fecha actual
    let fecha = new Date();
    let fechaFormato = `${fecha.getDate()}/${fecha.getMonth() + 1}/${fecha.getFullYear()}`;
    let mostrarFecha = document.getElementById('mostrarFecha');
    mostrarFecha.textContent = fechaFormato;

    // Función para manejar el toggle de cada label
    const toggleLabels = document.querySelectorAll('.toggle-label');
    toggleLabels.forEach((label) => {
        label.addEventListener('click', () => {
            // Obtener el contenido asociado al label
            const contentId = label.getAttribute('for');
            const content = document.getElementById(`${contentId}-content`);

            // Mostrar u ocultar el contenido
            if (content.style.display === 'none' || content.style.display === '') {
                content.style.display = 'block';
            } else {
                content.style.display = 'none';
            }
        });
    });

    // Función para agregar elementos a la lista y guardarlos
    const agregarElemento = (idBoton, idLista, campos, lista) => {
        const boton = document.getElementById(idBoton);
        const listaElementos = document.getElementById(idLista);

        boton.addEventListener('click', () => {
            const valores = campos.map(id => document.getElementById(id).value.trim());
            if (valores.every(valor => valor !== '')) {
                // Crear un objeto con los datos
                const nuevoElemento = {
                    ...valores.reduce((obj, valor, index) => {
                        obj[campos[index].replace(idLista, '').toLowerCase()] = valor;
                        return obj;
                    }, {}),
                    fecha: fechaFormato
                };

                // Agregar a la lista correspondiente
                lista.push(nuevoElemento);

                // Guardar datos en localStorage
                guardarDatos();

                // Mostrar en la interfaz
                mostrarElementoEnLista(nuevoElemento, listaElementos, lista, idLista);

                // Limpiar los inputs
                campos.forEach(id => (document.getElementById(id).value = ''));

                // Actualizar el balance
                actualizarBalance();
            } else {
                alert('Por favor, completa todos los campos.');
            }
        });
    };

    // Función para mostrar un elemento en la lista
    const mostrarElementoEnLista = (elemento, listaElementos, lista, idLista) => {
        const divElemento = document.createElement('div');
        divElemento.classList.add(`${idLista}-item`);

        // Formatear el texto según la sección
        let texto = '';
        switch (idLista) {
            case 'listaProduccion':
                texto = `Producción: ${elemento.cantidadproduccion} ${elemento.productoproduccion} (${elemento.fecha})`;
                break;
            case 'listaPedidos':
                texto = `Pedido: ${elemento.cantidadpedido} ${elemento.productopedido} para ${elemento.clientepedido} (${elemento.fecha})`;
                break;
            case 'listaVentas':
                texto = `Venta: ${elemento.clienteventa} ${elemento.cantidadventa} ${elemento.productoventa} a $${elemento.precioventa} (${elemento.fecha})`;
                break;
            case 'listaInsumos':
                texto = `Insumo: ${elemento.cantidadinsumo} ${elemento.insumoinsumo} a $${elemento.precioinsumo} (${elemento.fecha})`;
                break;
            case 'listaClientes':
                texto = `Cliente: ${elemento.nombrecliente} - Contacto: ${elemento.contactocliente} (${elemento.fecha})`;
                break;
            case 'listaProductos':
                texto = `Producto: ${elemento.nombreproducto} - Precio: $${elemento.precio} (${elemento.fecha})`;
                break;
            default:
                texto = 'Elemento no reconocido';
        }

        const nuevoElementoTexto = document.createElement('p');
        nuevoElementoTexto.textContent = texto;
        divElemento.appendChild(nuevoElementoTexto);

        const botonEliminar = document.createElement('button');
        botonEliminar.textContent = 'Eliminar';
        botonEliminar.classList.add('boton-eliminar');

        botonEliminar.addEventListener('click', () => {
            divElemento.remove();
            lista.splice(lista.indexOf(elemento), 1); // Eliminar de la lista
            guardarDatos(); // Actualizar localStorage
            actualizarBalance(); // Actualizar el balance
        });

        divElemento.appendChild(botonEliminar);
        listaElementos.appendChild(divElemento);
    };

    // Función para mostrar los datos guardados al cargar la página
    const mostrarDatosGuardados = () => {
        mostrarElementosEnLista(produccion, 'listaProduccion');
        mostrarElementosEnLista(pedidos, 'listaPedidos');
        mostrarElementosEnLista(ventas, 'listaVentas');
        mostrarElementosEnLista(insumos, 'listaInsumos');
        mostrarElementosEnLista(clientes, 'listaClientes');
        mostrarElementosEnLista(productos, 'listaProductos');
        actualizarBalance(); // Actualizar el balance al cargar la página
    };

    // Función para mostrar todos los elementos de una lista
    const mostrarElementosEnLista = (lista, idLista) => {
        const listaElementos = document.getElementById(idLista);
        listaElementos.innerHTML = ''; // Limpiar la lista antes de mostrar los datos
        lista.forEach((elemento) => {
            mostrarElementoEnLista(elemento, listaElementos, lista, idLista);
        });
    };

    // Función para calcular el balance
    const calcularBalance = () => {
        // Calcular ingresos (suma de todas las ventas)
        const ingresos = ventas.reduce((total, venta) => {
            const cantidad = parseFloat(venta.cantidadventa) || 0;
            const precio = parseFloat(venta.precioventa) || 0;
            return total + (cantidad * precio);
        }, 0);

        // Calcular gastos (suma de los costos de insumos)
        const gastos = insumos.reduce((total, insumo) => {
            const cantidad = parseFloat(insumo.cantidadinsumo) || 0;
            const precio = parseFloat(insumo.precioinsumo) || 0;
            return total + (cantidad * precio);
        }, 0);

        // Calcular utilidad (ingresos - gastos)
        const utilidad = ingresos - gastos;

        // Calcular inventario (producción - ventas)
        const totalProduccion = produccion.reduce((total, prod) => {
            return total + (parseFloat(prod.cantidadproduccion) || 0);
        }, 0);
        const totalVentas = ventas.reduce((total, venta) => {
            return total + (parseFloat(venta.cantidadventa) || 0);
        }, 0);
        const inventario = totalProduccion - totalVentas;

        // Mostrar resultados en el balance
        document.getElementById('ingresos').textContent = `$${ingresos.toFixed(2)}`;
        document.getElementById('gastos').textContent = `$${gastos.toFixed(2)}`;
        document.getElementById('utilidad').textContent = `$${utilidad.toFixed(2)}`;
        document.getElementById('inventario').textContent = `${inventario} unidades`;

        // Mostrar detalles
        const detallesBalance = document.getElementById('detallesBalance');
        detallesBalance.innerHTML = `
            <p><strong>Detalle de Ingresos:</strong></p>
            <ul>
                ${ventas.map(venta => `
                    <li>${fechaFormato} ${venta.cantidadventa} ${venta.productoventa} vendidos a $${venta.precioventa} cada uno</li>
                `).join('')}
            </ul>
            <p><strong>Detalle de Gastos:</strong></p>
            <ul>
                ${insumos.map(insumo => `
                    <li>${fechaFormato} ${insumo.cantidadinsumo} ${insumo.insumoinsumo} comprados a $${insumo.precioinsumo} cada uno</li>
                `).join('')}
            </ul>
            <p><strong>Detalle de Producción:</strong></p>
            <ul>
                ${produccion.map(prod => `
                    <li>${fechaFormato} ${prod.cantidadproduccion} ${prod.productoproduccion} producidos</li>
                `).join('')}
            </ul>
        `;
    };

    // Llamar a calcularBalance cada vez que se agrega un nuevo elemento
    const actualizarBalance = () => {
        calcularBalance();
    };

    // Agregar funcionalidad a cada sección
    agregarElemento('agregarProduccion', 'listaProduccion', ['productoProduccion', 'cantidadProduccion'], produccion);
    agregarElemento('agregarPedido', 'listaPedidos', ['clientePedido', 'productoPedido', 'cantidadPedido'], pedidos);
    agregarElemento('agregarVenta', 'listaVentas', ['clienteVenta', 'productoVenta', 'cantidadVenta', 'precioVenta'], ventas);
    agregarElemento('agregarInsumo', 'listaInsumos', ['insumoInsumo', 'cantidadInsumo', 'precioInsumo'], insumos);
    agregarElemento('agregarCliente', 'listaClientes', ['nombreCliente', 'contactoCliente'], clientes);
    agregarElemento('agregarProducto', 'listaProductos', ['nombreProducto', 'Precio'], productos);

    // Mostrar datos guardados al cargar la página
    mostrarDatosGuardados();
});