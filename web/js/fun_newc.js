document.addEventListener('DOMContentLoaded', function() {
    loadAvailableDates();
});

function checkMarca() {
    const marca = document.getElementById('marca').value;
    if (marca === 'otro') {
        document.getElementById('otraMarcaDiv').style.display = 'block';
    } else {
        document.getElementById('otraMarcaDiv').style.display = 'none';
    }
}

function loadAvailableDates() {
    const today = new Date();
    const selectFecha = document.getElementById('fecha');
    selectFecha.innerHTML = '';

    for (let i = 1; i <= 7; i++) {
        const nextDate = new Date(today);
        nextDate.setDate(today.getDate() + i);
        const option = document.createElement('option');
        option.value = nextDate.toISOString().split('T')[0];
        option.textContent = nextDate.toDateString();
        selectFecha.appendChild(option);
    }
}

function M_Agendar() {
    const fecha = document.getElementById('fecha').value;
    const hora = document.getElementById('hora').value;
    const placa = document.getElementById('placa').value.trim();
    const marca = document.getElementById('marca').value === 'otro' ? document.getElementById('otraMarca').value.trim() : document.getElementById('marca').value;
    const color = document.getElementById('color').value.trim();
    const modelo = document.getElementById('modelo').value.trim();
    const id_cliente = localStorage.getItem('user_id');

    if (!/^[A-Z]{3}-\d{3}$/.test(placa)) {
        alert("La placa debe tener el formato XXX-111");
        return;
    }

    const fechaHora = `${fecha} ${hora}`;

    axios({
        method: 'POST',
        url: 'http://127.0.0.1:3000/agendar',
        data: {
            fecha_planeada: fechaHora,
            informacion_vehiculo: `${placa},${marca},${color},${modelo}`,
            id_cliente: id_cliente
        }
    })
    .then(function(response) {
        alert(response.data.informacion);
        document.getElementById('appointmentForm').reset();
    })
    .catch(function(error) {
        console.error('Error en la petición:', error);
        alert('Ya hay una cita programada para esta fecha y hora. Por favor, elige otro horario.');
    });
}