// ping-pong.js
module.exports = function(socket) {
    let lastActiveTime = Date.now();

    setInterval(() => {
        socket.emit('ping');
    }, 30000);

    socket.on('pong', () => {
        lastActiveTime = Date.now();
    });

    setInterval(() => {
        if (Date.now() - lastActiveTime > 60000) {
            socket.disconnect();
        }
    }, 10000);
};
