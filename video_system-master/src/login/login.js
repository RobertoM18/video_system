import api from "../utils/apiHelper.js";

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("registroform");
  const errorContainer = document.querySelector(".error");
  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    let valid = true;

    document
      .querySelectorAll(".error-msm")
      .forEach((el) => (el.textContent = ""));

    const username = document
      .getElementById("username")
      .value.trim()
      .toLowerCase();
    if (username === "") {
      document.getElementById("usernameError").textContent =
        "El nombre de usuario es obligatorio.";
      valid = false;
    }

    const password = document.getElementById("password").value;
    if (password === "") {
      document.getElementById("passwordError").textContent =
        "La contraseña es obligatoria.";
      valid = false;
    }

    if (!valid) return;

    const user = {
      email: username,
      password,
    };

    try {
      const response = await api.post("/users/login", user);
      localStorage.setItem("token", response.data.token);
      window.location.href = "../home/home.html";
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        errorContainer.textContent =
          error.response.data.message || "Error de autenticación";
      } else if (error.request) {
        // The request was made but no response was received
        errorContainer.textContent =
          "No se pudo conectar con el servidor. Intente más tarde.";
      } else {
        // Something happened in setting up the request
        errorContainer.textContent = "Error al intentar iniciar sesión";
      }
    }
  });

  document
    .getElementById("btn-registro")
    .addEventListener("click", function () {
      window.location.href = "../registro/registro.html";
    });
});
