/* ============================================================
   MOTOR DEL MENÚ: ECOS DE LUZ Y CHISPAS EN REGALOS
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const pantallaMenu = document.getElementById('pantalla-menu');
  if (!pantallaMenu) return;

  // 1. Crear Canvas dinámico
  const canvas = document.createElement('canvas');
  canvas.id = 'canvas-neon-menu';
  pantallaMenu.appendChild(canvas);

  const ctx = canvas.getContext('2d');

  let ancho = canvas.width = pantallaMenu.clientWidth;
  let alto = canvas.height = pantallaMenu.clientHeight;

  window.addEventListener('resize', () => {
    ancho = canvas.width = pantallaMenu.clientWidth;
    alto = canvas.height = pantallaMenu.clientHeight;
  });

  // ------------------------------------------------------------
  // 2. ORBES DE ENERGÍA Y PARTÍCULAS DE FONDO
  // ------------------------------------------------------------
  const totalOrbes = 35;
  const orbes = [];
  const coloresOrbes = ['#00f3ff', '#ff0055', '#ffffff', '#7928ca'];

  class OrbeMenu {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * ancho;
      this.y = Math.random() * alto;
      this.radio = Math.random() * 3 + 1;
      this.velocidadY = (Math.random() * -0.8) - 0.2;
      this.velocidadX = (Math.random() - 0.5) * 0.5;
      this.color = coloresOrbes[Math.floor(Math.random() * coloresOrbes.length)];
      this.opacidad = Math.random() * 0.6 + 0.2;
      this.pulsacion = Math.random() * Math.PI;
    }

    actualizar() {
      this.y += this.velocidadY;
      this.x += this.velocidadX;
      this.pulsacion += 0.03;

      if (this.y < -10 || this.x < -10 || this.x > ancho + 10) {
        this.reset();
        this.y = alto + 10;
      }
    }

    dibujar() {
      ctx.save();
      const alfaDinamico = this.opacidad + Math.sin(this.pulsacion) * 0.2;
      ctx.globalAlpha = Math.max(0, Math.min(1, alfaDinamico));
      ctx.fillStyle = this.color;

      ctx.shadowBlur = 12;
      ctx.shadowColor = this.color;

      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radio, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < totalOrbes; i++) {
    orbes.push(new OrbeMenu());
  }

  // ------------------------------------------------------------
  // 3. CHISPAS INTERACTIVAS AL PASAR EL CURSOR (SIN MODIFICAR TRANSFORM)
  // ------------------------------------------------------------
  const chispasHover = [];

  function crearChispaRegalo(x, y) {
    for (let i = 0; i < 4; i++) {
      chispasHover.push({
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 5,
        vy: (Math.random() - 0.5) * 5,
        color: Math.random() > 0.5 ? '#00f3ff' : '#ff0055',
        tamano: Math.random() * 3 + 1.5,
        vida: 1.0
      });
    }
  }

  const cajasRegalo = document.querySelectorAll('.caja-regalo');

  cajasRegalo.forEach(caja => {
    // Generar únicamente chispas de neón en el canvas de fondo
    caja.addEventListener('mousemove', (e) => {
      const rect = pantallaMenu.getBoundingClientRect();
      crearChispaRegalo(e.clientX - rect.left, e.clientY - rect.top);
    });
  });

  function actualizarChispas() {
    for (let i = chispasHover.length - 1; i >= 0; i--) {
      const c = chispasHover[i];
      c.x += c.vx;
      c.y += c.vy;
      c.vida -= 0.04;

      if (c.vida <= 0) {
        chispasHover.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.globalAlpha = c.vida;
      ctx.fillStyle = c.color;
      ctx.shadowBlur = 8;
      ctx.shadowColor = c.color;

      ctx.beginPath();
      ctx.arc(c.x, c.y, c.tamano, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // ------------------------------------------------------------
  // 4. BUCLE DE ANIMACIÓN DEL MENÚ
  // ------------------------------------------------------------
  function bucleMenu() {
    ctx.clearRect(0, 0, ancho, alto);

    // Dibujar orbes flotantes
    orbes.forEach(o => {
      o.actualizar();
      o.dibujar();
    });

    // Dibujar chispas de interacción
    actualizarChispas();

    requestAnimationFrame(bucleMenu);
  }

  bucleMenu();
});