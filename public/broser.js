const button = document.getElementById('bro');
const fin = document.createElement('div');
fin.style.position = 'fixed';
fin.style.width = '400px';
fin.style.height = '800px';
fin.style.top = '50px';
fin.style.left = '50px';
fin.style.border = '2px solid #0ff';
fin.style.backgroundColor = 'black';
fin.style.padding = '10px';
fin.style.overflowY = 'auto';
fin.style.display = 'none';
fin.style.zIndex = '9999';
fin.style.cursor = 'move';
document.body.appendChild(fin);

let passwordEntered = false;
let bannedUsers = new Set();
let guestsData = {};

function makeDraggable(element) {
  let isDragging = false;
  let offsetX, offsetY;

  element.addEventListener('mousedown', e => {
    isDragging = true;
    offsetX = e.clientX - element.getBoundingClientRect().left;
    offsetY = e.clientY - element.getBoundingClientRect().top;
    element.style.cursor = 'grabbing';
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
    element.style.cursor = 'move';
  });

  window.addEventListener('mousemove', e => {
    if (!isDragging) return;
    element.style.left = (e.clientX - offsetX) + 'px';
    element.style.top = (e.clientY - offsetY) + 'px';
  });
}

makeDraggable(fin);

button.addEventListener('click', async () => {
  if (!passwordEntered) {
    const pass = prompt('Unesi lozinku');
    if (pass !== 'babaroga') {
      alert('Pogresna lozinka');
      return;
    }
    passwordEntered = true;
  }

  if (fin.style.display === 'none') {
    fin.style.display = 'block';

    const fp = await FingerprintJS.load();
    const result = await fp.get();
    const visitorId = result.visitorId;

    let ip = 'unknown';
    let geoData = {};

    try {
      const res = await fetch('https://ipapi.co/json/');
      geoData = await res.json();
      ip = geoData.ip || 'unknown';
    } catch {
      ip = 'fetch_failed';
      geoData = {};
    }

    // Traži server da ti pošalje listu korisnika sa svim podacima
    socket.emit('requestUserList');

  } else {
    fin.style.display = 'none';
    fin.innerHTML = '';
  }
});

// Reaguj na listu korisnika sa servera
socket.on('updateGuestListWithData', (users) => {
  guestsData = {};
  fin.innerHTML = '';

  users.forEach(user => {
    guestsData[user.visitorId] = user;

    const userDiv = document.createElement('div');
    userDiv.style.border = '2px solid #0ff';
    userDiv.style.color = bannedUsers.has(user.visitorId) ? 'red' : '#0ff';
    userDiv.style.padding = '10px';
    userDiv.style.marginBottom = '10px';
    userDiv.style.whiteSpace = 'pre-wrap';
    userDiv.style.cursor = 'pointer';
    userDiv.title = 'Dvaput klikni za ban';

    const details = `
Nickname: ${user.nickname}
IP: ${user.ipAddress || 'unknown'}
Provider: ${user.org || 'unknown'}
Resolution: ${user.screen || 'unknown'}
VisitorId: ${user.visitorId}
UserAgent: ${user.userAgent || 'unknown'}
Language: ${user.language || 'unknown'}
Platform: ${user.platform || 'unknown'}
Country: ${user.country || 'unknown'}
Region: ${user.region || 'unknown'}
City: ${user.city || 'unknown'}
Timezone: ${user.timezone || 'unknown'}
`;

    userDiv.textContent = details;

    userDiv.addEventListener('dblclick', () => {
      if (!bannedUsers.has(user.visitorId)) {
        bannedUsers.add(user.visitorId);
        alert(`Korisnik ${user.nickname} banovan!`);
        disableChat();
        socket.emit('ban-user', user);
        userDiv.style.color = 'red';
      }
    });

    fin.appendChild(userDiv);
  });
});

function disableChat() {
  const messageArea = document.getElementById('messageArea');
  const chatInput = document.getElementById('chatInput');
  if (messageArea) {
    messageArea.disabled = true;
    messageArea.value = '';
  }
  if (chatInput) {
    chatInput.disabled = true;
    chatInput.value = '';
  }
}
