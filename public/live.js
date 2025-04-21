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
