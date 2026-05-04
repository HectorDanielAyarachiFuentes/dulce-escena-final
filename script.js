// ====== PRECARGA DE IMÁGENES ======
const imagesToLoad = [
    'img/back-2.webp',
    'img/back.webp',
    'img/front.webp',
    'img/dibujando.webp'
];

const preloader = document.getElementById('preloader');
const progressFill = document.querySelector('.progress-fill');
const scene = document.querySelector('.scene-container');
const statusText = document.querySelector('.loader-status');

let loadedCount = 0;

function updateProgress() {
    loadedCount++;
    const percentage = (loadedCount / imagesToLoad.length) * 100;
    progressFill.style.width = `${percentage}%`;
    
    if (loadedCount === imagesToLoad.length) {
        setTimeout(revealScene, 500); // Pequeño delay para suavidad
    }
}

function revealScene() {
    preloader.classList.add('fade-out');
    scene.style.opacity = '1';
    statusText.textContent = "Listo";
}

// Cargar cada imagen
imagesToLoad.forEach(src => {
    const img = new Image();
    img.onload = updateProgress;
    img.onerror = updateProgress; // Continuar aunque falle una
    img.src = src;
});

// ====== MÚSICA ======
const musica = document.getElementById('musica');
const startMusic = () => {
    musica.play().catch(e => console.log("Esperando interacción para música..."));
    document.removeEventListener('click', startMusic);
    document.removeEventListener('touchstart', startMusic);
};

document.addEventListener('click', startMusic);
document.addEventListener('touchstart', startMusic);
