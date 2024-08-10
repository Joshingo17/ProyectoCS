document.addEventListener('DOMContentLoaded', function() {
    fetchCitas();
});

async function fetchCitas() {
    try {
        const response = await fetch('http://localhost:3000/citasa');
        const data = await response.json();
        const citas = data.citas;
        populateCitasTable(citas);
    } catch (error) {
        console.error('Error fetching citas:', error);
    }
}

function populateCitasTable(citas) {
    const table = $('#citasTable').DataTable();
    table.clear();

    citas.forEach(cita => {
        table.row.add([
            cita.id_cita,
            cita.fecha_planeada,
            cita.informacion_vehiculo,
            cita.fecha_registro,
            cita.observaciones,
            cita.nombre_completo,
            `<button onclick="showObservationModal(${cita.id_cita}, '${cita.observaciones}')">Agregar Observación</button>`
        ]).draw(false);
    });
}

function showObservationModal(idCita, currentObservation) {
    const newObservation = prompt("Ingrese la nueva observación:", currentObservation);
    if (newObservation !== null) {
        updateObservation(idCita, newObservation);
    }
}

async function updateObservation(idCita, newObservation) {
    try {
        const response = await fetch('http://localhost:3000/update_observacion', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id_cita: idCita,
                observacion: newObservation
            })
        });
        const data = await response.json();
        if (data.success) {
            alert("Observación actualizada exitosamente");
            fetchCitas();
        } else {
            alert("Error al actualizar la observación: " + data.informacion);
        }
    } catch (error) {
        console.error('Error updating observation:', error);
    }
}
