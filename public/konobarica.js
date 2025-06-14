// Kada se povežemo sa serverom, emitujemo događaj za novog gosta
socket.emit('new_guest');

// Slušamo za poruke od servera, u ovom slučaju pozdravnu poruku od Konobarice
socket.on('message', (data) => {
    const messageArea = document.getElementById('messageArea');
    
    // Kreiramo HTML element za poruku
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    
    // Dodajemo korisničko ime i poruku
    messageElement.innerHTML = `
        <strong>${data.username}:</strong> ${data.message}
    `;
    
    // Ako je sistemska poruka, dodajemo odgovarajući stil
    if (data.isSystemMessage) {
        messageElement.classList.add('system-message');
    }
    
    // Dodajemo poruku na vrh umesto na dno
    messageArea.insertBefore(messageElement, messageArea.firstChild);
});

// GOSTI MODAL 
var modal = document.getElementById("gostimodal");
var btn = document.getElementById("GBtn");
var span = document.getElementsByClassName("close")[0];

// Otvori modal kada klikneš na dugme GBtn
btn.onclick = function() {
    modal.style.display = "block";
}

// Zatvori modal kada klikneš na X
span.onclick = function() {
    modal.style.display = "none";
}
  let isDragging = false;
    let offsetX, offsetY;

    modal.addEventListener('mousedown', function (e) {
        isDragging = true;
        offsetX = e.clientX - modal.offsetLeft;
        offsetY = e.clientY - modal.offsetTop;
    });

    document.addEventListener('mousemove', function (e) {
        if (isDragging) {
            modal.style.left = e.clientX - offsetX + 'px';
            modal.style.top = e.clientY - offsetY + 'px';
        }
    });

    document.addEventListener('mouseup', function () {
        isDragging = false;
    });

// Funkcija za uvećanje fonta
function increaseFontSize() {
    var messageArea = document.getElementById("messageArea");
    var currentSize = window.getComputedStyle(messageArea, null).getPropertyValue('font-size');
    var newSize = parseInt(currentSize) + 2; // Povećaj veličinu fonta za 2px
    messageArea.style.fontSize = newSize + "px";
}

// Funkcija za smanjenje fonta
function decreaseFontSize() {
    var messageArea = document.getElementById("messageArea");
    var currentSize = window.getComputedStyle(messageArea, null).getPropertyValue('font-size');
    var newSize = parseInt(currentSize) - 2; // Smanji veličinu fonta za 2px
    messageArea.style.fontSize = newSize + "px";
}
//ZA TUBE STRIM NA DUGME
 const toggleBtn = document.getElementById('tube');
  const retryBtn = document.getElementById('retryBtn');
  const iframe = document.getElementById('w2g');

  toggleBtn.addEventListener('click', () => {
    const visible = iframe.style.display === 'block';

    iframe.style.display = visible ? 'none' : 'block';
    retryBtn.style.display = visible ? 'none' : 'inline-block';
  });

// SLIKE ZA POZADINU 
document.getElementById("pozadina").addEventListener("click", function() {
    var url = prompt("Unesite URL slike:");
    if (url) {
        document.body.style.backgroundImage = "url('" + url + "')";
        socket.emit("changeBackground", url); // Ovo šalje serveru
    } else {
        document.body.style.backgroundImage = "url('default_image_url.jpg')";
        socket.emit("changeBackground", "default_image_url.jpg");

    }
});

socket.on("updateBackground", (url) => {
    document.body.style.backgroundImage = "url('" + url + "')";
});

