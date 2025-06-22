const mongoose = require('mongoose');

const banDataSchema = new mongoose.Schema({
  ipAddr: { type: String, required: true },
  visitorId: { type: String, required: true },
  userAgent: { type: String },
  screenSize: { type: String },
  bannedAt: { type: Date, default: Date.now }
});

const BanData = mongoose.model('BanData', banDataSchema);

async function checkBan(userData) {
  const bans = await BanData.find();
  return bans.some(ban => {
    let matches = 0;
    if (ban.ipAddr === userData.ipAddr) matches++;
    if (ban.visitorId === userData.visitorId) matches++;
    if (ban.userAgent === userData.userAgent) matches++;
    if (ban.screenSize === userData.screenSize) matches++;
    return matches >= 3;
  });
}

async function addBan(userData) {
  const exists = await BanData.findOne({
    ipAddr: userData.ipAddr,
    visitorId: userData.visitorId
  });
  if (exists) return exists;
  return BanData.create(userData);
}

function initSocket(io) {
  io.on('connection', socket => {
    socket.on('check-ban', async (userData, callback) => {
      try {
        const banned = await checkBan(userData);
        callback({ banned }); // samo javimo da je banovan ili ne
      } catch {
        callback({ banned: false });
      }
    });

    socket.on('ban-user', async (userData) => {
      try {
        await addBan(userData);
        io.emit('user-banned', userData);
      } catch (e) {
        console.error('Greška pri banovanju:', e.message);
      }
    });
  });
}
const isVPN = response.data.vpn || response.data.proxy || response.data.tor;
if (isVPN) {
  console.log(`Blokiran VPN/proxy korisnik: ${ip}`);
  socket.disconnect();
  return;
}

module.exports = { initSocket, checkBan, addBan };
