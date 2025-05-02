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
let inactivityTimer;
let activeTime = 0;
let showImageTimer;
let guestDiv;

// Osluškujemo promenu taba (vidljivost stranice)
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // Kada tab postane neaktivan, resetujemo aktivno vreme
    activeTime = 0;
    inactivityTimer = setInterval(() => {
      activeTime++;
      if (activeTime >= 15) {
        // Ako je korisnik neaktivan 15 minuta, prikazujemo sliku
        showInactiveImage();
      }
    }, 1000); // svakih 1 sekund merimo
  } else {
    // Kada korisnik se vrati na tab, zaustavljamo brojanje neaktivnosti
    clearInterval(inactivityTimer);
    removeInactiveImage(); // uklanjamo sliku odmah
  }
});

function showInactiveImage() {
  guestDiv = document.getElementById(`guest-${currentUser}`);
  if (!guestDiv) return;

  const img = document.createElement('img');
  img.src = 'nik/sl4.webp';
  img.className = 'inline-avatar inactive-image';

  guestDiv.appendChild(img); // Dodajemo sliku

  // Postavljamo tajmer da uklonimo sliku posle 1 minuta
  showImageTimer = setTimeout(() => {
    removeInactiveImage();
  }, 60 * 1000); // ukloni sliku posle 1 minuta
}

function removeInactiveImage() {
  if (guestDiv) {
    const img = guestDiv.querySelector('.inactive-image');
    if (img) {
      guestDiv.removeChild(img); // Uklonimo sliku
    }
  }
}

