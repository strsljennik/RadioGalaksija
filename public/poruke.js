const authorizedUsers = new Set(['Radio Galaksija', 'ZI ZU', '*__X__*']);

const functionModal = document.getElementById('functionModal');
let isDraggingFunc = false;
let offsetXFunc = 0;
let offsetYFunc = 0;

document.getElementById('openModal').addEventListener('click', function () {
    if (authorizedUsers.has(currentUser)) {
        functionModal.style.display = "block";
    } else {
        alert('Nemate dozvolu da otvorite ovaj panel.');
    }
});

document.getElementById('closeModal').addEventListener('click', function () {
    functionModal.style.display = "none";
});

// Drag start
functionModal.addEventListener('mousedown', function (e) {
    isDraggingFunc = true;
    offsetXFunc = e.clientX - functionModal.offsetLeft;
    offsetYFunc = e.clientY - functionModal.offsetTop;
});

// Drag move
document.addEventListener('mousemove', function (e) {
    if (isDraggingFunc) {
        functionModal.style.left = (e.clientX - offsetXFunc) + 'px';
        functionModal.style.top = (e.clientY - offsetYFunc) + 'px';
    }
});

// Drag end
document.addEventListener('mouseup', function () {
    isDraggingFunc = false;
});

// Brisanje sadržaja chata
document.getElementById('clearChat').addEventListener('click', function() {
    const chatWindow = document.getElementById('messageArea');
    chatWindow.innerHTML = ""; // Briše sve unutar chata
    console.log("Chat je obrisan.");

    // Emituj događaj serveru za brisanje chata
    socket.emit('clear-chat'); 
});

// Slušanje na 'chat-cleared' događaj
socket.on('chat-cleared', function() {
    console.log('Chat je obrisan sa servera.');
    const chatWindow = document.getElementById('messageArea');
    chatWindow.innerHTML = ""; // Briše sve unutar chata
});

// ZENO PLAYER NA DUGME
document.addEventListener("DOMContentLoaded", function() {
    var audio = document.getElementById('radioStream');
    var button = document.getElementById('sound');
    var isPlaying = false;

    button.addEventListener('click', function() {
          button.blur();
        if (isPlaying) {
            audio.pause();
              button.textContent = "Play";
          isPlaying = false;
        } else {
            playStream();
        }
    });

    function playStream() {
        audio.src = "https://stream.zeno.fm/krdfduyswxhtv";  
        audio.load();  
        audio.play().then(() => {
            button.textContent = "Stop";
          isPlaying = true;
        }).catch(error => console.error("Greška pri puštanju zvuka:", error));
    }

    // Automatsko ponovno pokretanje pri gubitku konekcije
    audio.addEventListener('error', function() {
        setTimeout(playStream, 3000);
    });
});

//  REGISTRACIJA I LOGIN TABLA
document.getElementById('NIK').addEventListener('click', function() {
    var container = document.getElementById('authContainer');
    container.style.display = container.style.display === 'none' ? 'block' : 'none';
  });
//  BANIRANJE SA IP ADRESOM I MODAL LISTOM
let lozinkaProverena = false; // Promenljiva koja prati da li je lozinka već uneta

document.getElementById('govna').addEventListener('click', function () {
    if (!lozinkaProverena) {
        let lozinka = prompt("Unesite lozinku:");
        if (lozinka === "babaroga") {
            lozinkaProverena = true; // Postavljamo da je lozinka uneta ispravno
        } else {
            alert("Netačna lozinka!");
            return; // Ako lozinka nije tačna, prekidamo izvršenje funkcije
        }
    }

    // Nakon prve tačne lozinke, dugme normalno otvara/zatvara modal
    let uuidModal = document.getElementById('uuidModal');
    uuidModal.style.display = (uuidModal.style.display === "block") ? "none" : "block";
});

 
    uuidModal.addEventListener('mousedown', function (e) {
        isDragging = true;
        offsetX = e.clientX - uuidModal.offsetLeft;
        offsetY = e.clientY - uuidModal.offsetTop;
    });

    document.addEventListener('mousemove', function (e) {
        if (isDragging) {
           uuidModal.style.left = e.clientX - offsetX + 'px';
           uuidModal.style.top = e.clientY - offsetY + 'px';
        }
    });

    document.addEventListener('mouseup', function () {
        isDragging = false;
    });

