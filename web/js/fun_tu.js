document.addEventListener('DOMContentLoaded', function() {
    fetchUsers();
});

async function fetchUsers() {
    try {
        const response = await fetch('http://localhost:3000/usuarios');
        const data = await response.json();
        const users = data.usuarios;
        populateUsersTable(users);
    } catch (error) {
        console.error('Error fetching users:', error);
    }
}

function populateUsersTable(users) {
    const tableBody = document.getElementById('usersTable').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = '';

    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.id_usuario}</td>
            <td>${user.usuario}</td>
            <td>${user.nombre_completo}</td>
            <td>${user.email}</td>
            <td>${user.numero_telefono}</td>
            <td>${user.rol}</td>
            <td>${user.fecha_registro}</td>
            <td>${user.estado}</td>
            <td>
                <button onclick="toggleUserStatus(${user.id_usuario}, '${user.estado}')">
                    ${user.estado === 'activo' ? 'Desactivar' : 'Activar'}
                </button>
                ${user.rol !== 'mecanico' ? `<button onclick="changeUserRole(${user.id_usuario})">Cambiar a Mecanico</button>` : ''}
            </td>
        `;
        tableBody.appendChild(row);
    });
}

async function toggleUserStatus(userId, currentStatus) {
    const newStatus = currentStatus === 'activo' ? 'inactivo' : 'activo';
    try {
        const response = await fetch(`http://localhost:3000/toggle_user_status`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id_usuario: userId, estado: newStatus })
        });
        const data = await response.json();
        if (data.success) {
            fetchUsers();
        } else {
            alert('Error al cambiar el estado del usuario: ' + data.informacion);
        }
    } catch (error) {
        console.error('Error toggling user status:', error);
    }
}

async function changeUserRole(userId) {
    try {
        const response = await fetch(`http://localhost:3000/change_user_role`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id_usuario: userId, rol: 'mecanico' })
        });
        const data = await response.json();
        if (data.success) {
            fetchUsers();
        } else {
            alert('Error al cambiar el rol del usuario: ' + data.informacion);
        }
    } catch (error) {
        console.error('Error changing user role:', error);
    }
}
