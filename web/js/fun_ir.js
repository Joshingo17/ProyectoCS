function M_Ingreso() {
    const User = document.getElementById("txtusuario").value.trim();
    const Pass = document.getElementById("txtcontraseña").value.trim();

    if (User === "" || Pass === "") {
        alert("Por favor, ingresa usuario y contraseña.");
        M_Limpiar();
        return;
    }

    axios({
        method: "POST",
        url: "http://127.0.0.1:3000/ingreso",
        data: {
            usuario: User,
            contraseña: Pass,
        },
    })
    .then(function (response) {
        console.log("Respuesta del servidor:", response.data);
        alert(response.data.informacion);
        M_Limpiar();

        if (response.data.token) {
            localStorage.setItem("jwt_token", response.data.token);  
            localStorage.setItem("usuario", JSON.stringify(response.data.usuario));  
            localStorage.setItem("authenticated", "true");
            localStorage.setItem("Name_Usuario", response.data.nombre_completo);  
            localStorage.setItem("user_id", response.data.user_id);  

            alert(`Bienvenid@, ${response.data.nombre_completo}`);

            
            setTimeout(() => {
                const rol = response.data.rol;  

                switch (rol) {
                    case "administrador":
                        window.location.href = "html/a_comunidad.html";
                        break;
                    case "mecanico":
                        window.location.href = "html/m_enproceso.html";
                        break;
                    case "cliente":
                        window.location.href = "html/c_enproceso.html";
                        break;
                    default:
                        console.error("Rol de usuario no válido");
                }
            }, 1000); //establecer tiempo
        }
    })
    .catch(function (error) {
        console.error("Error en la petición:", error);
        alert(
            "Hubo un problema al intentar iniciar sesión. Por favor, intenta de nuevo más tarde."
        );
        M_Limpiar();
    });
}


function M_Registro() {
  const Name = document.getElementById("txtnombre_completo").value.trim();
  const Email = document.getElementById("txtemail").value.trim();
  const Phone = document.getElementById("txttelefono").value.trim();
  const User = document.getElementById("txtusuario").value.trim();
  const Pass = document.getElementById("txtcontrasena").value.trim();
  const PassC = document.getElementById("txtconfirmar_contrasena").value.trim();

  if (!Name || !Email || !Phone || !User || !Pass || !PassC) {
    alert("Por favor, completa todos los campos.");
    return;
  }

  if (!/^\d+$/.test(Phone)) {
    alert("El teléfono debe contener solo números.");
    return;
  }

  if (Pass !== PassC) {
    alert("Las contraseñas no coinciden.");
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(Email)) {
    alert("Por favor, ingresa un correo electrónico válido.");
    return;
  }

  axios({
    method: "POST",
    url: "http://127.0.0.1:3000/check_user",
    data: {
      usuario: User,
    },
  })
    .then(function (response) {
      if (response.data.existe) {
        alert("El usuario ya existe. Por favor, elige otro nombre de usuario.");
        document.getElementById("txtusuario").value = "";
      } else {
        axios({
          method: "POST",
          url: "http://127.0.0.1:3000/register",
          data: {
            usuario: User,
            contraseña: Pass,
            nombre_completo: Name,
            correo: Email,
            numero_telefono: Phone,
            rol: "cliente",
          },
        })
          .then(function (response) {
            alert(response.data.informacion);
            document.getElementById("txtnombre_completo").value = "";
            document.getElementById("txtemail").value = "";
            document.getElementById("txttelefono").value = "";
            document.getElementById("txtusuario").value = "";
            document.getElementById("txtcontrasena").value = "";
            document.getElementById("txtconfirmar_contrasena").value = "";
          })
          .catch(function (error) {
            console.error("Error en la petición:", error);
            alert(
              "Hubo un problema al intentar registrar el usuario. Por favor, intenta de nuevo más tarde."
            );
          });
      }
    })
    .catch(function (error) {
      console.error("Error en la petición:", error);
      alert(
        "Hubo un problema al verificar el usuario. Por favor, intenta de nuevo más tarde."
      );
    });
}

function M_Limpiar() {
  document.getElementById("txtusuario").value = "";
  document.getElementById("txtcontraseña").value = "";
}
