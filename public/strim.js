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

let iframeVisible = false;
let iframeClicked = false;

document.getElementById('tube').addEventListener('click', function () {
    const container = document.getElementById('iframeContainer');

    if (!iframeVisible) {
        const iframe = document.createElement('iframe');
        iframe.src = 'https://w2g.tv/embed?room_id=dthbo6gc3ya5j5dv4c';
        iframe.width = '100';
        iframe.height = '100';
        iframe.frameBorder = '0';
        iframe.allowFullscreen = true;
        iframe.allow = 'autoplay; fullscreen; camera; microphone;';
        iframe.id = 'tubeIframe';

        iframe.addEventListener('click', function () {
            if (!iframeClicked) {
                iframeClicked = true;
            } else {
                iframe.style.pointerEvents = 'none';
            }
        });

        container.appendChild(iframe);
        iframeVisible = true;
    } else {
        container.innerHTML = '';
        iframeVisible = false;
        iframeClicked = false;
    }
});
