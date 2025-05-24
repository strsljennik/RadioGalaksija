// ZENO PLAYER NA DUGME
document.addEventListener("DOMContentLoaded", function() {
    var audio = document.getElementById('radioStream');
    var button = document.getElementById('sound');
    var isPlaying = false;

    button.addEventListener('click', function() {
          button.blur();
        if (isPlaying) {
            audio.pause();
              button.textContent = "Play";
          isPlaying = false;
        } else {
            playStream();
        }
    });

    function playStream() {
        audio.src = "https://stream.zeno.fm/krdfduyswxhtv";  
        audio.load();  
        audio.play().then(() => {
            button.textContent = "Stop";
          isPlaying = true;
        }).catch(error => console.error("Greška pri puštanju zvuka:", error));
    }

    // Automatsko ponovno pokretanje pri gubitku konekcije
    audio.addEventListener('error', function() {
        setTimeout(playStream, 3000);
    });
});

const btn = document.getElementById('tube');
const iframe = document.querySelector('iframe');

let iframeVisible = true;
let iframeClicked = false;

btn.addEventListener('click', () => {
    if (iframeVisible) {
        iframe.style.display = 'none';
        iframeVisible = false;
        iframeClicked = false;
        iframe.style.pointerEvents = 'auto';
    } else {
        iframe.style.display = 'block';
        iframeVisible = true;
    }
});

iframe.addEventListener('click', () => {
    if (!iframeClicked) {
        iframeClicked = true;
    } else {
        iframe.style.pointerEvents = 'none';
    }
});
