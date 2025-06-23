 const animations = {
  rotateLetters: `@keyframes rotateLetters {
    0% { transform: rotateY(0deg); }
    100% { transform: rotateY(360deg); }
  }
  .rotate-letter {
    display: inline-block;
    animation-name: rotateLetters;
    animation-timing-function: linear;
    animation-fill-mode: forwards;
  }`,

  glowBlink: `@keyframes glowBlink {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }
  .glow-letter {
    display: inline-block;
    animation-name: glowBlink;
    animation-timing-function: ease-in-out;
    animation-fill-mode: forwards;
    animation-iteration-count: infinite;
  }`,

  fadeInOut: `@keyframes fadeInOut {
    0%, 100% { opacity: 0; }
    50% { opacity: 1; }
  }
  .fade-letter {
    display: inline-block;
    animation-name: fadeInOut;
    animation-timing-function: ease-in-out;
    animation-fill-mode: forwards;
    animation-iteration-count: infinite;
  }`,

  bounce: `@keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-15px); }
  }
  .bounce-letter {
    display: inline-block;
    animation-name: bounce;
    animation-timing-function: ease-in-out;
    animation-fill-mode: forwards;
    animation-iteration-count: infinite;
  }`
};

let allUserAnimations = {};
let currentAnimation = null;
let animationSpeed = 2;

const nikBtn = document.getElementById('nik');
const popnik = document.createElement('div');
popnik.id = 'popnik';
popnik.style.position = 'absolute';
popnik.style.top = '50px';
popnik.style.left = '50px';
popnik.style.background = '#222';
popnik.style.padding = '15px';
popnik.style.border = '1px solid #fff';
popnik.style.zIndex = 1000;
popnik.style.display = 'none';
document.body.appendChild(popnik);

function injectAnimationStyles() {
  if (!document.getElementById('animation-styles')) {
    const style = document.createElement('style');
    style.id = 'animation-styles';
    style.textContent = Object.values(animations).join('\n');
    document.head.appendChild(style);
  }
}
injectAnimationStyles();

let popnikOpen = false;
let isAuthorized = false;  // FLAG za uspešan unos lozinke

nikBtn.addEventListener('click', () => {
  if (!isAuthorized) {
    const password = prompt('Unesi lozinku:');
    if (password === 'lsx') {
      isAuthorized = true;      // Zapamti da je korisnik uneo ispravnu lozinku
      popnik.style.display = 'block';  // otvori prozor
      popnikOpen = true;
    } else {
      alert('Pogrešna lozinka');
    }
  } else {
    // Ako je već autorizovan, samo toggle prozora
    if (!popnikOpen) {
      popnik.style.display = 'block';  // otvori prozor
      popnikOpen = true;
    } else {
      popnik.style.display = 'none';   // zatvori prozor
      popnikOpen = false;
    }
  }
});
  // rotateLetters dugme
  const btnRotate = document.createElement('button');
  btnRotate.textContent = 'rotateLetters';
  btnRotate.style.margin = '5px';
  btnRotate.style.padding = '5px 12px';
  btnRotate.style.cursor = 'pointer';
  btnRotate.onclick = () => {
    currentAnimation = 'rotateLetters';
    applyAnimationToNick(myNickname, 'rotateLetters', animationSpeed);
    socket.emit('animationChange', {
      nickname: myNickname,
      animation: 'rotateLetters',
      speed: animationSpeed
    });
    popnik.style.display = 'none';
  };
  popnik.appendChild(btnRotate);

  // glowBlink dugme
  const btnGlow = document.createElement('button');
  btnGlow.textContent = 'glowBlink';
  btnGlow.style.margin = '5px';
  btnGlow.style.padding = '5px 12px';
  btnGlow.style.cursor = 'pointer';
  btnGlow.onclick = () => {
    currentAnimation = 'glowBlink';
    applyAnimationToNick(myNickname, 'glowBlink', animationSpeed);
    socket.emit('animationChange', {
      nickname: myNickname,
      animation: 'glowBlink',
      speed: animationSpeed
    });
    popnik.style.display = 'none';
  };
  popnik.appendChild(btnGlow);

  // fadeInOut dugme
  const btnFade = document.createElement('button');
  btnFade.textContent = 'fadeInOut';
  btnFade.style.margin = '5px';
  btnFade.style.padding = '5px 12px';
  btnFade.style.cursor = 'pointer';
  btnFade.onclick = () => {
    currentAnimation = 'fadeInOut';
    applyAnimationToNick(myNickname, 'fadeInOut', animationSpeed);
    socket.emit('animationChange', {
      nickname: myNickname,
      animation: 'fadeInOut',
      speed: animationSpeed
    });
    popnik.style.display = 'none';
  };
  popnik.appendChild(btnFade);

  // bounce dugme
  const btnBounce = document.createElement('button');
  btnBounce.textContent = 'bounce';
  btnBounce.style.margin = '5px';
  btnBounce.style.padding = '5px 12px';
  btnBounce.style.cursor = 'pointer';
  btnBounce.onclick = () => {
    currentAnimation = 'bounce';
    applyAnimationToNick(myNickname, 'bounce', animationSpeed);
    socket.emit('animationChange', {
      nickname: myNickname,
      animation: 'bounce',
      speed: animationSpeed
    });
    popnik.style.display = 'none';
  };
  popnik.appendChild(btnBounce);

  // Slider za brzinu animacije
  const speedLabel = document.createElement('label');
  speedLabel.textContent = `Brzina animacije: ${animationSpeed}s`;
  speedLabel.style.display = 'block';
  speedLabel.style.color = '#fff';
  speedLabel.style.marginTop = '10px';

  const speedInput = document.createElement('input');
  speedInput.type = 'range';
  speedInput.min = 1;
  speedInput.max = 20;
  speedInput.step = 0.1;
  speedInput.value = animationSpeed;
  speedInput.style.width = '100%';

  speedInput.oninput = () => {
    animationSpeed = parseFloat(speedInput.value);
    speedLabel.textContent = `Brzina animacije: ${animationSpeed}s`;
    if (currentAnimation) {
      applyAnimationToNick(myNickname, currentAnimation, animationSpeed);
    }
  };

  popnik.appendChild(speedLabel);
  popnik.appendChild(speedInput);

  // Dugme za stop animacije
  const stopBtn = document.createElement('button');
  stopBtn.textContent = 'Stopuj animaciju';
  stopBtn.style.marginTop = '10px';
  stopBtn.style.padding = '5px 12px';
  stopBtn.style.cursor = 'pointer';
  stopBtn.onclick = () => {
    currentAnimation = null;
    const userDiv = document.getElementById(`guest-${myNickname}`);
    if (!userDiv) return;
    userDiv.style.animation = 'none';
    userDiv.innerHTML = userDiv.textContent;
    socket.emit('animationChange', {
      nickname: myNickname,
      animation: null,
      speed: animationSpeed
    });
    popnik.style.display = 'none';
  };
  popnik.appendChild(stopBtn);

