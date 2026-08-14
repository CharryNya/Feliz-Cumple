/* ============================================================
   LÓGICA PLAYLIST + CASSETTE + VISUALIZADOR FIX (WEB AUDIO API)
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const modalPlaylist = document.getElementById('modal-1');
  if (!modalPlaylist) return;

  // 1. Inyectar Canvas en el modal si no existe
  if (!document.getElementById('canvas-espectro')) {
    const contenedorModal = modalPlaylist.querySelector('.modal-contenido') || modalPlaylist;
    const visualizadorHTML = `
      <div class="visualizador-audio-container">
        <span class="visualizador-overlay-text">LIVE SPECTRUM // WEB-AUDIO</span>
        <canvas id="canvas-espectro"></canvas>
      </div>
    `;
    const tituloModal = modalPlaylist.querySelector('h2');
    if (tituloModal) {
      tituloModal.insertAdjacentHTML('afterend', visualizadorHTML);
    } else {
      contenedorModal.insertAdjacentHTML('afterbegin', visualizadorHTML);
    }
  }

  const canvas = document.getElementById('canvas-espectro');
  const ctx = canvas ? canvas.getContext('2d') : null;
  
  function ajustarCanvas() {
    if (!canvas) return;
    canvas.width = canvas.offsetWidth || 300;
    canvas.height = canvas.offsetHeight || 60;
  }
  ajustarCanvas();
  window.addEventListener('resize', ajustarCanvas);

  // 2. Web Audio API Singleton
  let audioCtx = null;
  let analizador = null;
  let fuenteAudioMap = new Map();
  let animacionId = null;

  function inicializarAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContextClass();
      analizador = audioCtx.createAnalyser();
      analizador.fftSize = 64;
      analizador.connect(audioCtx.destination);
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  // Renderizador continuo del Canvas
  function renderizarEspectro() {
    if (!analizador || !ctx || !canvas) return;

    const bufferLength = analizador.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analizador.getByteFrequencyData(dataArray);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const anchoBarra = (canvas.width / bufferLength) * 1.5;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      const alturaBarra = (dataArray[i] / 255) * canvas.height;

      const gradiente = ctx.createLinearGradient(0, canvas.height, 0, 0);
      gradiente.addColorStop(0, '#00f3ff');
      gradiente.addColorStop(0.7, '#ff007f');
      gradiente.addColorStop(1, '#ffffff');

      ctx.fillStyle = gradiente;
      ctx.shadowBlur = 6;
      ctx.shadowColor = '#ff007f';

      ctx.fillRect(x, canvas.height - alturaBarra, anchoBarra - 3, alturaBarra);
      x += anchoBarra + 2;
    }

    animacionId = requestAnimationFrame(renderizarEspectro);
  }

  // 3. Tarjetas, Cassettes y Eventos
  const tarjetasCancion = modalPlaylist.querySelectorAll('.cupon');
  const simbolosNotas = ['🎵', '🎶', '🎼', '🎹', '✨'];
  const coloresNotas = ['#00f3ff', '#ff007f', '#ffffff', '#7928ca'];
  let intervaloNotas = null;

  const cassetteHTML = `
    <div class="cyber-cassette">
      <div class="cassette-ventana">
        <div class="carrete"></div>
        <div class="carrete"></div>
      </div>
      <div class="cassette-etiqueta">SIDE-A</div>
    </div>
  `;

  tarjetasCancion.forEach(cupon => {
    const audio = cupon.querySelector('audio');
    if (!audio) return;

    // Prevenir duplicar cassette/wrappers si se recarga el script
    if (!cupon.querySelector('.cyber-cassette')) {
      cupon.insertAdjacentHTML('afterbegin', cassetteHTML);
      const textoExistente = cupon.querySelectorAll('p, strong, audio');
      const wrapperInfo = document.createElement('div');
      wrapperInfo.className = 'cupon-info';
      textoExistente.forEach(elem => wrapperInfo.appendChild(elem));
      cupon.appendChild(wrapperInfo);
    }

    if (!cupon.querySelector('.ecualizador-contenedor')) {
      const eqHTML = `
        <span class="ecualizador-contenedor">
          <span class="barra-eq"></span>
          <span class="barra-eq"></span>
          <span class="barra-eq"></span>
          <span class="barra-eq"></span>
        </span>
      `;
      const titulo = cupon.querySelector('strong');
      if (titulo) titulo.insertAdjacentHTML('beforeend', eqHTML);
    }

    function crearNotaMusical() {
      const nota = document.createElement('span');
      nota.className = 'nota-flotante';
      nota.textContent = simbolosNotas[Math.floor(Math.random() * simbolosNotas.length)];
      nota.style.color = coloresNotas[Math.floor(Math.random() * coloresNotas.length)];
      nota.style.left = `${Math.random() * 70 + 20}%`;
      nota.style.bottom = '15px';
      cupon.appendChild(nota);

      setTimeout(() => nota.remove(), 2200);
    }

    // EVENTO PLAY SAFE
    audio.addEventListener('play', async () => {
      // Activar AudioContext con la interacción del usuario
      inicializarAudioContext();

      // Intentar conectar Audio Node de forma segura
      if (!fuenteAudioMap.has(audio)) {
        try {
          const fuente = audioCtx.createMediaElementSource(audio);
          fuente.connect(analizador);
          fuenteAudioMap.set(audio, fuente);
        } catch (e) {
          console.warn("Audio Node ya vinculado o restricción local:", e);
        }
      }

      // Pausar los demás reproductores
      modalPlaylist.querySelectorAll('audio').forEach(otro => {
        if (otro !== audio) otro.pause();
      });

      if (intervaloNotas) clearInterval(intervaloNotas);

      tarjetasCancion.forEach(c => c.classList.remove('reproduciendo'));
      cupon.classList.add('reproduciendo');

      if (!animacionId) renderizarEspectro();

      crearNotaMusical();
      intervaloNotas = setInterval(() => {
        if (!audio.paused) crearNotaMusical();
      }, 450);
    });

    const detenerEfecto = () => {
      cupon.classList.remove('reproduciendo');
      if (intervaloNotas) {
        clearInterval(intervaloNotas);
        intervaloNotas = null;
      }
      
      const algunSonando = Array.from(modalPlaylist.querySelectorAll('audio')).some(a => !a.paused);
      if (!algunSonando && animacionId) {
        cancelAnimationFrame(animacionId);
        animacionId = null;
        if (ctx && canvas) ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    audio.addEventListener('pause', detenerEfecto);
    audio.addEventListener('ended', detenerEfecto);
  });
});