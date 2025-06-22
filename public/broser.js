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

    if (bannedUsers.has(visitorId)) {
      alert('Korisnik banovan!');
      disableChat();
      return;
    }

    const userData = {
      ip,
      visitorId,
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      screen: `${screen.width}x${screen.height}`,
      country: geoData.country_name || 'unknown',
      region: geoData.region || 'unknown',
      city: geoData.city || 'unknown',
      org: geoData.org || 'unknown',
      timezone: geoData.timezone || 'unknown',
    };

    const userDiv = document.createElement('div');
    userDiv.style.border = '2px solid #0ff';
    userDiv.style.color = '#0ff';
    userDiv.style.padding = '10px';
    userDiv.style.marginBottom = '10px';
    userDiv.style.whiteSpace = 'pre-wrap';
    userDiv.style.cursor = 'pointer';
    userDiv.title = 'Dvaput klikni za ban';

    userDiv.textContent = JSON.stringify(userData, null, 2);

    userDiv.addEventListener('dblclick', () => {
      bannedUsers.add(visitorId);
      fin.removeChild(userDiv);
      alert('Korisnik banovan!');
      disableChat();
      // Ovde možeš poslati ban podatke serveru
    });

    fin.appendChild(userDiv);

  } else {
    fin.style.display = 'none';
    fin.innerHTML = '';
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