function applyAnimationToNick(nickname, animationName, speed = animationSpeed) {
  const userDiv = document.getElementById(`guest-${nickname}`);
  if (!userDiv) return;

  // Vrati originalni tekst bez animacije pre nove
  userDiv.style.animation = 'none';
  userDiv.innerHTML = userDiv.textContent || userDiv.innerText;

  const text = userDiv.textContent || userDiv.innerText;

  userDiv.innerHTML = '';

  // Definiši znakove za koje ne želimo animaciju
  const problematicChars = [' ', '*', '(', ')', '-', '_', '[', ']', '{', '}', '^', '$', '#', '@', '!', '+', '=', '~', '`', '|', '\\', '/', '<', '>', ',', '.', '?', ':', ';', '"', "'"];

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (problematicChars.includes(char)) {
      // Ubaci običan tekst bez animacije
      userDiv.appendChild(document.createTextNode(char));
    } else {
      // Ubaci span sa animacijom
      const span = document.createElement('span');
      span.textContent = char;

      // Dodaj klasu u zavisnosti od animacije
      if (animationName === 'rotateLetters') {
        span.classList.add('rotate-letter');
        span.style.animationIterationCount = '1';
      } else if (animationName === 'glowBlink') {
        span.classList.add('glow-letter');
        span.style.animationIterationCount = 'infinite';
      } else if (animationName === 'fadeInOut') {
        span.classList.add('fade-letter');
        span.style.animationIterationCount = 'infinite';
      } else if (animationName === 'bounce') {
        span.classList.add('bounce-letter');
        span.style.animationIterationCount = 'infinite';
      } else {
        // fallback bez klase i animacije
        span.style.animationIterationCount = 'infinite';
      }

      span.style.animationDuration = `${speed}s`;
      span.style.animationDelay = `${i * 0.1}s`;

      span.style.webkitFontSmoothing = 'antialiased';
      span.style.MozOsxFontSmoothing = 'grayscale';
      span.style.backfaceVisibility = 'hidden';
      span.style.transformStyle = 'preserve-3d';

      userDiv.appendChild(span);
    }
  }

  if (animationName === 'rotateLetters') {
    let completedSpans = 0;
    const spans = userDiv.querySelectorAll('.rotate-letter');
    spans.forEach(span => {
      span.addEventListener('animationend', () => {
        completedSpans++;
        if (completedSpans === spans.length) {
          setTimeout(() => {
            if (currentAnimation === 'rotateLetters') {
              applyAnimationToNick(nickname, animationName, speed);
            }
          }, 15000);
        }
      });
    });
  }
}

function applyAnimationToNickWhenReady(nickname, animation, speed) {
  const tryApply = () => {
    const userDiv = document.getElementById(`guest-${nickname}`);
    if (userDiv) {
      applyAnimationToNick(nickname, animation, speed);
    } else {
      setTimeout(tryApply, 500);
    }
  };
  tryApply();
}
socket.on('animationChange', data => {
  currentAnimation = data.animation;
  animationSpeed = data.speed || 2;
  applyAnimationToNickWhenReady(data.nickname, data.animation, animationSpeed);
});

socket.on('currentAnimations', (allAnimations) => {
  for (const [nickname, { animation, speed }] of Object.entries(allAnimations)) {
    applyAnimationToNickWhenReady(nickname, animation, speed);
  }
});
