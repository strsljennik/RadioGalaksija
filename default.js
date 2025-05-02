const mongoose = require('mongoose');

// Schema za default korisnike
const defaultUserSchema = new mongoose.Schema({
    username: String,
    socketId: String,
    createdAt: { type: Date, default: Date.now }
});

// Model
const DefaultUser = mongoose.model('DefaultUser', defaultUserSchema, 'default');

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

        // Diskonekt
        socket.on('disconnect', async () => {
            await DefaultUser.deleteOne({ socketId: socket.id });
            console.log(`Obrisan ${nickname} iz kolekcije default.`);
            delete guests[socket.id];
            io.emit('updateGuestList', Object.values(guests));
        });

        // Praćenje neaktivnosti korisnika
        let inactiveTimer;
        socket.on('startInactivityTimer', (username) => {
            if (guests[socket.id] === username) {
                inactiveTimer = setTimeout(() => {
                    io.emit('userInactive', { username: username, socketId: socket.id });  // Obavesti klijente
                }, 15 * 60 * 1000); // 15 minuta
            }
        });

        // Resetovanje neaktivnosti kad korisnik postane aktivan
        socket.on('resetInactivityTimer', (username) => {
            if (guests[socket.id] === username && inactiveTimer) {
                clearTimeout(inactiveTimer);  // Resetuj timer
            }
        });

        function generateUniqueNumber() {
            return Math.floor(Math.random() * 8889) + 1111;
        }
    });
}

module.exports = { setupDefaultUsers };
