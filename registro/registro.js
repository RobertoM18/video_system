document.addEventListener("DOMContentLoaded", function(){
    const form = document.getElementById('registroform');
    form.addEventListener('submit', function(event) {
        let valid = true;
        // Limpieza de errores previos
        document.querySelectorAll('.error-txt').forEach(el=> el.textContent = '');
        // Validación de nombre
        const name = document.getElementById('name').value.trim();
        if(name === ''){
            document.getElementById('nameError').textContent = 'El nombre es obligatorio.';
            valid = false;
        }
        // Validación de apellido
        const Lastname = document.getElementById('Lastname').value.trim();
        if(Lastname === ''){
            document.getElementById('LastnameError').textContent = 'El apellido es obligatorio.';
            valid = false;
        }
        // Validación de email
        const email = document.getElementById('email').value.trim();
        const emailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
        if(emailPattern.test(email) === false){
            document.getElementById('emailError').textContent = 'EL email es obligatorio';
            valid = false;
        }

        // Validación de telefono
        const phone = document.getElementById('phone').value.trim();
        const phonePattern = /^\d{10}$/;
        if(phonePattern.test(phone) === false){
            document.getElementById('phoneError').textContent = 'El telefono es obligatorio';
        }

        // Validación de contraseña
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        if(password === ''){
            document.getElementById('passwordError').textContent = 'La contraseña es obligatoria.';
            valid = false;
        }else if(password !== confirmPassword){
            document.getElementById('confirmPasswordError').textContent = 'Las contraseñas no coinciden.'
            valid = false;
        }

        if(confirmPassword === ''){
            document.getElementById('confirmPasswordError').textContent = 'Confirmar contraseña.';
            valid = false;
        }

        // validacion de terminos
        const terms = document.getElementById('terms');
        if(!terms.checked){
            document.getElementById('termsError').textContent = 'Debes aceptar los terminos y condiciones.';
            valid = false;
        }
        // Previene el envío si hay errores
        if(!valid){
            event.preventDefault();
        }
    })
})