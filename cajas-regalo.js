/* ============================================================
   MOTOR 3D CYBERPUNK: INTERACCIÓN DE CAJAS Y CONFETI NEÓN
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // ------------------------------------------------------------
  // A. PREPARAR CANVAS GLOBAL DE PARTÍCULAS
  // ------------------------------------------------------------
  let canvas = document.getElementById('canvas-particulas-neon');
  
  // Si no existe el canvas en el HTML, lo inyectamos dinámicamente
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.id = 'canvas-particulas-neon';
    document.body.appendChild(canvas);
  }

  const ctx = canvas.getContext('2d');
  let particulas = [];
  let animacionId = null;

  function redimensionarCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  redimensionarCanvas();
  window.addEventListener('resize', redimensionarCanvas);

  // Clase para gestionar cada partícula de confeti neón
  class ParticulaNeon {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.tamano = Math.random() * 5 + 2;
      this.esCuadrado = Math.random() > 0.5; // Alterna entre círculo y píxel cyberpunk

      const angulo = Math.random() * Math.PI * 2;
      const velocidad = Math.random() * 9 + 4;
      this.vx = Math.cos(angulo) * velocidad;
      this.vy = Math.sin(angulo) * velocidad;

      const colores = ['#00f3ff', '#ff007f', '#ffffff', '#7928ca'];
      this.color = colores[Math.floor(Math.random() * colores.length)];

      this.vida = 1.0;
      this.desvanecimiento = Math.random() * 0.02 + 0.015;
      this.gravedad = 0.18;
      this.friccion = 0.95;
    }

    actualizar() {
      this.vx *= this.friccion;
      this.vy *= this.friccion;
      this.vy += this.gravedad;
      
      this.x += this.vx;
      this.y += this.vy;
      
      this.vida -= this.desvanecimiento;
    }

    dibujar(contexto) {
      if (this.vida <= 0) return;

      contexto.save();
      contexto.globalAlpha = Math.max(0, this.vida);
      contexto.fillStyle = this.color;
      contexto.shadowBlur = 10;
      contexto.shadowColor = this.color;

      contexto.beginPath();
      if (this.esCuadrado) {
        contexto.fillRect(this.x - this.tamano / 2, this.y - this.tamano / 2, this.tamano, this.tamano);
      } else {
        contexto.arc(this.x, this.y, this.tamano, 0, Math.PI * 2);
        contexto.fill();
      }
      contexto.restore();
    }
  }

  // Disparador del estallido
  function estallarConfetiNeon(x, y, cantidad = 50) {
    for (let i = 0; i < cantidad; i++) {
      particulas.push(new ParticulaNeon(x, y));
    }

    if (!animacionId) {
      bucleAnimacion();
    }
  }

  function bucleAnimacion() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = particulas.length - 1; i >= 0; i--) {
      const p = particulas[i];
      p.actualizar();
      p.dibujar(ctx);

      if (p.vida <= 0) {
        particulas.splice(i, 1);
      }
    }

    if (particulas.length > 0) {
      animacionId = requestAnimationFrame(bucleAnimacion);
    } else {
      animacionId = null;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  // ------------------------------------------------------------
  // B. MOTOR DE INTERACCIÓN Y APERTURA DE CAJAS 3D
  // ------------------------------------------------------------
  const cajas = document.querySelectorAll('.caja-regalo');

  cajas.forEach(caja => {
    // 1. EFECTO DE ROTACIÓN 3D SIGUIENDO EL CURSOR
    caja.addEventListener('mousemove', (e) => {
      if (caja.classList.contains('abierta')) return;

      const rect = caja.getBoundingClientRect();
      const centroX = rect.left + rect.width / 2;
      const centroY = rect.top + rect.height / 2;

      const deltaX = (e.clientX - centroX) / (rect.width / 2);
      const deltaY = (e.clientY - centroY) / (rect.height / 2);

      const maxRotacion = 15;
      const rotX = -deltaY * maxRotacion;
      const rotY = deltaX * maxRotacion;

      caja.style.transform = `perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) scale(1.04)`;
    });

    // 2. RESTAURAR POSICIÓN ORIGINAL AL QUITAR EL MOUSE
    caja.addEventListener('mouseleave', () => {
      if (caja.classList.contains('abierta')) return;

      caja.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1.0)';
    });

    // 3. EVENTO DE APERTURA CON EXPLOSIÓN DE CONFETI NEÓN
    caja.addEventListener('click', (e) => {
      // Calcular centro exacto de la caja para la explosión
      const rect = caja.getBoundingClientRect();
      const centroX = rect.left + rect.width / 2;
      const centroY = rect.top + rect.height / 2;

      // Disparar las partículas
      estallarConfetiNeon(centroX, centroY, 55);

      // Marcar como abierta para detener tilt 3D
      caja.classList.add('abierta');
    });
  });
});