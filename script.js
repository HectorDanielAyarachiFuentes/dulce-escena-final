// ====== MÚSICA ======
const musica = document.getElementById('musica');
musica.play().catch(() => {
    const iniciar = () => {
        musica.play();
        document.removeEventListener('click', iniciar);
        document.removeEventListener('touchstart', iniciar);
    };
    document.addEventListener('click', iniciar);
    document.addEventListener('touchstart', iniciar);
});
