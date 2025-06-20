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
  }`
};

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

nikBtn.addEventListener('click', () => {
  popnik.innerHTML = '';

  const btn = document.createElement('button');
  btn.textContent = 'rotateLetters';
  btn.style.margin = '5px';
  btn.style.padding = '5px 12px';
  btn.style.cursor = 'pointer';
  btn.onclick = () => {
    currentAnimation = 'rotateLetters';
    applyAnimationToNick(myNickname, 'rotateLetters', animationSpeed);
    socket.emit('animationChange', {
      nickname: myNickname,
      animation: 'rotateLetters',
      speed: animationSpeed
    });
    popnik.style.display = 'none';
  };
  popnik.appendChild(btn);

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
    userDiv.innerHTML = userDiv.textContent; // ukloni spanove
    popnik.style.display = 'none';
  };
  popnik.appendChild(stopBtn);

  popnik.style.display = 'block';
});
function applyAnimationToNick(nickname, animationName, speed = animationSpeed) {
  const userDiv = document.getElementById(`guest-${nickname}`);
  if (!userDiv) return;

  // Vrati originalni tekst bez animacije pre nove
  userDiv.style.animation = 'none';
  userDiv.innerHTML = userDiv.textContent || userDiv.innerText;

  const text = userDiv.textContent || userDiv.innerText;
  const computed = getComputedStyle(userDiv);
  const bgImage = computed.backgroundImage;
  const textColor = computed.color;

  userDiv.innerHTML = '';

  for (let i = 0; i < text.length; i++) {
    const span = document.createElement('span');
    span.textContent = text[i];
    span.classList.add(animationName === 'rotateLetters' ? 'rotate-letter' : animationName === 'glowBlink' ? 'glow-letter' : '');
    span.style.animationDuration = `${speed}s`;
    span.style.animationDelay = `${i * 0.1}s`;
    span.style.animationIterationCount = animationName === 'rotateLetters' ? '1' : 'infinite';

    if (bgImage && bgImage !== 'none') {
      span.style.backgroundImage = bgImage;
      span.style.backgroundClip = 'text';
      span.style.webkitBackgroundClip = 'text';
      span.style.webkitTextFillColor = 'transparent';
    } else {
      span.style.color = textColor;
    }

    // Antialiasing i bolje performanse
    span.style.webkitFontSmoothing = 'antialiased';
    span.style.MozOsxFontSmoothing = 'grayscale';
    span.style.backfaceVisibility = 'hidden';
    span.style.transformStyle = 'preserve-3d';

    userDiv.appendChild(span);
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
      setTimeout(tryApply, 100);
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
