// STORAGE MANAGER
const storageKey = 'userSettings';

function saveToStorage(nickname, color, gradient) {
  const data = { nickname, color, gradient };
  localStorage.setItem(storageKey, JSON.stringify(data));
}

function loadFromStorage() {
  const data = localStorage.getItem(storageKey);
  return data ? JSON.parse(data) : null;
}

function applySettings(settings) {
  if (!settings) return;

  myNickname = settings.nickname || '';
  currentColor = settings.color || '';
  currentGradient = settings.gradient || '';

  const myDiv = document.getElementById(`guest-${myNickname}`);
  if (myDiv) {
    if (currentGradient) {
      myDiv.classList.add(currentGradient, 'use-gradient', 'gradient-user');
      myDiv.style.backgroundImage = getComputedStyle(document.querySelector(`.${currentGradient}`)).backgroundImage;
      myDiv.style.color = '';
    } else if (currentColor) {
      myDiv.style.color = currentColor;
      myDiv.classList.remove('use-gradient', 'gradient-user');
      myDiv.style.backgroundImage = '';
    }
  }
}

// Na pocetku stranice
document.addEventListener('DOMContentLoaded', () => {
  const settings = loadFromStorage();
  applySettings(settings);
});

// Kad korisnik menja boju ili gradijent, pozvati:
function updateStorage() {
  saveToStorage(myNickname, currentColor, currentGradient);
}

// Primer integracije sa event listenerima za color i gradient:
// Kada se boja menja:
document.getElementById('colorPicker').addEventListener('input', function() {
  currentColor = this.value;
  currentGradient = '';
  updateStorage();
  // ostali kod za update UI i socket emit
});

// Kada se gradijent menja:
function onGradientChange(newGradient) {
  currentGradient = newGradient;
  currentColor = '';
  updateStorage();
  // ostali kod za update UI i socket emit
}

// Kad se prijavi korisnik, update storage za novi nik:
function onUserLogin(newNickname) {
  myNickname = newNickname;
  updateStorage();
}
