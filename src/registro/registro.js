import api from "../utils/apiHelper.js";

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".toggle-password").forEach((btn) => {
    btn.addEventListener("click", function () {
      const targetId = this.getAttribute("data-target");
      const input = document.getElementById(targetId);
      if (input.type === "password") {
        input.type = "text";
        this.textContent = "Ocultar Contraseña";
      } else {
        input.type = "password";
        this.textContent = "Mostrar Contraseña";
      }
    });
  });

  const form = document.getElementById("registroform");

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    document
      .querySelectorAll(".error-txt")
      .forEach((span) => (span.textContent = ""));

    const name = form.name.value.trim();
    const lastname = form.lastname.value.trim();
    const email = form.email.value.trim().toLowerCase();
    const phone = form.phone.value.trim();
    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;
    const terms = form.terms.checked;

    const errorContainer = document.querySelector(".error");

    let valid = true;

    if (!name) {
      document.getElementById("nameError").textContent = "Ingrese su nombre";
      valid = false;
    }
    if (!lastname) {
      document.getElementById("lastnameError").textContent =
        "Ingrese su apellido";
      valid = false;
    }
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      document.getElementById("emailError").textContent = "Correo inválido";
      valid = false;
    }
    if (!phone || !/^\d{0,10}$/.test(phone)) {
      document.getElementById("phoneError").textContent = "Teléfono inválido";
      valid = false;
    }
    if (!password || password.length < 6) {
      document.getElementById("passwordError").textContent =
        "Mínimo 6 caracteres";
      valid = false;
    }
    if (password !== confirmPassword) {
      document.getElementById("confirmPasswordError").textContent =
        "Las contraseñas no coinciden";
      valid = false;
    }
    if (!terms) {
      document.getElementById("termsError").textContent =
        "Debe aceptar los términos";
      valid = false;
    }

    if (!valid) return;

    const userData = {
      name,
      lastname,
      email,
      phone,
      password,
    };

    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;

    try {
      submitButton.disabled = true;
      submitButton.textContent = "Enviando...";

      const response = await api.post("/users/register", userData);

      errorContainer.textContent = "¡Registro exitoso!";
      errorContainer.style.color = "green";
      console.log("Usuario registrado:", response.data);
      form.reset();

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }

      setTimeout(() => {
        window.location.href = "../login/login.html";
      }, 2000);
    } catch (error) {
      if (error.response) {
        const errorMessage = error.response.data.message;
        if (
          error.response.status === 400 &&
          errorMessage === "El usuario ya existe"
        ) {
          document.getElementById("emailError").textContent =
            "El correo ya está registrado";
        } else {
          // General error
          errorContainer.textContent = errorMessage;
          errorContainer.style.color = "red";
        }
        console.error("Error del servidor:", error.response.data);
      } else if (error.request) {
        errorContainer.textContent =
          "No se pudo conectar con el servidor. Intente nuevamente más tarde.";
        errorContainer.style.color = "red";
        console.error("Error de red:", error.request);
      } else {
        errorContainer.textContent = "Ocurrió un error. Intente nuevamente.";
        errorContainer.style.color = "red";
        console.error("Error:", error.message);
      }
    } finally {
      const submitButton = form.querySelector('button[type="submit"]');
      submitButton.disabled = false;
      submitButton.textContent = originalButtonText;
    }

    document.querySelector(".error-txt").textContent = "¡Registro exitoso!";
    document.querySelector(".error-txt").style.color = "green";
    form.reset();
  });
});
