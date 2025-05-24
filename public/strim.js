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
