let isBold = false;
let isItalic = false;
let currentColor = '';
let newColor;
let isUnderline = false;
let isOverline = false;
const guestsData = {};

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

document.getElementById('chatInput').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        let message = this.value;
        socket.emit('chatMessage', {
            text: message,
            bold: isBold,
            italic: isItalic,
            color: currentColor,
            underline: isUnderline,
            overline: isOverline,
            nickname: nickname, 
      });
        this.value = '';
    }
});

socket.on('chatMessage', function(data) {
    let messageArea = document.getElementById('messageArea');
    let newMessage = document.createElement('div');
    newMessage.classList.add('message');
    newMessage.style.fontWeight = data.bold ? 'bold' : 'normal';
    newMessage.style.fontStyle = data.italic ? 'italic' : 'normal';
    newMessage.style.color = data.color;
    newMessage.style.textDecoration = (data.underline ? 'underline ' : '') + (data.overline ? 'overline' : '');
    newMessage.innerHTML = `<strong>${data.nickname}:</strong> ${data.text} <span style="font-size: 0.8em; color: gray;">(${data.time})</span>`;
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
const colorPicker = document.getElementById('colorPicker');
let currentGuestId = null;
let currentInputHandler = null;

// Dodaj nove goste
users.forEach(nickname => {
    const guestId = `guest-${nickname}`;
    if (!guestsData[guestId]) {
        const newGuest = document.createElement('div');
        newGuest.className = 'guest';
        newGuest.id = guestId;
        newGuest.textContent = nickname;

        // Učitaj boju iz sessionStorage ako postoji
        const savedColor = sessionStorage.getItem(guestId) || '';
        newGuest.style.color = savedColor;
        guestsData[guestId] = { nickname, color: savedColor };

        newGuest.setAttribute('data-guest-id', guestId);

        // Desni klik za izbor boje
        newGuest.addEventListener('contextmenu', function (event) {
            event.preventDefault();
            currentGuestId = guestId;

            colorPicker.value = guestsData[guestId].color || '#000000';

            if (currentInputHandler) {
                colorPicker.removeEventListener('input', currentInputHandler);
            }

            currentInputHandler = function () {
                const boja = colorPicker.value;
                guestsData[guestId].color = boja;
                newGuest.style.color = boja;
                sessionStorage.setItem(guestId, boja);
                updateGuestColor(guestId, boja);
            };

            colorPicker.addEventListener('input', currentInputHandler);
        });

        guestList.appendChild(newGuest);
    }
});

// Funkcija za postavljanje boje gosta
function setGuestColor(guestId, color) {
    const guestElement = document.getElementById(guestId);
    if (guestElement) {
        guestElement.style.color = color;
        guestsData[guestId].color = color;
        sessionStorage.setItem(guestId, color);
    }
}

// Ažuriranje boje gosta i emitovanje događaja na server
function updateGuestColor(guestId, newColor) {
    setGuestColor(guestId, newColor);
    socket.emit('updateGuestColor', { guestId, newColor });
}

// Slušanje događaja za ažuriranje boje
socket.on('updateGuestColor', ({ guestId, newColor }) => {
    setGuestColor(guestId, newColor);
});

// Slušanje trenutnih gostiju i njihovih boja
socket.on('currentGuests', (guests) => {
    if (Array.isArray(guests)) {
        guests.forEach(({ guestId, color }) => {
            setGuestColor(guestId, color);
        });
    }
});
