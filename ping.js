const axios = require('axios');

// URL tvog servisa na Renderu
const url = 'https://radiogalaksija-h6c7.onrender.com/';

// Funkcija koja šalje zahtev ka servisu
const pingService = async () => {
  try {
    const response = await axios.get(url);
    console.log(`Ping response: ${response.status}`); // Ispisuje status odgovora (200 OK)
  } catch (error) {
    console.error('Error pinging service:', error.message); // Ispisuje grešku ako nešto krene po zlu
  }
};

// Pokreće pingovanje svakih 5 minuta (300000 milisekundi)
setInterval(pingService, 300000); // 5 minuta
