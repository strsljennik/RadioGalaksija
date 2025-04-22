// Kada korisnik dobije nickname od servera
socket.on('setNickname', function(nickname) {
    // Prikazivanje početnog nadimka
    console.log(`Tvoj početni nadimak je: ${nickname}`);
});

// Kada korisnik pošalje svoje ime (prijava)
socket.on('userLoggedIn', function(username) {
    console.log(`Tvoj username je sada: ${username}`);
    // Prikazivanje korisničkog imena u interfejsu
    document.getElementById('usernameDisplay').innerText = username;
});

let myNickname = ''; // biće postavljen od servera

socket.on('yourNickname', function(nick) {
    myNickname = nick;
});

let isBold = false;
let isItalic = false;
let currentColor = '';
let newColor;
let isUnderline = false;
let isOverline = false;
const guestsData = {};
let currentGuestId = ''; 

document.getElementById('boldBtn').addEventListener('click', function() {
    isBold = !isBold;
    updateInputStyle();
});

document.getElementById('italicBtn').addEventListener('click', function() {
    isItalic = !isItalic;
    updateInputStyle();
});

document.getElementById('colorBtn').addEventListener('click', function() {
    document.getElementById('colorPicker').click();
});

document.getElementById('colorPicker').addEventListener('input', function() {
    currentColor = this.value;
    updateInputStyle();
});

document.getElementById('linijadoleBtn').addEventListener('click', function() {
    isUnderline = !isUnderline;
    updateInputStyle();
});

document.getElementById('linijagoreBtn').addEventListener('click', function() {
    isOverline = !isOverline;
    updateInputStyle();
});

function updateInputStyle() {
    let inputField = document.getElementById('chatInput');
    inputField.style.fontWeight = isBold ? 'bold' : 'normal';
    inputField.style.fontStyle = isItalic ? 'italic' : 'normal';
    inputField.style.color = currentColor;
    inputField.style.textDecoration = (isUnderline ? 'underline ' : '') + (isOverline ? 'overline' : '');
}

let lastMessages = {}; // Objekt koji prati poslednju poruku svakog korisnika

