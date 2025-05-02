function setupDefaultUsers(io, guests) {
    io.on('connection', async (socket) => {
        // Generiši username
        const uniqueNumber = generateUniqueNumber();
        const nickname = `Gost-${uniqueNumber}`;
        guests[socket.id] = nickname;

        // Emituj nickname
        socket.emit('setNickname', nickname);
        socket.emit('yourNickname', nickname);

        // Upisi u kolekciju 'default'
        const user = new DefaultUser({ username: nickname, socketId: socket.id });
        await user.save();
        console.log(`Upisan ${nickname} u kolekciju default.`);

        // Emituj ostalima
        socket.broadcast.emit('newGuest', nickname);
        io.emit('updateGuestList', Object.values(guests));

        // Kada gost postane neaktivan (blinkanje slike)
        socket.on('guestInactive', (data) => {
            // Pošaljemo signal svim povezanim korisnicima
            io.emit('startBlinking', data.username); // Svi korisnici dobijaju ovaj signal
        });

        // Diskonekt
        socket.on('disconnect', async () => {
            await DefaultUser.deleteOne({ socketId: socket.id });
            console.log(`Obrisan ${nickname} iz kolekcije default.`);
            delete guests[socket.id];
            io.emit('updateGuestList', Object.values(guests));
        });

        function generateUniqueNumber() {
            return Math.floor(Math.random() * 8889) + 1111;
        }
    });
}
