// Kada server pošalje ping, šaljemo pong nazad
socket.on('ping', () => {
    socket.emit('pong');
});

// Čuvanje vremena poslednje aktivnosti korisnika
let lastActiveTime = Date.now();

// Detektuj aktivnost korisnika (klik, skrolovanje, tastatura)
window.addEventListener('mousemove', () => {
    lastActiveTime = Date.now();  // Ažuriraj poslednju aktivnost korisnika
});
window.addEventListener('keydown', () => {
    lastActiveTime = Date.now();
});

// Ako korisnik nije aktivan duže vreme, server ga neće isključiti
setInterval(() => {
    if (Date.now() - lastActiveTime > 60000) {  // Ako nije bilo aktivnosti poslednjih 60 sekundi
        console.log("Korisnik je neaktivan.");
    }
}, 10000);  // Provjeravaj svakih 10 sekundi
