
    // Validar si el usuario está autenticado al cargar la página
    const token = localStorage.getItem('token');

    if (!token) {
        alert("Acceso denegado. Por favor inicia sesión.");
        window.location.href = '/'; // Lo devuelve a la pantalla de login por la fuerza
    }

    // Muestra el nombre del usuario actual en la esquina superior derecha.

    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      const usuario = JSON.parse(usuarioGuardado);
      const rol = usuario.rol ? ` (${usuario.rol})` : '';
      document.getElementById('usuarioActual').textContent = `${usuario.nombre}${rol}`;
    }

    // Obtiene los elementos del HTML que necesita controlar el carrusel.
    const track = document.getElementById('carouselTrack');
    const slides = Array.from(track.children);
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    const dotsNav = document.getElementById('carouselDots');

    // Guarda la posición de la diapositiva que se está mostrando.
    let currentIndex = 0;

    // Crea un punto por cada diapositiva y permite seleccionarla al hacer clic.
    slides.forEach((_, index) => {
      const dot = document.createElement('div');
      dot.classList.add('dot');

      // El primer punto comienza marcado porque la primera diapositiva es visible.
      if (index === 0) dot.classList.add('active');
      dot.addEventListener('click', () => moveToSlide(index));
      dotsNav.appendChild(dot);
    });

    // Guarda los puntos creados para poder cambiar cuál aparece activo.
    const dots = Array.from(dotsNav.children);

    // Mueve el carrusel hasta la diapositiva indicada y actualiza el punto activo.
    function moveToSlide(index) {
      track.style.transform = `translateX(-${index * 100}%)`;
      dots[currentIndex].classList.remove('active');
      dots[index].classList.add('active');
      currentIndex = index;
    }

    // Al pulsar el botón siguiente, avanza una posición.
    // El operador % permite volver a la primera diapositiva al llegar al final.
    nextBtn.addEventListener('click', () => {
      const nextIndex = (currentIndex + 1) % slides.length;
      moveToSlide(nextIndex);
    });

    // Al pulsar el botón anterior, retrocede una posición.
    // La suma slides.length evita obtener una posición negativa.
    prevBtn.addEventListener('click', () => {
      const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
      moveToSlide(prevIndex);
    });

    // Cambia automáticamente de diapositiva cada cinco segundos.
    setInterval(() => {
      const nextIndex = (currentIndex + 1) % slides.length;
      moveToSlide(nextIndex);
    }, 5000);

    // ==========================================
    // LÓGICA PARA CERRAR SESIÓN
    // ==========================================
    const btnLogOut = document.getElementById('btnLogOut');
    if (btnLogOut) {
      btnLogOut.addEventListener('click', () => {
        fetch('/api/auth/logout', { method: 'POST' })
          .finally(() => {
            localStorage.removeItem('token');
            localStorage.removeItem('usuario');
            window.location.href = '/';
          });
      });
    }