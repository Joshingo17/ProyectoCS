document.addEventListener("DOMContentLoaded", function () {
    loadMantenimientosPorCliente();
    setLogoutTimer()
});

function loadMantenimientosPorCliente() {
    const id_cliente = localStorage.getItem('user_id');
    if (!id_cliente) {
        console.error('id_cliente no está definido en localStorage');
        return;
    }

    axios.get(`http://localhost:3000/mantenimientos_cliente?estado=en_proceso&id_cliente=${id_cliente}`)
        .then(response => {
            const data = response.data.mantenimientos;
            const tbody = document.querySelector("#mantenimientosTable tbody");
            tbody.innerHTML = "";
            data.forEach(mantenimiento => {
                const tr = document.createElement("tr");

                tr.innerHTML = `
                    <td>${mantenimiento.id_mantenimiento}</td>
                    <td>${mantenimiento.nombre_mecanico}</td>
                    <td>${mantenimiento.informacion_vehiculo}</td>
                    <td>${mantenimiento.descripcion_del_mantenimiento}</td>
                    <td><button onclick="openInNewTab('${mantenimiento.como_llego}')" class="btn btn-secondary">Ver</button></td>
                    <td>${mantenimiento.fecha_inicio}</td>
                `;
                tbody.appendChild(tr);
            });

            // Inicializar DataTables después de cargar los datos
            $('#mantenimientosTable').DataTable();
        })
        .catch(error => {
            console.error('Error al cargar los mantenimientos:', error);
        });
}

function openInNewTab(url) {
    if (url) {
        window.open(url, '_blank');
    } else {
        alert('URL no disponible.');
    }
}

function setLogoutTimer() {
    setTimeout(() => {
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('user_id');
        localStorage.removeItem('authenticated');
        alert('Tu sesión ha expirado. Serás redirigido al inicio de sesión.');
        window.location.href = '../index.html';
    }, 15000); // 15 segundos
}