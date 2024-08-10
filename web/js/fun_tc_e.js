document.addEventListener('DOMContentLoaded', function () {
    loadCitas();
});

function loadCitas() {
    const id_cliente = localStorage.getItem('user_id');  // Asegúrate de tener el id_cliente en el localStorage

    fetch(`http://127.0.0.1:3000/citas?id_cliente=${id_cliente}`)
        .then(response => response.json())
        .then(data => {
            const citas = data.citas;
            const tbody = document.getElementById('citasTable').getElementsByTagName('tbody')[0];
            tbody.innerHTML = '';

            citas.forEach(cita => {
                const row = tbody.insertRow();

                const cellId = row.insertCell(0);
                cellId.textContent = cita.id_cita;

                const cellFechaHora = row.insertCell(1);
                cellFechaHora.textContent = cita.fecha_planeada;

                const cellVehiculo = row.insertCell(2);
                cellVehiculo.textContent = cita.informacion_vehiculo;

                const cellFechaRegistro = row.insertCell(3);
                cellFechaRegistro.textContent = cita.fecha_registro;

                const cellObservaciones = row.insertCell(4);
                cellObservaciones.textContent = cita.observaciones;

                const cellAcciones = row.insertCell(5);
                const cancelarButton = document.createElement('button');
                cancelarButton.textContent = 'Cancelar Cita';
                cancelarButton.onclick = function () {
                    cancelarCita(cita.id_cita, cita.fecha_planeada);
                };
                if (new Date(cita.fecha_planeada) <= new Date()) {
                    cancelarButton.disabled = true;
                }
                cellAcciones.appendChild(cancelarButton);
            });

            // Inicializa DataTables después de cargar los datos
            $('#citasTable').DataTable();
        })
        .catch(error => {
            console.error('Error al cargar las citas:', error);
            alert('Hubo un problema al cargar las citas. Por favor, intenta de nuevo más tarde.');
        });
}

function cancelarCita(id_cita, fecha_planeada) {
    if (new Date(fecha_planeada) <= new Date()) {
        alert('No se puede cancelar una cita el mismo día o después de la fecha planeada.');
        return;
    }

    fetch(`http://127.0.0.1:3000/deleteCita/${id_cita}`, {
        method: "DELETE",
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                alert('Cita cancelada exitosamente');
                loadCitas();  // Recarga la lista de citas
            } else {
                console.error('Error al cancelar la cita:', data.informacion);
                alert('Hubo un problema al cancelar la cita: ' + data.informacion);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Hubo un problema al cancelar la cita. Por favor, intenta de nuevo más tarde.');
        });
}
