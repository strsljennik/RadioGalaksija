let currentUser = null;

// Registracija korisnika
document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;

    fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => {
        if (response.ok) {
            alert('Registracija uspešna');
            this.reset();
        } else {
            alert('Greška pri registraciji');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Došlo je do greške. Pokušajte ponovo.');
    });
});

// Prijava korisnika
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-socket-id': socket.id  // Dodajemo socket ID u header
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => {
        if (response.ok) {
            alert('Prijava uspešna');
            socket.emit('userLoggedIn', username);
            this.reset();
        } else {
            alert('Nevažeći podaci za prijavu');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Došlo je do greške. Pokušajte ponovo.');
    });
});

socket.on('userLoggedIn', (data) => {
    currentUser = data.username;
    myNickname = data.username; // <-- DODATO OVO
    window.currentUser = { username: data.username };
    console.log("Prijavljeni korisnik:", currentUser);

    if (data.role === 'admin') {
        enableAdminFeatures();
    } else {
        enableGuestFeatures();
    }
});

// Funkcija za omogućavanje admin funkcionalnosti
function enableAdminFeatures() {
    console.log("Admin funkcionalnosti omogućene!");
   
}

// Funkcija za omogućavanje gost funkcionalnosti
function enableGuestFeatures() {
    console.log("Gost funkcionalnosti omogućene!");
    // Kod za omogućavanje gost funkcionalnosti
}
//   ZA BROJEVE   GOST-5555
socket.on('userLoggedIn', (data) => {
    currentUser = data.username;
    myNickname = data.username;
    window.currentUser = { username: data.username };

    // Provera da li je korisnik "Gost-XXXX" i tretiraj ga kao registrovanog
    if (currentUser.startsWith('Gost-')) {
        markAsRegisteredGuest();
    } else {
        if (data.role === 'admin') {
            enableAdminFeatures();
        } else {
            enableGuestFeatures();
        }
    }
});

// Funkcija za obeležavanje gosta kao registrovanog korisnika
function markAsRegisteredGuest() {
    document.getElementById("userStatus").innerText = "Registrovani gost";
}

function startBlinking() {
  const guestDiv = document.getElementById(`guest-${currentUser}`);
  if (!guestDiv) return;

  let visible = false;
  const img = document.createElement('img');
  img.src = 'nik/sl4.webp';
  img.className = 'inline-avatar blinking-temp';

  blinkInterval = setInterval(() => {
    if (visible) {
      guestDiv.querySelector('.blinking-temp')?.remove();
    } else {
      guestDiv.appendChild(img.cloneNode());
    }
    visible = !visible;
  }, 500); // 0.5s blink

  setTimeout(() => {
    clearInterval(blinkInterval);
    guestDiv.querySelector('.blinking-temp')?.remove();
  }, 60 * 1000); // 1 minut blinking

  socket.emit('guestInactive', { username: currentUser }); // javi serveru
}
socket.on('startBlinking', (username) => {
  const guestDiv = document.getElementById(`guest-${username}`);
  if (guestDiv) {
    startBlinking(); // Poziva funkciju koja je već postavljena na klijentu
  }
});
