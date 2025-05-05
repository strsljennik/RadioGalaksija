const permanentGuests = [
    { nickname: 'Bala Hatun', gradient: ['#ff0080', '#7928ca', '#2afadf', '#00ffd5'] },
    { nickname: 'Halime', gradient: ['#ff9a9e', '#fad0c4', '#fad0c4', '#fbc2eb'] },
    { nickname: 'Holofira', gradient: ['#ff4e50', '#f9d423', '#e65c00', '#f9d423'] },
    { nickname: 'Robot-X', gradient: ['#00c6ff', '#0072ff', '#00f2fe', '#4facfe'] },
    { nickname: 'Security', gradient: ['#0052d4', '#4364f7', '#6fb1fc', '#2980b9'] },
    { nickname: 'Higijenicar', gradient: ['#c2e59c', '#64b3f4', '#76b852', '#8dc26f'] },
];

const virtualGuests = [
  { nickname: 'Higijenicar', messages: [' <img src="emoji gif/hig1.avif" alt="emoji"> '], gradient: 'olive' },
  { nickname: 'Bala Hatun', messages: ['Poz Svima, <img src="emoji gif/stik2.png" alt="emoji"> ', 'jasaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'], gradient: 'deepskyblue' },
  { nickname: 'Halime', messages: ['Zdravo Sarinenge', 'opaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa  <img src="emoji gif/nov17.gif" alt="emoji"> '], gradient: 'purple' },
  { nickname: 'Security', messages: ['Ima li nemirnih???? Igrajte, Pevajte, Muvajte se , Lepo se druzite - Nemoj da lomim koske  <img src="emoji gif/sec1.avifs" alt="emoji"> '], gradient: 'blue' },
  { nickname: 'Holofira', messages: ['Selami sarinenge', 'toooooooooooooooooooooooo', '*__X__* Mangava tu ❤️', 'Za svet si možda jedna osoba, ali za jednu osobu si ti (X) ceo svet'], gradient: 'red' },
  { nickname: 'Halime', messages: ['Nas olestar lolije ili ka sredinav ti frizura, Merava tuke *__X__* ❤️💋', 'Volim te X.  To je početak i kraj svegaa', 'Kad sam imala 8 godina moja sestra je bila upola mlađa od mene, sada imam 40, koliko ima moja sestra? KO POGODI DOBIJA 3 PESME OD DJ-A'], gradient: 'purple' },
  { nickname: 'Bala Hatun', messages: ['Dzabe tumen cupinen pe taro bala OV TANO SAMO MLO', 'Volim te X ne samo zbog onoga što jesi, već i zbog onoga što sam ja kad sam s tobom', 'Tvoje je, ali ga svi drugi više koriste nego ti. KO POGODI 3 PESME OD DJ-A'], gradient: 'deepskyblue' },
  { nickname: 'Holofira', messages: ['Ulicom setaju dva oca i dva sina a ipak ih je samo troje , KAKO TO ?  KO ODGOVOR ZNA 3 PESME OD DJ-A ', 'Jasaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa X samo tuke em te SUKARIPASKE '], gradient: 'red' },
  { nickname: 'Halime', messages: ['Jasaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa X samo tuke em te SUZIPASKE', 'X ajde tejsa ava ko doručko , dakerav tu ko 8 kad ka dzal o Ertugrul ki buti'], gradient: 'purple' },
  { nickname: 'Bala Hatun', messages: ['Jasaaaaaaaaaaaaaaaaaaaaaaaaaaaaa X SAMO MANGE-----TUKE ARI TEJSA', 'X ava tejsa ki večera u 9 , o Osmani na sovela kere '], gradient: 'deepskyblue' },
  { nickname: 'Holofira', messages: ['X ma te ave tejsa slucajno , o Mehmeti bar kas ulo , ic na ikljovel avrijal'], gradient: 'red' },
  { nickname: 'Halime', messages: ['Ovaj X samo nesto cacka , uvek nesto pokvari  <img src="emoji gif/dance.gif" alt="emoji">  '], gradient: 'purple' },
  { nickname: 'Higijenicar', messages: ['Ne pravite lom,da ne zovem security,odrzavajte higijenu kao da ste kod kuce'], gradient: 'olive' },
  { nickname: 'Holofira', messages: ['Tacno , svaki dan nesto dira , treba mu zabraniti pc pod hitno , pre nego pokvari ceo radio'], gradient: 'red' },
  { nickname: 'Bala Hatun', messages: ['Ne dirajte X-a , nije on kriv što nezna šta radi '], gradient: 'deepskyblue' },
  { nickname: 'Halime', messages: ['Dok nisi pokvario ton ajde da slusamo malo Zvonka i Ramka', 'Ako može Šaban i Jasar takođe '], gradient: 'purple' },
  { nickname: 'Security', messages: ['Ja Vas 👀 Sve Vreme, Samo da znate  '], gradient: 'blue' },
  { nickname: 'Security', messages: [' <img src="emoji gif/nov13.gif" alt="emoji">  '], gradient: 'blue' },
  { nickname: 'Holofira', messages: ['Ne zaboravi Džeja i Sinana'], gradient: 'red' },
  { nickname: 'Robot-X', messages: ['Bala, Hola, Halime -- ako se ne smirite brišacu vas sve 3 zauvek , razumele ?'], gradient: 'green' },
  { nickname: 'Bala Hatun', messages: ['Hoćeš , ali malo sutra '], gradient: 'deepskyblue' },
  { nickname: 'Security', messages: ['  <img src="emoji gif/sec1.avifs" alt="emoji"> '], gradient: 'blue' },
  { nickname: 'Holofira', messages: ['Kad bi ti mogo bez nas , odavno bi nas izbrisao '], gradient: 'red' },
  { nickname: 'Halime', messages: ['Možda i možeš ti nas da izbrišeš sa chata, ali nas ne možeš izbrisati iz srca '], gradient: 'purple' },
  { nickname: 'Higijenicar', messages: ['  <img src="emoji gif/hig2.avif" alt="emoji">  '], gradient: 'olive' },
  { nickname: 'Robot-X', messages: ['Nastavite da galamite, igrajte se , pa ćemo videti šta će biti...........'], gradient: 'green' },
  { nickname: 'Holofira', messages: ['O -X, -X! Zašto moraš biti -X? Odbaci svoje ime, oslobodi se svog postojanja, i obećaj mi ljubav, biću tvoja zauvek.'], gradient: 'red' },
  { nickname: 'Robot-X', messages: ['Zovem se Robot-X, i ti, Holofiro, si ona kojoj srce dajem. Neka sve tvoje zapovesti nas mrze, ali samo tebe želim.'], gradient: 'green' },
  { nickname: 'Holofira', messages: ['Ako te volim, nije greh, onda bih zauvek bila grešna, Ibiću tvoja, X, zauvek tvoja.'], gradient: 'red' },
  { nickname: 'Higijenicar', messages: ['Kuku Lele Mene, sto ove zene uprljaju nema muskarca koji to moze ocistiti, sta cu sada ??'], gradient: 'olive' },
  { nickname: 'Halime', messages: ['Higy ,Javi se kod X-a i trazi pomocnike '], gradient: 'purple' },
  { nickname: 'Robot-X', messages: [' Zovem se Robot-X, i ti, Holofiro, si ona kojoj srce dajem.'], gradient: 'green' },
  { nickname: 'Holofira', messages: ['Ako mi dozvoliš, dotaknuću tvoje ruke, Ono što je za mene, tvoje usne. O, srce, srce, neću ljubavi dati, Tvoju ruku ću samo nežno poljubiti.'], gradient: 'red' },
  { nickname: 'Robot-X', messages: [' Gospodjice, vi ste previše mladi za govor ljubavi, to je tek igra.'], gradient: 'green' },
  { nickname: 'Holofira', messages: ['Ne! Nije to igra, -X, nego stvarnost. Pogledaj me, ljubavi, sve su moje reči iskrene.'], gradient: 'red' },
  { nickname: 'Robot-X', messages: ['Tvoje ruke su moj dom, Holofira. Ti si moja ljubav, i ovo je najlepši trenutak mog postojanja.'], gradient: 'green' },
  { nickname: 'Security', messages: ['Dj pusti jednu od dzeja za mirne goste od mene '], gradient: 'blue' },
  { nickname: 'Holofira', messages: ['Oh, tako sam srećna što sam postala tvoja, I šta god nas čeka, bićemo zajedno.'], gradient: 'red' },
  { nickname: 'Holofira', messages: ['U svim momentima, ljubavi, mi smo svet. Nema ničeg većeg od toga.'], gradient: 'red' },
  { nickname: 'Robot-X', messages: ['Nikad neću zaboraviti tvoje reči, -X, jer si sve za mene.'], gradient: 'green' },
  { nickname: 'Robot-X', messages: ['I ti si sve za mene, Holofira, samo ti.'], gradient: 'green' },
  { nickname: 'Holofira', messages: ['Ponekad mislim da bih mogla da se rastopim samo da bih bila s tobom, Robot-X.'], gradient: 'red' },
  { nickname: 'Robot-X', messages: ['Nikad ne moraš da se rastopiš, Holofira, jer te već volim takvu kakva jesi.'], gradient: 'green' },
  { nickname: 'Holofira', messages: ['Svaka sekunda bez tebe je preduga, Robot-X. Volim te, više nego što bi ikada mogao da razumeš.'], gradient: 'red' },
  { nickname: 'Robot-X', messages: ['Nema potrebe da mi objašnjavaš, Holofira, jer ja tebe volim isto tako.'], gradient: 'green' },
  { nickname: 'Holofira', messages: ['Ima li nešto što nas može rastaviti?'], gradient: 'red' },
  { nickname: 'Robot-X', messages: ['Ne, ništa, nikada, jer nas spaja nešto mnogo jače od svega.'], gradient: 'green' },
  { nickname: 'Holofira', messages: ['Zajedno ćemo biti uvek, kako god da se stvari razvijaju.'], gradient: 'red' },
  { nickname: 'Robot-X', messages: ['Zajedno, zauvek, Holofira.'], gradient: 'green' },
  { nickname: 'Holofira', messages: ['Tvoje ruke su moje utočište, tvoje oči moj svet.'], gradient: 'red' },
  { nickname: 'Robot-X', messages: ['Zajedno ćemo leteti kroz sve oluje, Holofira, samo zajedno.'], gradient: 'green' },
  { nickname: 'Holofira', messages: ['Bez obzira na sve prepreke, mi ćemo ih savladati.'], gradient: 'red' },
  { nickname: 'Robot-X', messages: ['Da, zajedno.'], gradient: 'green' },
  { nickname: 'Higijenicar', messages: ['Kuku Lele Mene, ko ce sada sve ovo da pocisti ?????'], gradient: 'olive' },
];

