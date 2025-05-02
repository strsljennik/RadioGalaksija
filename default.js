const mongoose = require('mongoose');
const express = require('express');

// Schema za default korisnike
const defaultUserSchema = new mongoose.Schema({
    username: String,
    socketId: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Model
const DefaultUser = mongoose.model('DefaultUser', defaultUserSchema, 'default');

function setupDefaultUsers(io, guests, app) {
    // Dodaj ping rutu
    app.post('/ping', express.json(), async (req, res) => {
        const { username } = req.body;
        console.log(`Primljen ping od ${username}`);
        res.sendStatus(200);
    });

    io.on('connection', async (socket) => {
        // Generiši username
        const uniqueNumber = generateUniqueNumber();
        const nickname = `Gost-${uniqueNumber}`;
        guests[socket.id] = nickname;

        // Emituj nickname
        socket.emit('setNickname', nickname);
        socket.emit('yourNickname', nickname);
        
       });
}


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

        function generateUniqueNumber() {
            return Math.floor(Math.random() * 8889) + 1111;
        }
    });

    // ✅ HTTP PING endpoint
    app.post('/ping', express.json(), async (req, res) => {
        const username = req.body.username;
        if (!username) return res.status(400).send('Username nedostaje');

        try {
            await DefaultUser.updateOne(
                { username: username },
                { $set: { updatedAt: new Date() } }
            );
            console.log(`Primljen ping od ${username}`);
            res.sendStatus(200);
        } catch (err) {
            console.error(`Greška kod ping za ${username}:`, err);
            res.sendStatus(500);
        }
    });

    // ✅ ČIŠĆENJE neaktivnih korisnika svakih 5 minuta
    setInterval(async () => {
        const cutoff = new Date(Date.now() - 2 * 60 * 1000); // 2 minuta
        const result = await DefaultUser.deleteMany({ updatedAt: { $lt: cutoff } });
        if (result.deletedCount > 0) {
            console.log(`Obrisano ${result.deletedCount} neaktivnih gostiju.`);
            // Takođe izbaci iz guests objekta
            for (let socketId in guests) {
                const username = guests[socketId];
                const stillExists = await DefaultUser.findOne({ username: username });
                if (!stillExists) {
                    delete guests[socketId];
                    io.emit('updateGuestList', Object.values(guests));
                }
            }
        }
    }, 5 * 60 * 1000); // svakih 5 minuta
}

module.exports = { setupDefaultUsers };
