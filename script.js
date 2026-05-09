// ====== PRECARGA DE IMÁGENES ======
const imagesToLoad = [
    'img/back-2.webp',
    'img/back.webp',
    'img/front.webp',
    'img/dulce.webp',
    'img/atril.webp'
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

// ====== MÚSICA Y ANALIZADOR ======
const musica = document.getElementById('musica');
const clouds = document.querySelector('.clouds');
const sky = document.querySelector('.sky');

let audioCtx;
let analyser;
let dataArray;
let source;

const startMusic = () => {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioCtx.createAnalyser();
        source = audioCtx.createMediaElementSource(musica);
        source.connect(analyser);
        analyser.connect(audioCtx.destination);
        
        analyser.fftSize = 256;
        const bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);
        
        animate();
    }

    musica.play().catch(e => console.log("Esperando interacción para música..."));
    updateMusicButton();
    document.removeEventListener('click', startMusic);
    document.removeEventListener('touchstart', startMusic);
};

// ====== CONTROL DE MÚSICA ======
const musicControl = document.getElementById('musicControl');
const playIcon = musicControl.querySelector('.play-icon');
const pauseIcon = musicControl.querySelector('.pause-icon');

function updateMusicButton() {
    if (musica.paused) {
        playIcon.classList.remove('hidden');
        pauseIcon.classList.remove('visible');
        musicControl.classList.remove('playing');
    } else {
        playIcon.classList.add('hidden');
        pauseIcon.classList.add('visible');
        musicControl.classList.add('playing');
    }
}

musicControl.addEventListener('click', (e) => {
    e.stopPropagation();
    if (musica.paused) {
        musica.play().catch(e => console.log("Error al reproducir"));
    } else {
        musica.pause();
    }
    updateMusicButton();
});

// Actualizar botón cuando la música termina
musica.addEventListener('ended', updateMusicButton);

// Variables para suavizado (lerp)
let currentPulse = 1;
let currentBrightness = 1;
let currentCloudSaturate = 1;
let currentSkyPulse = 1;
let currentSkyBrightness = 1;
let currentSkySaturate = 1;
const smoothing = 0.05; 

function animate() {
    requestAnimationFrame(animate);
    
    if (analyser) {
        analyser.getByteFrequencyData(dataArray);
        
        // --- CLOUDS REACTIVITY (Piano/Mids) ---
        let midSum = 0;
        let midCount = 0;
        for (let i = 10; i < 60; i++) {
            midSum += dataArray[i];
            midCount++;
        }
        const midAverage = midSum / midCount;
        const midIntensity = Math.min(1, (midAverage / 140) * 1.5);
        
        const targetScale = 1 + (midIntensity * 0.10); 
        const targetBrightness = 1 + (midIntensity * 0.7);
        const targetCloudSaturate = 1 + (midIntensity * 0.4);
        
        // --- SKY REACTIVITY (Bass/Lows) ---
        let lowSum = 0;
        let lowCount = 0;
        for (let i = 0; i < 15; i++) {
            lowSum += dataArray[i];
            lowCount++;
        }
        const lowAverage = lowSum / lowCount;
        const lowIntensity = Math.min(1, (lowAverage / 160));
        
        const targetSkyScale = 1 + (lowIntensity * 0.05);
        const targetSkyBrightness = 1 + (lowIntensity * 0.3);
        const targetSkySaturate = 1 + (lowIntensity * 0.5);

        // --- SMOOTHING & APPLICATION ---
        const ultraSmoothing = 0.02; 
        
        // Clouds smoothing
        currentPulse += (targetScale - currentPulse) * ultraSmoothing;
        currentBrightness += (targetBrightness - currentBrightness) * ultraSmoothing;
        currentCloudSaturate += (targetCloudSaturate - currentCloudSaturate) * ultraSmoothing;
        
        // Sky smoothing (even slower for a "heavy" feel)
        const skySmoothing = 0.015;
        currentSkyPulse += (targetSkyScale - currentSkyPulse) * skySmoothing;
        currentSkyBrightness += (targetSkyBrightness - currentSkyBrightness) * skySmoothing;
        currentSkySaturate += (targetSkySaturate - currentSkySaturate) * skySmoothing;

        if (clouds) {
            clouds.style.setProperty('--pulse', currentPulse);
            clouds.style.setProperty('--brightness', currentBrightness);
            clouds.style.setProperty('--cloud-saturate', currentCloudSaturate);
        }

        if (sky) {
            sky.style.setProperty('--sky-pulse', currentSkyPulse);
            sky.style.setProperty('--sky-brightness', currentSkyBrightness);
            sky.style.setProperty('--sky-saturate', currentSkySaturate);
        }
    }
}

// Para no romper la animación CSS existente, necesitamos capturar su progreso
// o simplemente añadir el pulso encima. 
// Una mejor forma es usar variables CSS.

document.addEventListener('click', startMusic);
document.addEventListener('touchstart', startMusic);

