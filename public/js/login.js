const loginForm = document.getElementById('loginForm');
const errorMensaje = document.getElementById('errorMensaje');
const btnSubmit = document.getElementById('btnSubmit');

loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    errorMensaje.classList.add('hidden');
    btnSubmit.disabled = true;

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'No fue posible iniciar sesión.');
        }

        localStorage.setItem('token', data.token);
        localStorage.setItem('usuario', JSON.stringify(data.usuario));
        window.location.href = '/dashboard';
    } catch (error) {
        errorMensaje.textContent = error.message;
        errorMensaje.classList.remove('hidden');
        btnSubmit.disabled = false;
    }
});
