document.addEventListener("DOMContentLoaded", function () {
    fetchMantenimientosFinalizados();
    
  });

  async function fetchMantenimientosFinalizados() {
    try {
      const idMecanico = localStorage.getItem("user_id");
      const response = await fetch(
        `http://localhost:3000/mantenimientos?estado=finalizado&id_mecanico=${idMecanico}`
      );
      const data = await response.json();
      const mantenimientos = data.mantenimientos;
      populateMantenimientosTable(mantenimientos);
    } catch (error) {
      console.error("Error fetching mantenimientos:", error);
    }
  }

  function populateMantenimientosTable(mantenimientos) {
    const tableBody = document
      .getElementById("mantenimientosTable")
      .getElementsByTagName("tbody")[0];
    tableBody.innerHTML = "";

    mantenimientos.forEach((mantenimiento) => {
      const row = document.createElement("tr");
      row.innerHTML = `
                <td>${mantenimiento.id_mantenimiento}</td>
                <td>${mantenimiento.nombre_completo}</td>
                <td>${mantenimiento.informacion_vehiculo}</td>
                <td>${mantenimiento.descripcion_del_mantenimiento}</td>
                <td><button onclick="openInNewTab('${mantenimiento.como_llego}')" class="btn btn-secondary">Ver</button></td>
                <td><button onclick="openInNewTab('${mantenimiento.como_salio}')" class="btn btn-secondary">Ver</button></td>
                <td>${mantenimiento.fecha_inicio}</td>
                <td>${mantenimiento.fecha_finalizacion}</td>
            `;
      tableBody.appendChild(row);
    });

    // Inicializar DataTable
    $("#mantenimientosTable").DataTable();
  }

  function openInNewTab(url) {
    window.open(url, "_blank");
  }

  function setLogoutTimer() {
    setTimeout(() => {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('authenticated');
    alert('Tu sesión ha expirado. Serás redirigido al inicio de sesión.');
    window.location.href = '../index.html';
      }, 60000); //1 minuto
    }

