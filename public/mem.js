// Otvori/zatvori prozor s id="sucur" na klik dugmeta id="mem"
document.getElementById('mem').addEventListener('click', () => {
  let sucur = document.getElementById('sucur');
  if (!sucur) {
    // Napravi prozor
    sucur = document.createElement('div');
    sucur.id = 'sucur';
    sucur.style.position = 'fixed';
    sucur.style.top = '50px';
    sucur.style.right = '50px';
    sucur.style.padding = '20px';
    sucur.style.background = '#f0f0f0';
    sucur.style.border = '1px solid #aaa';
    sucur.style.zIndex = '9999';
    sucur.style.display = 'block';

    // Napravi dugme ČUVAJ
    const her = document.createElement('button');
    her.id = 'her';
    her.textContent = 'ČUVAJ';
    sucur.appendChild(her);

    // Napravi dugme UČITAJ
    const gras = document.createElement('button');
    gras.id = 'gras';
    gras.textContent = 'UČITAJ';
    gras.style.marginLeft = '10px';
    sucur.appendChild(gras);

    // Napravi file input
    const fileLoader = document.createElement('input');
    fileLoader.type = 'file';
    fileLoader.id = 'fileInput';
    fileLoader.style.display = 'none';
    sucur.appendChild(fileLoader);

    document.body.appendChild(sucur);


    function dodajSliku() {
  const url = prompt("Unesi URL slike:");
  if (!url) return;
  const img = document.createElement('img');
  img.src = url;
  img.id = 'img-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
  img.style.position = 'absolute';
  img.style.top = '10px';
  img.style.left = '10px';
  img.style.width = '150px';
  img.style.height = '150px';
  img.style.zIndex = '1600';
  img.style.cursor = 'move';
  img.style.userSelect = 'none';
  img.addEventListener('contextmenu', e => {
    e.preventDefault();
    if (confirm('Da li želite da izbrišete ovu sliku?')) {
      img.remove();
      const index = allDraggables.indexOf(`#${img.id}`);
      if (index !== -1) allDraggables.splice(index, 1);
    }
  });
  document.body.appendChild(img);
  allDraggables.push(`#${img.id}`);
  setupInteract(img);
}
document.getElementById('chatsl').onclick = dodajSliku;

// EDIT MOD 
let editMode = false;

function setupInteract(el) {
  if (!authorizedUsers.has(currentUser)) return;

  interact(el).draggable({
    modifiers: [interact.modifiers.restrict({ restriction: 'body', endOnly: true })],
    listeners: {
      move(event) {
        const target = event.target;
        const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
        const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
        target.style.transform = `translate(${x}px, ${y}px)`;
        target.setAttribute('data-x', x);
        target.setAttribute('data-y', y);
      }
    }
  });

  interact(el).resizable({
    edges: { left: true, right: true, top: true, bottom: true },
    listeners: {
      move(event) {
        let x = parseFloat(event.target.getAttribute('data-x')) || 0;
        let y = parseFloat(event.target.getAttribute('data-y')) || 0;
        event.target.style.width = event.rect.width + 'px';
        event.target.style.height = event.rect.height + 'px';
        x += event.deltaRect.left;
        y += event.deltaRect.top;
        event.target.style.transform = `translate(${x}px, ${y}px)`;
        event.target.setAttribute('data-x', x);
        event.target.setAttribute('data-y', y);
      }
    }
  });
}


    // Event za čuvanje
    her.addEventListener('click', () => {
      const elements = Array.from(document.querySelectorAll('.element')).map(el => ({
        id: el.id,
        top: el.style.top || el.offsetTop + 'px',
        left: el.style.left || el.offsetLeft + 'px',
        width: el.style.width || el.offsetWidth + 'px',
        height: el.style.height || el.offsetHeight + 'px'
      }));

 const images = Array.from(document.querySelectorAll('img[id^="img-"]')).map(img => {
  const rect = img.getBoundingClientRect();
  return {
    id: img.id,
    src: img.src,
    top: rect.top + window.scrollY + 'px',
    left: rect.left + window.scrollX + 'px',
    width: rect.width + 'px',
    height: rect.height + 'px'
  };
});
const animatedTexts = Array.from(document.querySelectorAll('.text-display')).map(el => {
  const style = getComputedStyle(el);
  return {
    id: el.id || '', // ako ima id
    text: el.innerText,
    font: style.fontFamily,
    fontSize: style.fontSize,
    animation: style.animationName,
    speed: parseFloat(style.animationDuration),
    color: style.color,
    gradient: style.backgroundImage !== 'none' ? style.backgroundImage : null,
    top: style.top || el.style.top || el.offsetTop + 'px',
    left: style.left || el.style.left || el.offsetLeft + 'px'
  };
});
const background = document.body.style.backgroundImage || '';
   const data = { elements, images, animatedTexts, background };
   const json = JSON.stringify(data, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = 'layout.json';
      a.click();
      URL.revokeObjectURL(url);
    });

    // Event za otvaranje file dijaloga
    gras.addEventListener('click', () => fileLoader.click());

    // Event za učitavanje JSON-a
    fileLoader.addEventListener('change', e => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = ev => {
        try {
          const data = JSON.parse(ev.target.result);

     data.elements.forEach(el => {
            const domEl = document.getElementById(el.id);
            if (!domEl) return;
            domEl.style.position = 'absolute';
            domEl.style.top = el.top;
            domEl.style.left = el.left;
            domEl.style.width = el.width;
            domEl.style.height = el.height;
          });

if (data.animatedTexts) {
  data.animatedTexts.forEach(txt => {
    const el = document.createElement('div');
    el.classList.add('text-display');
    el.innerText = txt.text;
    el.style.position = 'absolute';
    el.style.top = txt.top;
    el.style.left = txt.left;
    el.style.fontFamily = txt.font;
    el.style.fontSize = txt.fontSize;
    el.style.animation = `${txt.animation} ${txt.speed}s ease infinite`;

    if (txt.gradient) {
      el.style.backgroundImage = txt.gradient;
      el.style.webkitBackgroundClip = "text";
      el.style.webkitTextFillColor = "transparent";
    } else {
      el.style.color = txt.color;
    }

    document.body.appendChild(el);
  });
}
if (data.background) {
  document.body.style.backgroundImage = data.background;
}

        data.images.forEach(imgData => {
            let img = document.getElementById(imgData.id);
            if (!img) {
              img = document.createElement('img');
              img.id = imgData.id;
              img.src = imgData.src;
              img.style.position = 'absolute';
              document.body.appendChild(img);
            }
            img.src = imgData.src;
            img.style.top = imgData.top;
            img.style.left = imgData.left;
            img.style.width = imgData.width;
            img.style.height = imgData.height;
            img.style.position = 'absolute';
          });
socket.emit('full-layout-load', data);
        } catch {
          alert('Pogrešan JSON.');
        }
      };
      reader.readAsText(file);
  });
  } else {
    // Ako postoji, zatvori/ukloni
    sucur.remove();
  }
});
socket.on('full-layout-load', data => {
  setTimeout(() => {
    if (data.elements) {
      data.elements.forEach(el => {
        const domEl = document.getElementById(el.id);
        if (!domEl) return;
        domEl.style.position = 'absolute';
        domEl.style.top = el.top;
        domEl.style.left = el.left;
        domEl.style.width = el.width;
        domEl.style.height = el.height;
      });
    }

    if (data.animatedTexts) {
      data.animatedTexts.forEach(txt => {
        const el = document.createElement('div');
        el.classList.add('text-display');
        el.innerText = txt.text;
        el.style.position = 'absolute';
        el.style.top = txt.top;
        el.style.left = txt.left;
        el.style.fontFamily = txt.font;
        el.style.fontSize = txt.fontSize;
        el.style.animation = `${txt.animation} ${txt.speed}s ease infinite`;

        if (txt.gradient) {
          el.style.backgroundImage = txt.gradient;
          el.style.webkitBackgroundClip = "text";
          el.style.webkitTextFillColor = "transparent";
        } else {
          el.style.color = txt.color;
        }

        document.body.appendChild(el);
      });
    }

    if (data.background) {
      document.body.style.backgroundImage = data.background;
    }

    if (data.images) {
      data.images.forEach(imgData => {
        let img = document.getElementById(imgData.id);
        if (!img) {
          img = document.createElement('img');
          img.id = imgData.id;
          img.src = imgData.src;
          img.style.position = 'absolute';
          document.body.appendChild(img);
        }
        img.src = imgData.src;
        img.style.top = imgData.top;
        img.style.left = imgData.left;
        img.style.width = imgData.width;
        img.style.height = imgData.height;
      });
    }
  }, 5000);
});

document.getElementById('pi').addEventListener('click', () => {
socket.emit('full-layout-reset');

  document.body.style.backgroundImage = '';
  document.querySelectorAll('img[id^="img-"]').forEach(img => img.remove());
document.querySelectorAll('.text-display').forEach(el => el.remove());
});
socket.on('full-layout-reset', () => {
  setTimeout(() => {
    document.body.style.backgroundImage = '';
    document.querySelectorAll('img[id^="img-"]').forEach(img => img.remove());
    document.querySelectorAll('.text-display').forEach(el => el.remove());
  }, 5000);
});
