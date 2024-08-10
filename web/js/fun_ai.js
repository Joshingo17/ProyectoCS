document.addEventListener("DOMContentLoaded", async () => {
    try {
      const response = await fetch("http://localhost:3000/dashboard-data");
      const data = await response.json();

      document.getElementById("usuarios-activos").textContent =
        data.usuarios_activos;
      document.getElementById("mantenimientos-proceso").textContent =
        data.mantenimientos_proceso;
      document.getElementById("mantenimientos-finalizados").textContent =
        data.mantenimientos_finalizados;
      document.getElementById("numero-citas").textContent =
        data.numero_citas;
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  });