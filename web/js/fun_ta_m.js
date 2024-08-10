document.addEventListener("DOMContentLoaded", function () {
    loadAllMantenimientosCompletos();
  });

  function loadAllMantenimientosCompletos() {
    axios
      .get(`http://localhost:3000/mantenimientos_completos`)
      .then((response) => {
        const data = response.data.mantenimientos;
        const tbody = document.querySelector("#mantenimientosTable tbody");
        tbody.innerHTML = "";
        data.forEach((mantenimiento) => {
          const tr = document.createElement("tr");

          tr.innerHTML = `
                        <td>${mantenimiento.id_mantenimiento}</td>
                        <td>${mantenimiento.nombre_cliente}</td>
                        <td>${mantenimiento.nombre_mecanico}</td>
                        <td>${mantenimiento.informacion_vehiculo}</td>
                        <td>${
                          mantenimiento.descripcion_del_mantenimiento
                        }</td>
                        <td><button onclick="openInNewTab('${
                          mantenimiento.como_llego
                        }')" class="btn btn-secondary">Ver</button></td>
                        <td><button onclick="openInNewTab('${
                          mantenimiento.como_salio
                        }')" class="btn btn-secondary">Ver</button></td>
                        <td>${mantenimiento.fecha_inicio}</td>
                        <td>${
                          mantenimiento.estado === "en_proceso"
                            ? "Sin_Terminar"
                            : mantenimiento.fecha_finalizacion
                        }</td>
                        <td>${mantenimiento.estado}</td>
                    `;
          tbody.appendChild(tr);
        });

        // Inicializar DataTables después de cargar los datos
        $("#mantenimientosTable").DataTable();
      })
      .catch((error) => {
        console.error("Error al cargar los mantenimientos:", error);
      });
  }

  function openInNewTab(url) {
    window.open(url, "_blank");
  }
