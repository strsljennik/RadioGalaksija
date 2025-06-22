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
let myVisitorId = null;

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

    // Uzmi fingerprint
    const fp = await FingerprintJS.load();
    const result = await fp.get();
    myVisitorId = result.visitorId;

    // Uzmi IP i geodata
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

    const userData = {
      ip,
      visitorId: myVisitorId,
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      screenSize: `${screen.width}x${screen.height}`,
      country: geoData.country_name || 'unknown',
      region: geoData.region || 'unknown',
      city: geoData.city || 'unknown',
      org: geoData.org || 'unknown',
      timezone: geoData.timezone || 'unknown',
    };

    // Posalji serveru svoje podatke
    socket.emit('user-data', userData);

  } else {
    fin.style.display = 'none';
    fin.innerHTML = '';
  }
});

socket.on('update-user-list', users => {
  fin.innerHTML = '';

  users.forEach(user => {
    const userDiv = document.createElement('div');
    userDiv.style.border = '2px solid #0ff';
    userDiv.style.color = '#0ff';
    userDiv.style.padding = '10px';
    userDiv.style.marginBottom = '10px';
    userDiv.style.whiteSpace = 'pre-wrap';
    userDiv.style.cursor = 'pointer';
    userDiv.title = 'Dvaput klikni za ban';

    userDiv.textContent = JSON.stringify(user, null, 2);

    if (bannedUsers.has(user.visitorId)) {
      userDiv.style.opacity = '0.5';
      userDiv.style.textDecoration = 'line-through';
    }

    userDiv.addEventListener('dblclick', () => {
      if (user.visitorId === myVisitorId) {
        alert('Ne mozes banovati sebe');
        return;
      }
      bannedUsers.add(user.visitorId);
      alert(`Korisnik ${user.visitorId} banovan!`);
      socket.emit('ban-user', user);
    });

    fin.appendChild(userDiv);
  });

  if (bannedUsers.has(myVisitorId)) {
    disableChat();
  }
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
