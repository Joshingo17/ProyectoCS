document.addEventListener("DOMContentLoaded", function () {
    loadCitas();
  });

  function loadCitas() {
    axios
      .get("http://localhost:3000/citasa")
      .then((response) => {
        const citas = response.data.citas;
        const tbody = document.querySelector("#citasTable tbody");
        tbody.innerHTML = "";
        citas.forEach((cita) => {
          const tr = document.createElement("tr");

          tr.innerHTML = `
                        <td>${cita.id_cita}</td>
                        <td>${cita.fecha_planeada}</td>
                        <td>${cita.informacion_vehiculo}</td>
                        <td>${cita.fecha_registro}</td>
                        <td>${cita.observaciones}</td>
                        <td>${cita.nombre_completo}</td>
                        <td><button onclick="showObservationModal(${cita.id_cita}, '${cita.observaciones}')" class="btn btn-primary">Agregar Observación</button></td>
                    `;
          tbody.appendChild(tr);
        });

        // Inicializar DataTables después de cargar los datos
        $("#citasTable").DataTable();
      })
      .catch((error) => {
        console.error("Error al cargar las citas:", error);
      });
  }

  function showObservationModal(idCita, currentObservation) {
    const newObservation = prompt(
      "Ingrese la nueva observación:",
      currentObservation
    );
    if (newObservation !== null) {
      updateObservation(idCita, newObservation);
    }
  }

  async function updateObservation(idCita, newObservation) {
    try {
      const response = await axios.post(
        "http://localhost:3000/update_observacion",
        {
          id_cita: idCita,
          observacion: newObservation,
        }
      );
      if (response.data.success) {
        alert("Observación actualizada exitosamente");
        loadCitas();
      } else {
        alert(
          "Error al actualizar la observación: " + response.data.informacion
        );
      }
    } catch (error) {
      console.error("Error al actualizar la observación:", error);
    }
  }