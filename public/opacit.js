const dugme = document.getElementById('prozirnost');
const chatContainer = document.getElementById('chatContainer');
const toolbar = document.getElementById('toolbar');
const guestList = document.getElementById('guestList');
let slider = null;

dugme.addEventListener('click', () => {
  if (slider) {
    slider.remove();
    slider = null;
  } else {
    slider = document.createElement('input');
    slider.type = 'range';
    slider.min = '1';
    slider.max = '100';
    slider.value = '100';

    slider.style.position = 'fixed';
    slider.style.top = '0';
    slider.style.right = '0';
    slider.style.width = '400px';      // veća širina
    slider.style.height = '50px';    // veća visina
    slider.style.transform = 'rotate(180deg)';
    slider.style.zIndex = '9999';
    slider.style.background = 'transparent';
    slider.style.cursor = 'pointer';

    // Dodaj i dodatne stilove za bolji izgled
    slider.style.borderRadius = '10px';
    slider.style.boxShadow = '0 0 5px rgba(0,0,0,0.3)';

    document.body.appendChild(slider);

    slider.addEventListener('input', () => {
      const alfa = slider.value / 100;
      chatContainer.style.backgroundColor = `rgba(0, 0, 0, ${alfa})`;
      toolbar.style.backgroundColor = `rgba(0, 0, 0, ${alfa})`;
      guestList.style.backgroundColor = `rgba(0, 0, 0, ${alfa})`;
      socket.emit('prozirnost', alfa);
    });
  }
});

socket.on('prozirnost', alfa => {
  chatContainer.style.backgroundColor = `rgba(0, 0, 0, ${alfa})`;
  toolbar.style.backgroundColor = `rgba(0, 0, 0, ${alfa})`;
  guestList.style.backgroundColor = `rgba(0, 0, 0, ${alfa})`;
  if (slider) slider.value = alfa * 100;
});
