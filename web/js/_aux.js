document.addEventListener("DOMContentLoaded", () => {
  const authenticated = localStorage.getItem("authenticated");
  if (authenticated !== "true") {
    alert("Debe iniciar sesión primero.");
    window.location.href = '../index.html';
    return;
  } else {
    const Name_Usuario = localStorage.getItem("Name_Usuario");
    if (Name_Usuario) {
      document.getElementById("Name_Usuario").textContent = Name_Usuario;
    }
  }
});

function mostrarAlertaUsuario() {
  const userId = localStorage.getItem("user_id");
  if (userId) {
    alert("ID de usuario: " + userId);
  } else {
    alert("ID de usuario no encontrado en el local storage.");
  }
};

const M_Cerrar = () => {
  localStorage.removeItem("Name_Usuario");
  localStorage.removeItem("authenticated");
  alert("Cerrando...");
  window.location.href = '../index.html';
};

