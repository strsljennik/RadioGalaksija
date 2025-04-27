const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { connectDB } = require('./mongo');
const { register, login } = require('./prijava');
const { setupSocketEvents } = require('./banmodul'); // Uvoz funkcije iz banmodula
const konobaricaModul = require('./konobaricamodul'); // Uvoz konobaricamodul.js
const slikemodul = require('./slikemodul');
const pingService = require('./ping');
const privatmodul = require('./privatmodul'); // Podesi putanju ako je u drugom folderu
require('dotenv').config();
const cors = require('cors');
const pingPong = require('./ping-pong');



const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: '*', // Omogućava svim domenima da se povežu putem WebSocket-a
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type'],
        credentials: true
    }
});

connectDB(); // Povezivanje na bazu podataka
konobaricaModul(io);
slikemodul.setSocket(io);

// Middleware za parsiranje JSON podataka i serviranje statičkih fajlova
app.use(express.json());
app.use(express.static(__dirname + '/public'));
app.set('trust proxy', true);
app.use(cors());

// Rute za registraciju i prijavu
app.post('/register', (req, res) => register(req, res, io));
app.post('/login', (req, res) => login(req, res, io));

// Početna ruta
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});
// Lista autorizovanih i banovanih korisnika
const authorizedUsers = new Set(['Radio Galaksija', 'ZI ZU', '*__X__*']);
const bannedUsers = new Set();

// Skladištenje informacija o gostima
const guests = {};
const guestsData = {};
const assignedNumbers = new Set(); // Set za generisane brojeve
const userColors = {}; // Ovdje čuvamo boje korisnika
const sviAvatari = {};
const userGradients = {};

// Dodavanje socket događaja iz banmodula
setupSocketEvents(io, guests, bannedUsers); // Dodavanje guests i bannedUsers u banmodul
privatmodul(io, guests);
let currentBackground = "";
let textElements = [];

// Socket.io događaji
io.on('connection', (socket) => {
    // Generisanje jedinstvenog broja za gosta
    const uniqueNumber = generateUniqueNumber();
    const nickname = `Gost-${uniqueNumber}`; // Nadimak korisnika
    guests[socket.id] = nickname; // Dodajemo korisnika u guest list
 socket.emit('setNickname', nickname);
    socket.emit('yourNickname', nickname);
    const ipList = socket.handshake.headers['x-forwarded-for'];
const ipAddress = ipList ? ipList.split(',')[0].trim() : socket.handshake.address;
     pingPong(socket);

// Funkcija za generisanje jedinstvenog broja
    function generateUniqueNumber() {
        let number;
        do {
            number = Math.floor(Math.random() * 8889) + 1111; // Brojevi između 1111 i 9999
        } while (assignedNumbers.has(number));
        assignedNumbers.add(number);
        return number;
    }

// Emitovanje događaja da bi ostali korisnici videli novog gosta
    socket.broadcast.emit('newGuest', nickname);
io.emit('updateGuestList', Object.values(guests));
 console.log(`${guests[socket.id]} se povezao. IP adresa korisnika: ${ipAddress}`);
 io.emit('new-log', `${guests[socket.id]} se povezao. IP adresa korisnika: ${ipAddress}`);

 // Obrada prijave korisnika
socket.on('userLoggedIn', (username) => {
    const oldNickname = guests[socket.id]; // Sačuvamo trenutni nadimak

    console.log(`${oldNickname} je sada ${username}.`);
    io.emit('new-log', `${oldNickname} je sada ${username}.`);

    guests[socket.id] = username;

    if (authorizedUsers.has(username)) {
        console.log(`${username} je autentifikovan kao admin.`);
        io.emit('new-log', `${username} je autentifikovan kao admin.`);
    } else {
        console.log(`${username} se prijavio kao gost.`);
        io.emit('new-log', `${username} se prijavio kao gost.`);
    }

    io.emit('updateGuestList', Object.values(guests));
});
        
 // Obrada slanja chat poruka
    socket.on('chatMessage', (msgData) => {
     const time = new Date().toLocaleTimeString('en-GB', { timeZone: 'Europe/Berlin' });
      const messageToSend = {
            text: msgData.text,
            bold: msgData.bold,
            italic: msgData.italic,
            color: msgData.color,
             underline: msgData.underline,
            overline: msgData.overline,
            nickname: guests[socket.id],
          gradient: userGradients[guests[socket.id]] || null ,
            time: time
          };
        io.emit('chatMessage', messageToSend);
    });

  // Obrada za čišćenje chata
    socket.on('clear-chat', () => {
        console.log('Chat cleared');
        io.emit('chat-cleared');
    });
 
 socket.emit('allColors', userColors);

    // Slušanje na promene boje
    socket.on('colorChange', (data) => {
        userColors[data.nickname] = data.color;  // Spremanje boje za korisnika
        io.emit('colorChange', data);  // Emitovanje promene boje svim korisnicima
    });

    socket.emit('allGradients', userGradients);

socket.on('gradientChange', (data) => {
    userGradients[data.nickname] = data.gradient;
    io.emit('gradientChange', data);
});

      socket.emit("updateBackground", currentBackground);

    socket.on("changeBackground", (url) => {
        console.log("Nova pozadina:", url);
        currentBackground = url;
        io.emit("updateBackground", url);
    });

     // Emit current state to the new user
    socket.emit('currentState', textElements);

    socket.on('newText', (data) => {
        // Add the new text element to the current state
        textElements.push(data);
        // Emit to all other clients
        socket.broadcast.emit('newText', data);
    });

    socket.on('deleteText', (data) => {
        // Remove the text element from the current state
        textElements = textElements.filter((_, index) => index !== data.index);
        // Emit to all other clients
        socket.broadcast.emit('deleteText', data);
    });

    socket.on('positionChange', (data) => {
        // Update the position of the text element in the current state
        if (textElements[data.index]) {
            textElements[data.index].x = data.x;
            textElements[data.index].y = data.y;
        }
        // Emit to all other clients
        socket.broadcast.emit('positionChange', data);
    });

   socket.on('register', (data) => {
    username = data.username;
    sviAvatari[username] = data.avatar || 'defaultna/slika.webp';
    
    // Pošalji mu sve trenutno postojeće avatare
    socket.emit('initialAvatars', sviAvatari);
  });

  // Kad korisnik promeni avatar
  socket.on('avatarChange', (data) => {
    if (data.username && data.avatar) {
      sviAvatari[data.username] = data.avatar; // Update stanje
      socket.broadcast.emit('avatarChange', data); // Pošalji svima ostalima
    }
  });

// Obrada diskonekcije korisnika
    socket.on('disconnect', () => {
        console.log(`${guests[socket.id]} se odjavio. IP adresa korisnika: ${ipAddress}`);
        delete guests[socket.id];
        io.emit('updateGuestList', Object.values(guests));
    });
     });
// Pokretanje servera na definisanom portu
const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server je pokrenut na portu ${PORT}`);
});
