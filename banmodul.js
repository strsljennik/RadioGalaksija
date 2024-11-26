let privilegedUsers = new Set(); // Privilegovani korisnici
let bannedUsers = new Set(); // Banovani korisnici

function setupSocketEvents(io, guests, bannedUsers) {
    io.on('connection', (socket) => {
        console.log(`[INFO] Korisnik povezan: ${socket.id}`);

        // Provera da li je korisnik banovan
        if (bannedUsers.has(socket.id)) {
            socket.emit('banned', 'Banovani ste sa servera.');
            socket.disconnect(true);
            return;
        }

        // Dodavanje privilegija korisnicima
        socket.on('enterPassword', (password) => {
            const correctPassword = 'galaksija123';
            console.log(`[INFO] Password entered: ${password} for socket ${socket.id}`);
            if (password === correctPassword) {
                privilegedUsers.add(socket.id);
                socket.emit('password_success', "Pristup odobren.");
                console.log(`[INFO] Korisnik ${socket.id} je dobio privilegije.`);
            } else {
                socket.emit('password_failed', "Pogrešna lozinka.");
                console.log(`[INFO] Korisnik ${socket.id} je pokušao sa pogrešnom lozinkom.`);
            }
        });

        // Banovanje korisnika
        socket.on('banUser', (nickname) => {
            console.log(`[INFO] Korisnik ${socket.id} pokušava da banuje korisnika ${nickname}`);
            if (!privilegedUsers.has(socket.id)) {
                socket.emit('error', "Nemate prava za banovanje.");
                console.log(`[WARN] Korisnik ${socket.id} nije privilegovan za banovanje.`);
                return;
            }

            // Pronađi socket.id na osnovu nadimka iz `guests` objekta
            const targetSocketId = Object.keys(guests).find(
                (id) => guests[id] === nickname // Pretraga u `guests` sa stvarnim nadimkom
            );

            if (!targetSocketId) {
                socket.emit('error', "Korisnik nije pronađen.");
                console.log(`[WARN] Korisnik ${nickname} nije pronađen u guestList.`);
                return;
            }

            bannedUsers.add(targetSocketId);
            io.to(targetSocketId).emit('banned', "Banovani ste sa servera.");
            const targetSocket = io.sockets.sockets.get(targetSocketId);
            if (targetSocket) targetSocket.disconnect(true); // Prekini vezu
            console.log(`[INFO] Korisnik ${nickname} je banovan od strane ${socket.id}.`);

            io.emit('userBanned', nickname); // Obavesti sve klijente
        });

        // Odbanovanje korisnika
        socket.on('unbanUser', (nickname) => {
            console.log(`[INFO] Korisnik ${socket.id} pokušava da odbanuje korisnika ${nickname}`);
            if (!privilegedUsers.has(socket.id)) {
                socket.emit('error', "Nemate prava za odbanovanje.");
                console.log(`[WARN] Korisnik ${socket.id} nije privilegovan za odbanovanje.`);
                return;
            }

            // Pronađi socket.id na osnovu nadimka iz `guests` objekta
            const targetSocketId = Object.keys(guests).find(
                (id) => guests[id] === nickname // Pretraga u `guests` sa stvarnim nadimkom
            );

            if (targetSocketId) {
                bannedUsers.delete(targetSocketId);
                console.log(`[INFO] Korisnik ${nickname} je odbanovan od strane ${socket.id}.`);
                io.emit('userUnbanned', nickname); // Obavesti sve klijente
            } else {
                console.log(`[WARN] Korisnik ${nickname} nije pronađen u guests.`);
            }
        });

        // Diskonekcija korisnika
        socket.on('disconnect', () => {
            console.log(`[INFO] Korisnik ${socket.id} se odjavio.`);
            privilegedUsers.delete(socket.id);
            bannedUsers.delete(socket.id);
        });
    });
}

module.exports = { setupSocketEvents };
