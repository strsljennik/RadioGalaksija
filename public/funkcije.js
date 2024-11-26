document.addEventListener("DOMContentLoaded", () => {
    const PASSWORD = "galaksija123";
    let hasBanPrivilege = false;
    let isBanned = false; // Praćenje statusa banovanja

    const guestList = document.getElementById("guestList");
    const chatContainer = document.getElementById("chatContainer"); // Referenca na chat

    // Funkcija za proveru lozinke
    function promptPassword() {
        const password = prompt("Unesite lozinku:");
        if (password === PASSWORD) {
            alert("Pristup odobren!");
            hasBanPrivilege = true;
            socket.emit('enterPassword', password);  // Pošaljemo lozinku serveru
        } else {
            alert("Pogrešna lozinka!");
        }
    }

    // Proveravanje da li postoji guestList
    if (!guestList) {
        console.error("Element sa id='guestList' nije pronađen.");
        return;
    }

    // Event za unos lozinke
    document.getElementById("banned").addEventListener("click", promptPassword);

    // Dvoklik na korisnike
    guestList.addEventListener("dblclick", (event) => {
        const target = event.target;
        if (!target.classList.contains("guest")) return;

        // Uzimamo samo osnovni nickname (pre dugmadi)
        const nickname = target.textContent.split(" (")[0].trim().replace(/( (B|I))/g, '');

        if (hasBanPrivilege) {
            const action = target.classList.toggle("banned") ? "banUser" : "unbanUser";
            target.style.backgroundColor = action === "banUser" ? "red" : "";
            target.textContent = `${nickname}${action === "banUser" ? " (B)" : ""}`;
            socket.emit(action, nickname);  // Pošaljite naziv bez formata na server
        } else {
            alert("Nemate privilegije za banovanje korisnika.");
        }
    });

    // Slušanje događaja za banovanje na serveru
    socket.on("userBanned", (nickname) => {
        console.log(`User ${nickname} banned by server`);
        const elements = document.querySelectorAll('.guest');
        elements.forEach((el) => {
            if (el.textContent.split(" (")[0].trim().replace(/( (B|I))/g, '') === nickname) {
                el.classList.add("banned");
                el.style.backgroundColor = "red";
                if (!el.textContent.includes(" (B)")) {
                    el.textContent += " (B)";
                }
            }
        });

        // Ako je banovan trenutni korisnik
        if (nickname === socket.id) {
            isBanned = true;
            alert("Banovani ste i ne možete interagovati sa chat-om.");
            document.getElementById('chatInput').disabled = true;
            chatContainer.style.display = 'none'; // Sakrij chat
        }
    });

    // Slušanje događaja za odbanovanje na serveru
    socket.on("userUnbanned", (nickname) => {
        console.log(`User ${nickname} unbanned by server`);
        const elements = document.querySelectorAll('.guest');
        elements.forEach((el) => {
            if (el.textContent.split(" (")[0].trim().replace(/( (B|I))/g, '') === nickname) {
                el.classList.remove("banned");
                el.style.backgroundColor = "";
                el.textContent = el.textContent.replace(" (B)", ""); // Uklonite (B) oznaku
            }
        });

        // Ako je odbanovan trenutni korisnik
        if (nickname === socket.id) {
            isBanned = false;
            alert("Odbanovani ste i možete ponovo interagovati sa chat-om.");
            document.getElementById('chat-input').disabled = false;
            chatContainer.style.display = 'block'; // Prikazuj ponovo chat
        }
    });

    // Funkcija koja prati unos poruka
    document.getElementById('chat-input').addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            if (isBanned) {
                alert('Banovani ste i ne možete slati poruke.');
                return;
            }

            const message = this.value;
            socket.emit('chatMessage', { text: message, bold: false, italic: false, color: 'black' });
            this.value = ''; // Isprazni polje za unos
        }
    });
});