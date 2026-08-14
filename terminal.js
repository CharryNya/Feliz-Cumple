// 1. LISTA DE FRASES EN ORDEN
const frasesCyberpunk = [
  "Entre millones de galaxias y coordenadas, coincidir contigo es mi fenómeno favorito. 🌌",
  "No hay mapa estelar que alcance para medir todo lo que iluminas. ✨",
  "Eres mi constelación preferida en este universo. 🪐",
  "Un brillo neón en medio de tanta rutina. ⚡",
  "Gracias por hacer que los días ordinarios se sientan como una celebración. 💖",
  "Si el tiempo es el mejor regalo, pasar el mío contigo es mi inversión favorita. ⏳",
  "Que este nuevo año de vida te devuelva multiplicado todo el cariño que regalas. 🎂",
  "Hay personas que son refugio, y tú eres una de ellas. 🛡️",
  "Vales más que el Wi-Fi rápido y el café de la mañana. ☕",
  "Un año más sabio/a... o al menos disimulas bastante bien. 😜",
  "Prometo seguir aguantando tus locuras un año más (y los que vengan). 🚀"
];

let escribiendo = false;
let indiceFraseActual = 0; // Guardamos la posición inicial (empieza en la 1ra frase)

function generarMensaje() {
  if (escribiendo) return; // Evita clics seguidos mientras se escribe

  const pantalla = document.getElementById("terminal-texto");
  const boton = document.getElementById("btn-generar-frase");

  // Toma la frase según el orden en la lista
  const fraseSeleccionada = frasesCyberpunk[indiceFraseActual];

  // Avanza al siguiente número para el próximo clic
  indiceFraseActual++;

  // Si llega al final de la lista, vuelve al inicio (frase 0)
  if (indiceFraseActual >= frasesCyberpunk.length) {
    indiceFraseActual = 0;
  }

  pantalla.innerHTML = "";
  escribiendo = true;
  boton.disabled = true;

  let i = 0;
  // Efecto de máquina de escribir
  const intervalo = setInterval(() => {
    pantalla.innerHTML += fraseSeleccionada.charAt(i);
    i++;

    if (i >= fraseSeleccionada.length) {
      clearInterval(intervalo);
      escribiendo = false;
      boton.disabled = false;
    }
  }, 40);
}