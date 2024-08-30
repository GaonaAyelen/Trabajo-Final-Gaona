let serviciosDeSoldadura = [];

function cargarServicios() {
    fetch('servicios.json')
        .then(response => response.json())
        .then(data => {
            serviciosDeSoldadura = data.servicios;
            mostrarServicios();
        })
        .catch(error => console.error('Error:', error));
}

function mostrarServicios() {
    const listaServicios = document.getElementById('lista-servicios');
    listaServicios.innerHTML = '';
    serviciosDeSoldadura.forEach((servicio, index) => {
        const elemento = document.createElement('div');
        elemento.innerHTML = `
            <h3>${servicio.nombre}</h3>
            <p>${servicio.descripcion}</p>
            <p>Precio: $${servicio.precio}</p>
            <button class="agregar-carrito-btn" data-tipo="${index}">Agregar al carrito</button>
        `;
        listaServicios.appendChild(elemento);
    });
}

function agregarAlCarrito(indice) {
    const servicio = serviciosDeSoldadura[indice];
    if (servicio) {
        let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        carrito.push(servicio);
        localStorage.setItem('carrito', JSON.stringify(carrito));
        actualizarCarrito();
        Swal.fire({
            title: '¡Añadido al carrito!',
            text: `${servicio.nombre} ha sido añadido al carrito.`,
            icon: 'success',
            confirmButtonText: 'OK'
        });
    } else {
        Swal.fire({
            title: 'Error',
            text: `Servicio no encontrado.`,
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }
}

function actualizarCarrito() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const listaCarrito = document.getElementById('lista-carrito');
    const totalElement = document.getElementById('total-carrito');
    
    if (listaCarrito) {
        listaCarrito.innerHTML = '';
        let total = 0;
        
        carrito.forEach((servicio, index) => {
            const elemento = document.createElement('li');
            elemento.innerHTML = `
                ${servicio.nombre} - $${servicio.precio}
                <button class="eliminar-item-btn" data-index="${index}">Eliminar</button>
            `;
            listaCarrito.appendChild(elemento);
            total += servicio.precio;
        });
        
        if (totalElement) {
            totalElement.textContent = `Total: $${total}`;
        }
    }
}

function eliminarDelCarrito(index) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    carrito.splice(index, 1);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarCarrito();
    Swal.fire({
        title: 'Elemento eliminado',
        text: 'El servicio ha sido eliminado del carrito.',
        icon: 'info',
        confirmButtonText: 'OK'
    });
}

function vaciarCarrito() {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "Esto vaciará completamente tu carrito.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, vaciar carrito',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.removeItem('carrito');
            actualizarCarrito();
            Swal.fire(
                '¡Carrito vaciado!',
                'Tu carrito ha sido vaciado completamente.',
                'success'
            );
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM completamente cargado");
    cargarServicios();
    actualizarCarrito();

    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('agregar-carrito-btn')) {
            const tipo = e.target.getAttribute('data-tipo');
            agregarAlCarrito(parseInt(tipo));
        } else if (e.target.classList.contains('eliminar-item-btn')) {
            const index = e.target.getAttribute('data-index');
            eliminarDelCarrito(parseInt(index));
        }
    });

    const botonVaciarCarrito = document.getElementById('vaciar-carrito');
    if (botonVaciarCarrito) {
        botonVaciarCarrito.addEventListener('click', vaciarCarrito);
    }
});