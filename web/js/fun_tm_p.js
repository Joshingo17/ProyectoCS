document.addEventListener("DOMContentLoaded", function () {
    loadMantenimientos();
  });

  function loadMantenimientos() {
    const id_mecanico = localStorage.getItem("user_id");
    if (!id_mecanico) {
      console.error("id_mecanico no está definido en localStorage");
      return;
    }
    axios
      .get(
        `http://localhost:3000/mantenimientos?estado=en_proceso&id_mecanico=${id_mecanico}`
      )
      .then((response) => {
        const data = response.data.mantenimientos;
        const tbody = document.querySelector("#mantenimientosTable tbody");
        tbody.innerHTML = "";
        data.forEach((mantenimiento) => {
          const tr = document.createElement("tr");

          tr.innerHTML = `
            <td>${mantenimiento.id_mantenimiento}</td>
            <td>${mantenimiento.nombre_completo}</td>
            <td>${mantenimiento.informacion_vehiculo}</td>
            <td>${mantenimiento.descripcion_del_mantenimiento}</td>
            <td><button onclick="openInNewTab('${mantenimiento.como_llego}')" class="btn btn-secondary">Ver</button></td>
            <td>${mantenimiento.fecha_inicio}</td>
            <td>
              <button onclick="openModal(${mantenimiento.id_mantenimiento})" class="btn btn-primary">Agregar</button>
              <button onclick="finalizarMantenimiento(${mantenimiento.id_mantenimiento})" class="btn btn-success mt-1">Finalizar</button>
            </td>
          `;
          tbody.appendChild(tr);
        });

        $("#mantenimientosTable").DataTable();
      })
      .catch((error) => {
        console.error("Error al cargar los mantenimientos:", error);
      });
  }

  function openModal(id_mantenimiento) {
    $("#fotoModal").modal("show");
    $("#fotoForm")
      .off("submit")
      .on("submit", function (e) {
        e.preventDefault();
        agregarFoto(id_mantenimiento);
      });
  }

  function agregarFoto(id_mantenimiento) {
    const fotoUrl = document.getElementById("fotoUrl").value;
    if (fotoUrl) {
      axios
        .post("http://localhost:3000/agregar_como_salio", {
          id_mantenimiento,
          como_salio: fotoUrl,
        })
        .then((response) => {
          const data = response.data;
          if (data.success) {
            alert("Foto de salida agregada con éxito.");
            $("#fotoModal").modal("hide");
            loadMantenimientos();
          } else {
            alert(
              "Error al agregar la foto de salida: " + data.informacion
            );
          }
        })
        .catch((error) => {
          console.error("Error al agregar la foto de salida:", error);
        });
    }
  }

  function finalizarMantenimiento(id_mantenimiento) {
    axios
      .post("http://localhost:3000/finalizar_mantenimiento", {
        id_mantenimiento,
      })
      .then((response) => {
        const data = response.data;
        if (data.success) {
          alert("Mantenimiento finalizado con éxito.");
          loadMantenimientos();
        } else {
          alert("Error al finalizar el mantenimiento: " + data.informacion);
        }
      })
      .catch((error) => {
        console.error("Error al finalizar el mantenimiento:", error);
      });
  }

  function openInNewTab(url) {
    window.open(url, "_blank");
  }