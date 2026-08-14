/* ============================================================
   ANIMACIÓN 4: ESTRELLAS Y LLUVIA DE COMETAS (EL CIELO DE TU DÍA)
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const modalCielo = document.getElementById('modal-2');
  if (!modalCielo) return;

  // 1. Crear Canvas en el modal estelar
  const canvas = document.createElement('canvas');
  canvas.id = 'canvas-cielo-estrellado';
  modalCielo.insertBefore(canvas, modalCielo.firstChild);

  const ctx = canvas.getContext('2d');

  let ancho = canvas.width = modalCielo.clientWidth;
  let alto = canvas.height = modalCielo.clientHeight;

  window.addEventListener('resize', () => {
    ancho = canvas.width = modalCielo.clientWidth;
    alto = canvas.height = modalCielo.clientHeight;
  });

  // 2. CONFIGURACIÓN DE ESTRELLAS TITILANTES
  const totalEstrellas = 70;
  const estrellas = Array.from({ length: totalEstrellas }, () => ({
    x: Math.random() * ancho,
    y: Math.random() * alto,
    tamano: Math.random() * 1.8 + 0.5,
    opacidad: Math.random(),
    velocidadTitileo: (Math.random() - 0.5) * 0.03
  }));

  // 3. CONFIGURACIÓN DE COMETAS (LLUVIA DE ESTRELLAS FUGACES)
  const cometas = [];

  function generarCometa() {
    cometas.push({
      x: Math.random() * (ancho * 0.8),
      y: Math.random() * (alto * 0.4),
      largo: Math.random() * 90 + 60,
      velocidad: Math.random() * 5 + 6,
      opacidad: 1
    });
  }

  // Lanzar un cometa cada 3 segundos
  setInterval(generarCometa, 3000);

  // 4. BUCLE DE ANIMACIÓN
  function animar() {
    ctx.clearRect(0, 0, ancho, alto);

    // Dibujar Estrellas
    estrellas.forEach(e => {
      e.opacidad += e.velocidadTitileo;
      if (e.opacidad <= 0.2 || e.opacidad >= 1) e.velocidadTitileo = -e.velocidadTitileo;

      ctx.beginPath();
      ctx.arc(e.x, e.y, e.tamano, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.1, Math.min(1, e.opacidad))})`;
      ctx.fill();
    });

    // Dibujar Cometas
    cometas.forEach((c, index) => {
      ctx.beginPath();
      const gradiente = ctx.createLinearGradient(c.x, c.y, c.x - c.largo, c.y + c.largo * 0.6);
      gradiente.addColorStop(0, `rgba(255, 255, 255, ${c.opacidad})`);
      gradiente.addColorStop(0.3, `rgba(0, 243, 255, ${c.opacidad * 0.6})`);
      gradiente.addColorStop(1, 'rgba(0, 243, 255, 0)');

      ctx.strokeStyle = gradiente;
      ctx.lineWidth = 2;
      ctx.moveTo(c.x, c.y);
      ctx.lineTo(c.x - c.largo, c.y + c.largo * 0.6);
      ctx.stroke();

      c.x += c.velocidad;
      c.y += c.velocidad * 0.6;
      c.opacidad -= 0.015;

      if (c.opacidad <= 0) cometas.splice(index, 1);
    });

    requestAnimationFrame(animar);
  }

  animar();
});