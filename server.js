const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { connectDB } = require('./mongo');
const { register, login } = require('./prijava');
const { setupSocketEvents } = require('./banmodul'); // Uvoz funkcije iz banmodula
const pingService = require('./ping');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

connectDB(); // Povezivanje na bazu podataka

// Middleware za parsiranje JSON podataka i serviranje statičkih fajlova
app.use(express.json());
app.use(express.static(__dirname + '/public'));

// Rute za registraciju i prijavu
app.post('/register', (req, res) => register(req, res, io));
app.post('/login', (req, res) => login(req, res, io));

// Početna ruta
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Lista autorizovanih korisnika i banovanih korisnika
const authorizedUsers = new Set(['Radio Galaksija', 'ZI ZU', '__X__']);
const bannedUsers = new Set();

// Skladištenje informacija o gostima
const guests = {};
const assignedNumbers = new Set(); // Set za generisane brojeve

// Dodavanje socket događaja iz banmodula
setupSocketEvents(io, guests, bannedUsers); // Dodavanje guests i bannedUsers u banmodul

// Socket.io događaji
io.on('connection', (socket) => {
    // Generisanje jedinstvenog broja za gosta
    const uniqueNumber = generateUniqueNumber();
    const nickname = `Gost-${uniqueNumber}`; // Nadimak korisnika
    guests[socket.id] = nickname; // Dodajemo korisnika u guest list
    console.log(`${nickname} se povezao.`);

    // Emitovanje događaja da bi ostali korisnici videli novog gosta
    socket.broadcast.emit('newGuest', nickname);
    io.emit('updateGuestList', Object.values(guests));

    // Obrada prijave korisnika
    socket.on('userLoggedIn', async (username) => {
        if (authorizedUsers.has(username)) {
            guests[socket.id] = `${username} (Admin)`; // Ako je admin
            console.log(`${username} je autentifikovan kao admin.`);
        } else {
            guests[socket.id] = username; // Ako je običan gost
            console.log(`${username} se prijavio kao gost.`);
        }
        io.emit('updateGuestList', Object.values(guests));
    });

    // Obrada slanja poruka u četu
    socket.on('chatMessage', (msgData) => {
        const time = new Date().toLocaleTimeString();
        const messageToSend = {
            text: msgData.text,
            bold: msgData.bold,
            italic: msgData.italic,
            color: msgData.color,
            nickname: guests[socket.id], // Korišćenje nadimka za slanje poruke
            time: time,
        };
        io.emit('chatMessage', messageToSend);
    });

    // Obrada diskonekcije korisnika
    socket.on('disconnect', () => {
        console.log(`${guests[socket.id]} se odjavio.`);
        delete guests[socket.id]; // Uklanjanje gosta iz liste
        io.emit('updateGuestList', Object.values(guests));
    });

    // Mogućnost banovanja korisnika prema nickname-u
    socket.on('banUser', (nicknameToBan) => {
        const socketIdToBan = Object.keys(guests).find(key => guests[key] === nicknameToBan);

        if (socketIdToBan) {
            io.to(socketIdToBan).emit('banned');
            io.sockets.sockets[socketIdToBan].disconnect();
            console.log(`Korisnik ${nicknameToBan} (ID: ${socketIdToBan}) je banovan.`);
        } else {
            console.log(`Korisnik ${nicknameToBan} nije pronađen.`);
            socket.emit('userNotFound', nicknameToBan);
        }
    });

    // Funkcija za generisanje jedinstvenog broja
    function generateUniqueNumber() {
        let number;
        do {
            number = Math.floor(Math.random() * 8889) + 1111; // Brojevi između 1111 i 9999
        } while (assignedNumbers.has(number));
        assignedNumbers.add(number);
        return number;
    }
});

// Pokretanje servera na definisanom portu
const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server je pokrenut na portu ${PORT}`);
});
