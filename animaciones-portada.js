/* ============================================================
   MOTOR VISUAL AVANZADO: LLUVIA, CONFETI 3D Y DESTELLOS NEÓN
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const pantallaInicio = document.getElementById('pantalla-inicio');
  if (!pantallaInicio) return;

  // 1. Inicialización de Canvas
  const canvas = document.createElement('canvas');
  canvas.id = 'canvas-neon-portada';
  pantallaInicio.appendChild(canvas);

  const ctx = canvas.getContext('2d');

  let ancho = canvas.width = pantallaInicio.clientWidth;
  let alto = canvas.height = pantallaInicio.clientHeight;

  window.addEventListener('resize', () => {
    ancho = canvas.width = pantallaInicio.clientWidth;
    alto = canvas.height = pantallaInicio.clientHeight;
  });

  // ------------------------------------------------------------
  // 2. SISTEMA DE LLUVIA NEÓN CON SALPICADURAS (SPLASHES)
  // ------------------------------------------------------------
  const totalGotas = 65;
  const gotas = [];
  const salpicaduras = [];
  const coloresNeonLluvia = [
    'rgba(0, 243, 255, ',   // Cian
    'rgba(255, 0, 85, ',    // Magenta
    'rgba(255, 255, 255, '  // Blanco
  ];

  class Gota {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * (ancho + 120) - 60;
      this.y = Math.random() * -alto;
      this.longitud = Math.random() * 22 + 14;
      this.velocidad = Math.random() * 9 + 11;
      this.grosor = Math.random() * 1.4 + 0.6;
      this.colorBase = coloresNeonLluvia[Math.floor(Math.random() * coloresNeonLluvia.length)];
      this.opacidad = Math.random() * 0.4 + 0.15;
    }

    actualizar() {
      this.y += this.velocidad;
      this.x -= this.velocidad * 0.12; // Ánculo leve de lluvia

      // Cuando la gota llega al fondo de la pantalla, genera una pequeña salpicadura
      if (this.y >= alto - 10) {
        if (Math.random() > 0.5) {
          crearSalpicadura(this.x, alto - 5, this.colorBase);
        }
        this.reset();
        this.y = 0;
      }
    }

    dibujar() {
      ctx.beginPath();
      ctx.lineWidth = this.grosor;
      
      const gradiente = ctx.createLinearGradient(
        this.x, this.y, 
        this.x - (this.velocidad * 0.12), this.y + this.longitud
      );
      gradiente.addColorStop(0, this.colorBase + '0)');
      gradiente.addColorStop(0.5, this.colorBase + this.opacidad + ')');
      gradiente.addColorStop(1, this.colorBase + (this.opacidad * 0.8) + ')');

      ctx.strokeStyle = gradiente;
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.x - (this.velocidad * 0.12), this.y + this.longitud);
      ctx.stroke();
    }
  }

  function crearSalpicadura(x, y, colorBase) {
    for (let i = 0; i < 3; i++) {
      salpicaduras.push({
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() * -3) - 1,
        radio: Math.random() * 1.5 + 0.5,
        opacidad: 0.8,
        colorBase: colorBase
      });
    }
  }

  function actualizarSalpicaduras() {
    for (let i = salpicaduras.length - 1; i >= 0; i--) {
      const s = salpicaduras[i];
      s.x += s.vx;
      s.y += s.vy;
      s.opacidad -= 0.04;

      if (s.opacidad <= 0) {
        salpicaduras.splice(i, 1);
        continue;
      }

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.radio, 0, Math.PI * 2);
      ctx.fillStyle = s.colorBase + s.opacidad + ')';
      ctx.fill();
    }
  }

  // ------------------------------------------------------------
  // 3. SISTEMA DE CONFETI NEÓN CON GIRO 3D
  // ------------------------------------------------------------
  const totalConfeti = 40;
  const listaConfeti = [];
  const paletaConfeti = ['#00f3ff', '#ff0055', '#ffe600', '#ff00ea', '#00ffaa'];

  class Confeti3D {
    constructor() {
      this.reset(true);
    }

    reset(inicioAleatorio = false) {
      this.x = Math.random() * ancho;
      this.y = inicioAleatorio ? Math.random() * alto : -20;
      this.ancho = Math.random() * 8 + 6;
      this.alto = Math.random() * 6 + 4;
      this.velocidadY = Math.random() * 2 + 1;
      this.velocidadX = Math.random() * 1.5 - 0.75;
      
      // Simulación 3D (Rotación en ejes)
      this.rotacionX = Math.random() * Math.PI;
      this.rotacionY = Math.random() * Math.PI;
      this.vRotacionX = Math.random() * 0.08 + 0.02;
      this.vRotacionY = Math.random() * 0.08 + 0.02;

      this.color = paletaConfeti[Math.floor(Math.random() * paletaConfeti.length)];
      this.opacidad = Math.random() * 0.7 + 0.3;
      this.oscilacion = Math.random() * Math.PI * 2;
    }

    actualizar() {
      this.oscilacion += 0.03;
      this.x += Math.sin(this.oscilacion) * 1.2 + this.velocidadX;
      this.y += this.velocidadY;

      this.rotacionX += this.vRotacionX;
      this.rotacionY += this.vRotacionY;

      if (this.y > alto + 20) {
        this.reset(false);
      }
    }

    dibujar() {
      ctx.save();
      ctx.translate(this.x, this.y);

      // Aplicar proyección 3D simple mediante escalado sinusoidal
      const escalaX = Math.cos(this.rotacionX);
      const escalaY = Math.sin(this.rotacionY);

      ctx.scale(escalaX, escalaY);
      ctx.globalAlpha = this.opacidad;
      ctx.fillStyle = this.color;

      // Resplandor neón
      ctx.shadowBlur = 10;
      ctx.shadowColor = this.color;

      ctx.fillRect(-this.ancho / 2, -this.alto / 2, this.ancho, this.alto);
      ctx.restore();
    }
  }

  // ------------------------------------------------------------
  // 4. LUCECITAS Y HALOS AMBIENTALES EN EL FONDO NEÓN
  // ------------------------------------------------------------
  const destellos = [
    { xRatio: 0.18, yRatio: 0.35, color: 'rgba(0, 243, 255, ', radio: 70 },
    { xRatio: 0.82, yRatio: 0.28, color: 'rgba(255, 0, 85, ', radio: 85 },
    { xRatio: 0.50, yRatio: 0.18, color: 'rgba(255, 255, 255, ', radio: 90 }
  ];

  let tiempoGlobal = 0;

  function dibujarHalosAmbientales() {
    destellos.forEach((d) => {
      const px = ancho * d.xRatio;
      const py = alto * d.yRatio;
      const brillo = Math.sin(tiempoGlobal * 0.025 + px) * 0.1 + 0.16;

      const radial = ctx.createRadialGradient(px, py, 0, px, py, d.radio);
      radial.addColorStop(0, d.color + brillo + ')');
      radial.addColorStop(1, d.color + '0)');

      ctx.fillStyle = radial;
      ctx.beginPath();
      ctx.arc(px, py, d.radio, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  // ------------------------------------------------------------
  // 5. INICIALIZACIÓN Y BUCLE PRINCIPAL (60 FPS)
  // ------------------------------------------------------------
  for (let i = 0; i < totalGotas; i++) gotas.push(new Gota());
  for (let i = 0; i < totalConfeti; i++) listaConfeti.push(new Confeti3D());

  function bucleAnimacion() {
    ctx.clearRect(0, 0, ancho, alto);
    tiempoGlobal++;

    // 1. Dibujar destellos de fondo
    dibujarHalosAmbientales();

    // 2. Dibujar y actualizar lluvia + gotas en el suelo
    gotas.forEach(g => {
      g.actualizar();
      g.dibujar();
    });
    actualizarSalpicaduras();

    // 3. Dibujar y actualizar confeti 3D
    listaConfeti.forEach(c => {
      c.actualizar();
      c.dibujar();
    });

    requestAnimationFrame(bucleAnimacion);
  }

  bucleAnimacion();
});