const uuidList = document.getElementById('uuidList');

socket.on('new-log', (message) => {
    const ipMatch = message.match(/(.+?) se povezao\. IP adresa korisnika: ([\d\.]+)/);
    const renameMatch = message.match(/(.+?) je sada (.+?)\./);

    let listItem = document.createElement('li');

    if (ipMatch) {
        let nickname = ipMatch[1];
        let ipAddress = ipMatch[2];

        listItem.textContent = `Korisnik: ${nickname} | IP: ${ipAddress}`;
        listItem.setAttribute('data-ip', ipAddress);

        let infoInput = document.createElement('input');
        infoInput.type = 'text';
        infoInput.placeholder = 'Dodaj informaciju...';
        infoInput.style.marginLeft = '10px';

        infoInput.addEventListener('blur', function() {
            socket.emit('saveUserNote', { ipAddress, note: infoInput.value });
        });

        listItem.appendChild(infoInput);
        uuidList.appendChild(listItem);

    } else if (renameMatch) {
        let from = renameMatch[1];
        let to = renameMatch[2];
        listItem.textContent = `Preimenovan: ${from} → ${to}`;
        uuidList.appendChild(listItem);
    }
});

// SAMO OVAJ DEO ZA DODAVANJE INFO U POSTOJEĆE POLJE
socket.on('logMessage', (message) => {
    const match = message.match(/IP adresa: ([\d\.]+) \(Info: (.*)\)/);
    if (!match) return;

    const ipAddress = match[1];
    const infoText = match[2];

    const existingItem = [...uuidList.children].find(li => li.getAttribute('data-ip') === ipAddress);
    if (!existingItem) return;

    const input = existingItem.querySelector('input');
    if (input && infoText && infoText !== "Nema dodatnog info") {
        input.value = infoText;
    }
});

// Selektovanje liste
let selectedItem = null;

// Dodavanje event listener-a za klik na stavku u listi
document.getElementById('uuidList').addEventListener('click', function(event) {
    // Ako je kliknuto na <li> stavku, postavi je kao selektovanu
    if (event.target.tagName === 'LI') {
        // Ako je već selektovana ista stavka, poništi selektovanje
        if (selectedItem === event.target) {
            selectedItem.classList.remove('selected');
            selectedItem = null;
        } else {
            // Poništi selektovanje prethodne stavke, ako postoji
            if (selectedItem) {
                selectedItem.classList.remove('selected');
            }
            // Selektuj novu stavku
            selectedItem = event.target;
            selectedItem.classList.add('selected');
        }
    }
});

// Akcija za brisanje
document.getElementById('delete').addEventListener('click', function() {
    if (selectedItem) {
        // Ukloni selektovanu stavku sa liste
        selectedItem.remove();

      }
});

document.getElementById('blokip').addEventListener('click', function() {
    if (selectedItem) {
        // Ekstrakcija IP adrese pomoću regularnog izraza
        let ipMatch = selectedItem.textContent.match(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/);
        
        if (ipMatch) {
            let ipAddress = ipMatch[0]; // Prava IP adresa iz teksta
            
            // Emitovanje događaja za banovanje
            socket.emit('banUser', ipAddress);
            
            console.log(`Banovan korisnik sa IP adresom: ${ipAddress}`);
        } else {
            alert("Nije pronađena validna IP adresa!");
        }
    } else {
        alert("Niste izabrali korisnika za banovanje!");
    }
});
