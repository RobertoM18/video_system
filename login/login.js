document.addEventListener("DOMContentLoaded", function(){
    const form = document.getElementById('Registroform');

    form.addEventListener('submit', function(event) {
        let valid = true;

        // Limpieza de errores previos
        document.querySelectorAll('.error-msm').forEach(el => el.textContent = '');

        // Validación de usuario
        const username = document.getElementById('username').value.trim();
        if (username === '') {
            document.getElementById('usernameError').textContent = 'El nombre de usuario es obligatorio.';
            valid = false;
        }

        // Validación de contraseña
        const password = document.getElementById('password').value.trim();
        if (password === '') {
            document.getElementById('passwordError').textContent = 'La contraseña es obligatoria.';
            valid = false;
        }

        // Previene el envío si hay errores
        if (!valid) {
            event.preventDefault();
        }
    });
});
