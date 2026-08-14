document.addEventListener('DOMContentLoaded', () => {

  const btnPlay = document.getElementById('btn-play');
  const pantallaInicio = document.getElementById('pantalla-inicio');
  const pantallaMenu = document.getElementById('pantalla-menu');

  if (btnPlay) {
    btnPlay.addEventListener('click', () => {
      if (pantallaInicio && pantallaMenu) {
        pantallaInicio.classList.add('oculta');
        pantallaMenu.classList.remove('oculta');
      }
    });
  }

  const cajas = document.querySelectorAll('.caja-regalo');

  cajas.forEach(caja => {
    caja.addEventListener('click', () => {
      const numeroRegalo = caja.getAttribute('data-regalo');
      caja.classList.add('abierta');

      setTimeout(() => {
        if (numeroRegalo) {
          abrirModal(parseInt(numeroRegalo));
        }
      }, 500);
    });
  });

  window.addEventListener('click', (e) => {
    const modales = document.querySelectorAll('.modal-pestana');
    modales.forEach(modal => {
      if (e.target === modal) {
        cerrarModal();
      }
    });
  });

});

function abrirModal(numero) {
  const modal = document.getElementById(`modal-${numero}`);
  if (modal) {
    modal.classList.remove('oculta');
  }
}

function cerrarModal(numero) {
  document.querySelectorAll('audio').forEach(audio => audio.pause());

  if (numero) {
    const modal = document.getElementById(`modal-${numero}`);
    if (modal) modal.classList.add('oculta');
  } else {
    document.querySelectorAll('.modal-pestana').forEach(modal => modal.classList.add('oculta'));
  }

  document.querySelectorAll('.caja-regalo').forEach(caja => caja.classList.remove('abierta'));
}