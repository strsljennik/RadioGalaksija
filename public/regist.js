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
socket.on('setNickname', (nickname) => {
    console.log('Dobijen nadimak:', nickname);
    currentUser = nickname;
    myNickname = nickname;
    window.currentUser = { username: nickname };

    enableGuestFeatures(); // <<< DODAJ OVO OVDE
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
