const mongoose = require('mongoose');
const axios = require('axios');

const banDataSchema = new mongoose.Schema({
  ipAddr: { type: String, required: true },
  visitorId: { type: String, required: true },
  userAgent: { type: String },
  screenSize: { type: String },
  bannedAt: { type: Date, default: Date.now }
});

const BanData = mongoose.model('BanData', banDataSchema);

// Čuvamo sve korisnike trenutno povezane
const connectedUsers = new Map();

async function checkBan(userData) {
  const bans = await BanData.find();
  return bans.some(ban => {
    let matches = 0;
    if (ban.ipAddr === userData.ip) matches++;
    if (ban.visitorId === userData.visitorId) matches++;
    if (ban.userAgent === userData.userAgent) matches++;
    if (ban.screenSize === userData.screenSize) matches++;
    return matches >= 3;
  });
}

async function addBan(userData) {
  const exists = await BanData.findOne({
    ipAddr: userData.ip,
    visitorId: userData.visitorId
  });
  if (exists) return exists;
  return BanData.create({
    ipAddr: userData.ip,
    visitorId: userData.visitorId,
    userAgent: userData.userAgent,
    screenSize: userData.screenSize
  });
}

function emitUserList(io) {
  io.emit('update-user-list', Array.from(connectedUsers.values()));
}

function initSocket(io) {
  io.on('connection', async (socket) => {
    // IP iz handshake
    let ip = socket.handshake.headers['x-forwarded-for'] || socket.handshake.address;
    if (ip.includes(',')) ip = ip.split(',')[0].trim();

    // PROVERA VPN/PROXY/TOR i disconnect
    try {
      const response = await axios.get(`https://ipapi.co/${ip}/json/`);
      const isVPN = response.data.vpn || response.data.proxy || response.data.tor;
      if (isVPN) {
        console.log(`Blokiran VPN/proxy korisnik: ${ip}`);
        socket.disconnect();
        return;
      }
    } catch (e) {
      console.log('Greška u proveri VPN:', e.message);
    }

    socket.on('user-data', async (userData) => {
      userData.ip = ip; // dodaj IP sa servera, ne klijentski
      const banned = await checkBan(userData);

      if (banned) {
        socket.emit('ban-user'); // javi klijentu da je banovan
        socket.disconnect();
        return;
      }

      connectedUsers.set(socket.id, userData);
      emitUserList(io);
    });

    socket.on('ban-user', async (userData) => {
      try {
        await addBan(userData);
        // Obriši banovanog iz connectedUsers
        for (let [id, user] of connectedUsers.entries()) {
          if (user.visitorId === userData.visitorId) {
            io.sockets.sockets.get(id)?.disconnect();
            connectedUsers.delete(id);
          }
        }
        emitUserList(io);
        io.emit('user-banned', userData);
      } catch (e) {
        console.error('Greška pri banovanju:', e.message);
      }
    });

    socket.on('disconnect', () => {
      connectedUsers.delete(socket.id);
      emitUserList(io);
    });
  });
}

module.exports = { initSocket, checkBan, addBan };