socket.on('chatMessage', function(data) {
    if (!myNickname) return; // ne prikazuj dok ne znaš svoj nick

    const myName = currentUser ? currentUser : myNickname;
    let text = data.text.replace(/#n/g, myName);

    // Ako je trenutna poruka ista kao poslednja poslata od tog korisnika, blokiraj je
    if (lastMessages[data.nickname] === text) return;

    // Updajtuj poslednju poruku za tog korisnika
    lastMessages[data.nickname] = text;

    let messageArea = document.getElementById('messageArea');
    let newMessage = document.createElement('div');
    newMessage.classList.add('message');
    newMessage.style.fontWeight = data.bold ? 'bold' : 'normal';
    newMessage.style.fontStyle = data.italic ? 'italic' : 'normal';
    newMessage.style.color = data.color;
    newMessage.style.textDecoration = (data.underline ? 'underline ' : '') + (data.overline ? 'overline' : '');
    newMessage.innerHTML = `<strong>${data.nickname}:</strong> ${text.replace(/\n/g, '<br>').replace(/ {2}/g, '&nbsp;&nbsp;')} <span style="font-size: 0.8em; color: gray;">(${data.time})</span>`;
    messageArea.prepend(newMessage);
    messageArea.scrollTop = 0;
});


socket.on('private_message', function(data) {
    let messageArea = document.getElementById('messageArea');
    let newMessage = document.createElement('div');
    newMessage.classList.add('message');
    newMessage.style.fontWeight = data.bold ? 'bold' : 'normal';
    newMessage.style.fontStyle = data.italic ? 'italic' : 'normal';
    newMessage.style.color = data.color;
    newMessage.style.textDecoration = (data.underline ? 'underline ' : '') + (data.overline ? 'overline' : '');
    newMessage.innerHTML = `<strong>${data.from} (Privatno):</strong> ${data.message} <span style="font-size: 0.8em; color: gray;">(${data.time})</span>`;
    messageArea.prepend(newMessage);
    messageArea.scrollTop = 0;
});

// Lista CSS gradijenata
const gradientBackgrounds = [
  'linear-gradient(45deg, #ff6347, #ffea00, #ff1493, #00ff00)',
  'radial-gradient(circle, #ff6347, #ffea00, #ff1493, #00ff00)',
  'linear-gradient(to right, #00f, #ff6347, #ff1493, #ffea00)',
  'radial-gradient(circle, #00ff00, #00f, #ff1493, #ff6347)',
  'linear-gradient(to left, #f00, #0f0, #00f)',
  'radial-gradient(circle, #00ffff, #ff00ff)',
  'linear-gradient(45deg, #ff6347, #ff1493, #00f)',
  'radial-gradient(circle, #ffea00, #00ff00)',
  'linear-gradient(to right, #ff1493, #00f)',
  'radial-gradient(circle, #00ff00, #ff6347)'
];

// Funkcija za random gradijent
function getRandomGradient() {
  return gradientBackgrounds[Math.floor(Math.random() * gradientBackgrounds.length)];
}


// Kada nov gost dođe
socket.on('newGuest', function (nickname) {
    const guestId = `guest-${nickname}`;
    const guestList = document.getElementById('guestList');
    const newGuest = document.createElement('div');
    newGuest.classList.add('guest');
    newGuest.id = guestId; // Dodaj ID za svakog gosta
    newGuest.textContent = nickname;

const gradient = getRandomGradient();
newGuest.style.background = gradient;
newGuest.style.webkitBackgroundClip = 'text';
newGuest.style.webkitTextFillColor = 'transparent';


    // Dodaj novog gosta u guestsData ako ne postoji
    if (!guestsData[guestId]) {
        guestsData[guestId] = { nickname, color: '' }; // Ako ne postoji, dodajemo ga sa podrazumevanom bojom
    }
 guestList.appendChild(newGuest); // Dodaj novog gosta u listu
});

// Ažuriranje liste gostiju bez resetovanja stilova
socket.on('updateGuestList', function (users) {
    const guestList = document.getElementById('guestList');
    const currentGuests = Array.from(guestList.children).map(guest => guest.textContent);

    // Ukloni goste koji više nisu u listi
    currentGuests.forEach(nickname => {
        if (!users.includes(nickname)) {
            delete guestsData[`guest-${nickname}`]; // Ukloni iz objekta

            // Ukloni iz DOM-a
            const guestElement = Array.from(guestList.children).find(guest => guest.textContent === nickname);
            if (guestElement) {
                guestList.removeChild(guestElement);
            }
        }
    });

    // Dodaj nove goste
    users.forEach(nickname => {
        const guestId = `guest-${nickname}`;
        if (!guestsData[guestId]) {
            const newGuest = document.createElement('div');
            newGuest.className = 'guest';
            newGuest.id = guestId; // Postavi ID za svakog gosta
            newGuest.textContent = nickname;
            newGuest.style.color = ''; // Podrazumevana boja ako nije postavljena

const gradient = getRandomGradient();
newGuest.style.background = gradient;
newGuest.style.webkitBackgroundClip = 'text';
newGuest.style.webkitTextFillColor = 'transparent';


           guestsData[guestId] = { nickname, color: newGuest.style.color }; // Dodaj podatke o gostu

// Dodaj data-guest-id atribut na newGuest element
newGuest.setAttribute('data-guest-id', guestId);

newGuest.addEventListener('click', function (event) {
    const clickedGuestId = event.target.getAttribute('data-guest-id');
    if (clickedGuestId === guestId.toString()) {
        currentGuestId = guestId;
        const colorPicker = document.getElementById('colorPicker');
        colorPicker.value = guestsData[guestId].color || '#000000';

        // Dodavanje event listener-a za promenu boje
        colorPicker.addEventListener('input', function() {
            guestsData[guestId].color = colorPicker.value;
            newGuest.style.color = colorPicker.value;
        });
    }
});

            guestList.appendChild(newGuest); // Dodaj novog gosta u listu
        }
    });
});

// Funkcija za postavljanje boje gosta
function setGuestColor(guestId, color) {
    const guestElement = document.getElementById(guestId);
    if (guestElement) {
        guestElement.style.color = color;
        guestsData[guestId].color = color;
    }
}

// Ažuriranje boje gosta i emitovanje događaja na server
function updateGuestColor(guestId, newColor) {
    setGuestColor(guestId, newColor);
    socket.emit('updateGuestColor', { guestId, newColor }); // Emituje sa "newColor"
}

// Slušanje događaja za ažuriranje boje
socket.on('updateGuestColor', ({ guestId, newColor }) => {
    setGuestColor(guestId, newColor);
});

// Slušanje događaja za trenutne goste i njihovih boja
socket.on('currentGuests', (guests) => {
    if (Array.isArray(guests)) {
        guests.forEach(({ guestId, color }) => {
            setGuestColor(guestId, color);
        });
    }
});


// Dodaj listener za ažuriranje boje u realnom vremenu
const colorPicker = document.getElementById('colorPicker');
if (colorPicker) {
    colorPicker.addEventListener('input', function () {
        if (currentGuestId) {
            updateGuestColor(currentGuestId, this.value);
        }
    });
}
