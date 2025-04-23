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
window.guestsData = guestsData;
let currentGuestId = ''; 

document.getElementById('boldBtn').addEventListener('click', function() {
    isBold = !isBold;
    updateInputStyle();
});

document.getElementById('italicBtn').addEventListener('click', function() {
    isItalic = !isItalic;
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
let gradijentAktivan = false;

document.getElementById("sar").addEventListener("click", () => {
    gradijentAktivan = !gradijentAktivan;
});


socket.on('chatMessage', function(data) {
    if (!myNickname) return;

    const myName = currentUser ? currentUser : myNickname;
    let text = data.text.replace(/#n/g, myName);
    if (lastMessages[data.nickname] === text) return;
    lastMessages[data.nickname] = text;

    const messageArea = document.getElementById('messageArea');
    const newMessage = document.createElement('div');
    newMessage.classList.add('message');

    // Ako je autorizovan korisnik – primeni random gradijent
   if (authorizedUsers.has(data.nickname) && gradijentAktivan) {
    const gradientBoxes = document.querySelectorAll('#gradijent .gradient-box');
    const randomBox = gradientBoxes[Math.floor(Math.random() * gradientBoxes.length)];
    const gradient = window.getComputedStyle(randomBox).backgroundImage;

    newMessage.style.backgroundImage = gradient;
    newMessage.style.webkitBackgroundClip = 'text';
    newMessage.style.backgroundClip = 'text';
    newMessage.style.color = 'transparent';
    newMessage.style.fontWeight = 'bold';
    newMessage.style.fontStyle = 'italic';
} else {
    newMessage.style.fontWeight = data.bold ? 'bold' : 'normal';
    newMessage.style.fontStyle = data.italic ? 'italic' : 'normal';
    newMessage.style.color = data.color;
    newMessage.style.textDecoration = (data.underline ? 'underline ' : '') + (data.overline ? 'overline' : '');
}


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

           guestsData[guestId] = { nickname, color: newGuest.style.color }; // Dodaj podatke o gostu

// Dodaj data-guest-id atribut na newGuest element
newGuest.setAttribute('data-guest-id', guestId);

   guestList.appendChild(newGuest); // Dodaj novog gosta u listu
        }
    });
});

document.getElementById('colorBtn').addEventListener('click', function() {
    document.getElementById('colorPicker').click();
});

document.getElementById('colorPicker').addEventListener('input', function() {
    currentColor = this.value;
    updateInputStyle();

    setTimeout(() => {
        const myDivId = `guest-${myNickname}`;
        const myDiv = document.getElementById(myDivId);
        if (myDiv) {
            myDiv.style.color = currentColor;
        }

        // Emitovanje nove boje preko socket-a
        socket.emit('colorChange', { nickname: myNickname, color: currentColor });
    }, 300);
});

// Slušanje svih boja pri povezivanju
socket.on('allColors', (colors) => {
    // Primena boja za sve korisnike
    for (const nickname in colors) {
        const color = colors[nickname];
        const myDivId = `guest-${nickname}`;
        const myDiv = document.getElementById(myDivId);
        if (myDiv) {
            myDiv.style.color = color;
        }
    }
});

socket.on('colorChange', (data) => {
    const myDivId = `guest-${data.nickname}`;
    const myDiv = document.getElementById(myDivId);
    if (myDiv) {
        myDiv.style.color = data.color;
    }
});
