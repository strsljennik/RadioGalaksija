// Funkcija za otvaranje/zaključavanje modalnog prozora sa smajlovima
document.getElementById('smilesBtn').addEventListener('click', () => {
    const smileModal = document.getElementById('smileModal');
    const { bottom, left } = document.getElementById('smilesBtn').getBoundingClientRect();
    
    // Ako je modal trenutno skriven, prikaži ga
    if (smileModal.style.display === 'none' || smileModal.style.display === '') {
        Object.assign(smileModal.style, {
            top: `${bottom + 5}px`,
            left: `${left}px`,
            display: 'flex'
        });

        // Učitaj slike iz localStorage
        loadImagesFromLocalStorage();
    } else {
        // Ako je modal otvoren, zatvori ga
        closeSmileModal();
    }
});

// Funkcija za učitavanje slika iz localStorage
const loadImagesFromLocalStorage = () => {
    const smileContainer = document.getElementById('smileContainer');
    smileContainer.innerHTML = ''; // Očisti container pre nego što dodaš nove slike

    const allItems = JSON.parse(localStorage.getItem('emojiData')) || [];
    allItems.forEach(item => {
        const element = document.createElement('span');
        let imgElement;

        if (item.type === 'emoji') {
            element.textContent = item.content;
            element.classList.add('smile');
            element.onclick = () => addSmile(item.content);
        } else if (item.type === 'image') {
            imgElement = document.createElement('img');
            imgElement.src = emojiFolder + item.content;
            imgElement.classList.add('smile');
            imgElement.alt = item.content;
            element.classList.add('smile');
            element.onclick = () => addImageToChat(emojiFolder + item.content);
            element.appendChild(imgElement);
        }

        smileContainer.appendChild(element);
    });
};

// Funkcija za dodavanje emojija u chat
const addSmile = (smile) => {
    const chatInput = document.getElementById('chatInput');
    if (chatInput) {
        chatInput.value += smile;
        closeSmileModal();
    }
};

// Funkcija za dodavanje slike u chat
const addImageToChat = (imgSrc) => {
    const chatInput = document.getElementById('chatInput');
    if (chatInput) {
        chatInput.value += ` <img src="${imgSrc}" alt="emoji"> `;
        closeSmileModal();
    }
};

// Funkcija za zatvaranje modalnog prozora
const closeSmileModal = () => {
    const smileModal = document.getElementById('smileModal');
    if (smileModal) {
        smileModal.style.display = 'none';
    }
};

// Funkcija za ažuriranje localStorage sa novim podacima
const updateLocalStorage = (newItems) => {
    localStorage.setItem('emojiData', JSON.stringify(newItems));
};

// Funkcija za dodavanje novih slika ili emojija u listu
const addNewItemToLocalStorage = (newItem) => {
    // Učitavamo trenutne stavke iz localStorage
    const allItems = JSON.parse(localStorage.getItem('emojiData')) || [];
    
    // Dodajemo novi element (emoji ili sliku)
    allItems.push(newItem);
    
    // Ažuriramo localStorage sa novim podacima
    updateLocalStorage(allItems);

    // Ponovno učitavanje slika u modal
    loadImagesFromLocalStorage();
};

// HTML kod za modal
const smileModalHTML = `
<div id="smileModal" style="display:none;position:fixed;width:300px;background:black;padding:10px;border:1px solid white;z-index:1000;overflow-y:auto;border-radius:5px;color:white;flex-wrap:wrap;max-height:400px;">
    <button onclick="closeSmileModal()" style="background:red;color:white;border:none;padding:5px 10px;cursor:pointer;float:right;">X</button>
    <div id="smileContainer" style="display:flex;flex-wrap:wrap;gap:8px;overflow-y:auto;"></div>
</div>`;

// Dodavanje modala u HTML ako već nije prisutan
if (!document.getElementById('smileModal')) document.body.insertAdjacentHTML('beforeend', smileModalHTML);

// Folder za slike
const emojiFolder = 'emoji gif/';
const allItems = [
    ...['☕', '🖤', '💛', '💚','👀'].map(e => ({ type: 'emoji', content: e })),
    ...[
        
         'mesa.webp', 'luster.webp', 'bye.webp', 'crveni.webp', 'sl.webp', 
         'slika9.avifs', 'slika10.avifs', 'slika11.avifs','slika12.avifs','slika13.avifs',
        'slika1.avifs', 'slika3.avifs', 'slika4.avifs', 'bub.gif', 'ok.gif', 
         'slika5.avifs', 'slika6.avifs', 'slika7.avifs','slika8.avifs', 'nag1.webp', 
        'uzivam.gif', 'stik10.png', 'dance.gif', 'dance1.gif', 'dance2.gif', 
        'dance3.gif', 'ily1.gif', 'ily2.gif', 'beba.gif', 
        'rg.gif', 'x.gif', 'x1.gif', 'kiss.gif', 'kiss1.gif', 
        'patak1.avifs', 'patak2.avifs', 'jerry1.avifs', 'jerry2.avifs', 'jerry3.avifs', 'jerry.webp', 
  'kiss2.gif', 'srce2.gif', 'srce3.gif', 'srce4.gif', 
  'nov1.gif', 'nov3.gif', 'nov4.gif', 'nov5.gif', 'nov6.gif', 
  'nov7.gif', 'nov8.gif', 'nov9.gif', 'nov10.gif', 'nov11.gif', 'nov12.gif', 
  'nov13.gif', 'nov15.gif', 'nov16.gif', 'nov17.gif', 'nov18.gif', 
           'nov19.gif', 'nov20.gif', 'nov21.gif'
].map(img => ({ type: 'image', content: img }))
];

console.log(allItems); // Proveri da li su svi podaci pravilno učitani

// Čuvanje slika u localStorage
const saveImagesToLocalStorage = () => {
    localStorage.setItem('emojiData', JSON.stringify(allItems));
};

// Pozivamo funkciju da sačuvamo slike u localStorage
saveImagesToLocalStorage();