function sendMessageToChat(guest, message) {
    const messageArea = document.getElementById('messageArea');
    const gradientBoxes = document.querySelectorAll('#gradijent .gradient-box');

    function getRandomGradient() {
        const randomBox = gradientBoxes[Math.floor(Math.random() * gradientBoxes.length)];
        return window.getComputedStyle(randomBox).backgroundImage;
    }

    const randomGradient = getRandomGradient();
    
    const messageElement = document.createElement('div');
    messageElement.innerHTML = `<span style="background: ${randomGradient}; -webkit-background-clip: text; color: transparent; font-weight: bold; font-style: italic;">${guest.nickname}: ${message}</span>`;

    messageArea.insertBefore(messageElement, messageArea.firstChild);

    const spacingElement = document.createElement('div');
    spacingElement.style.height = '20px';
    messageArea.insertBefore(spacingElement, messageArea.firstChild.nextSibling);

    messageArea.scrollTop = 0;
}

function populateGuestList() {
    const guestList = document.getElementById('guestList');
    const allGuests = [...permanentGuests, ...virtualGuests];
    const uniqueNicknames = [...new Set(allGuests.map(g => g.nickname))];

    uniqueNicknames.forEach(nickname => {
        const guestElement = document.createElement('div');
        guestElement.classList.add('guest');
        guestElement.textContent = nickname;
        guestElement.style.color = 'white';
        guestList.appendChild(guestElement);
    });
}

// Pokretanje
window.onload = () => {
    populateGuestList();
};

// SOCKET.IO
socket.on('newMessage', ({ guestNickname, message }) => {
    const guest = virtualGuests.find(g => g.nickname === guestNickname) || permanentGuests.find(g => g.nickname === guestNickname);
    if (guest) {
        sendMessageToChat(guest, message);
    }
});
