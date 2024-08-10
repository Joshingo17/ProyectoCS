function checkMarca() {
    const marca = document.getElementById("marca").value;
    const otraMarcaInput = document.getElementById("otraMarca");
    if (marca === "otro") {
        otraMarcaInput.style.display = "block";
    } else {
        otraMarcaInput.style.display = "none";
    }
}

document
    .getElementById("mantenimientoForm")
    .addEventListener("submit", async function (event) {
        event.preventDefault();

        const idMecanico = localStorage.getItem("user_id");
        if (!idMecanico) {
            alert("ID del mecánico no encontrado en el local storage.");
            return;
        }

        document.getElementById("id_mecanico").value = idMecanico;

        const placa = document.getElementById("placa").value;
        const marca = document.getElementById("marca").value;
        const otraMarca = document.getElementById("otraMarca").value;
        const color = document.getElementById("color").value;
        const modelo = document.getElementById("modelo").value;

        const placaRegex = /^[A-Z]{3}-\d{3}$/;
        if (!placaRegex.test(placa)) {
            alert("El formato de la placa es incorrecto. Debe ser XXX-111.");
            return;
        }

        const informacionVehiculo = `${placa}, ${marca === "otro" ? otraMarca : marca
            }, ${color}, ${modelo}`;
        const idCliente = document.getElementById("id_cliente").value;
        const descripcion = document.getElementById("descripcion").value;
        const comoLlego = document.getElementById("como_llego").value;

        const formData = {
            id_cliente: idCliente,
            id_mecanico: idMecanico,
            descripcion: descripcion,
            informacion_vehiculo: informacionVehiculo,
            como_llego: comoLlego,
        };

        try {
            const response = await axios.post(
                "http://localhost:3000/registrar_mantenimiento",
                formData
            );
            if (response.data.success) {
                alert(response.data.informacion);
                document.getElementById("mantenimientoForm").reset();
            } else {
                alert(
                    "Error al registrar el mantenimiento: " +
                    response.data.informacion
                );
            }
        } catch (error) {
            console.error("Error al registrar el mantenimiento:", error);
            alert("Error al registrar el mantenimiento: " + error.message);
        }
    });