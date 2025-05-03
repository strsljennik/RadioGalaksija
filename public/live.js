socket.on('setNickname', (nickname) => {
    console.log('Dobijen nadimak:', nickname);
    currentUser = nickname;
    myNickname = nickname;
    window.currentUser = { username: nickname };

    // POŠALJI NA SERVER DA “SIMULIRA” LOGIN
    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-socket-id': socket.id
        },
        body: JSON.stringify({ username: nickname, password: 'dummy' }) // password može biti bilo šta
    })
    .then(response => {
        if (response.ok) {
            console.log('Default gost “ulogovan” na server.');
            socket.emit('userLoggedIn', nickname);  // isto kao i kod pravih korisnika
            enableGuestFeatures();
        } else {
            console.warn('Server nije prihvatio default gosta.');
        }
    })
    .catch(err => {
        console.error('Greška pri loginu default gosta:', err);
    });
});
//   ZA SERVER   AKO ZATREBA  --DODATAK 
if (username.startsWith('Gost-')) {
    const role = 'guest';
    const socket = io.sockets.sockets.get(socketId);
    if (socket) {
        socket.emit('userLoggedIn', { username, role });
    }
    return res.send('Logged in as guest');
}
