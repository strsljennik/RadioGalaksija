document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'visible') {
        socket.emit('pingAktivan');
    }
});

setInterval(() => {
    if (document.visibilityState === 'visible') {
        socket.emit('pingAktivan');
    }
}, 20000);

const socket = io(); // tvoj socket konektor

// Kada korisnik dobije nadimak
socket.on('setNickname', function(nickname) {
    // Sačuvaj nadimak u sessionStorage
    sessionStorage.setItem('nickname', nickname);
    console.log(`Tvoj početni nadimak je: ${nickname}`);
});

// Kada se korisnik ponovo poveže, proveri sessionStorage
socket.on('reconnect', () => {
    const savedNickname = sessionStorage.getItem('nickname');
    if (savedNickname) {
        socket.emit('restoreNickname', savedNickname); // Pošaljite sačuvani nadimak na server
        console.log(`Ponovo povezivanje sa nadimkom: ${savedNickname}`);
    }
});

// Kada korisnik šalje ime (prijava), sačuvaj ga
socket.on('userLoggedIn', function(username) {
    console.log(`Tvoj username je sada: ${username}`);
    document.getElementById('usernameDisplay').innerText = username;

    // Sačuvaj ime u sessionStorage (ako je prijavljen)
    sessionStorage.setItem('nickname', username);
});
