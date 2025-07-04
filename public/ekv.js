window.addEventListener('load', () => {
  // 1. Ubaci stilove dinamički
  const style = document.createElement('style');
  style.textContent = `
    #equalizer {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 320px;
      background: rgba(0,0,0,0.8);
      color: white;
      font-family: Arial, sans-serif;
      padding: 10px;
      box-sizing: border-box;
      z-index: 10000;
      border-top-right-radius: 10px;
    }
    #equalizer h3 {
      margin: 0 0 10px 0;
      font-size: 18px;
      text-align: center;
    }
    .slider-container {
      display: flex;
      align-items: center;
      margin-bottom: 8px;
    }
    .slider-container label {
      width: 60px;
      font-size: 14px;
    }
    .slider-container input[type=range] {
      flex: 1;
      margin: 0 10px;
    }
    .gain-value {
      width: 40px;
      text-align: right;
      font-size: 14px;
    }
  `;
  document.head.appendChild(style);

  // 2. Kreiraj audio element i ubaci u body
  const audio = document.createElement('audio');
  audio.id = 'radioStream';
  audio.preload = 'auto';
  audio.autoplay = true;
  audio.controls = true;
  audio.src = "https://stream.zeno.fm/krdfduyswxhtv";
  document.body.appendChild(audio);

  // 3. Kreiraj div equalizera i ubaci u body
  const eqDiv = document.createElement('div');
  eqDiv.id = 'equalizer';

  const title = document.createElement('h3');
  title.textContent = 'Ekvilajzer';
  eqDiv.appendChild(title);

  // Frekvencijski pojasevi
  const bands = [
    { freq: 60, label: '60 Hz' },
    { freq: 170, label: '170 Hz' },
    { freq: 350, label: '350 Hz' },
    { freq: 1000, label: '1 kHz' },
    { freq: 3500, label: '3.5 kHz' },
    { freq: 10000, label: '10 kHz' }
  ];

  bands.forEach((band, i) => {
    const container = document.createElement('div');
    container.className = 'slider-container';
    container.dataset.band = i;

    const label = document.createElement('label');
    label.textContent = band.label;

    const input = document.createElement('input');
    input.type = 'range';
    input.min = -12;
    input.max = 12;
    input.step = 0.1;
    input.value = 0;

    const gainVal = document.createElement('span');
    gainVal.className = 'gain-value';
    gainVal.textContent = '0 dB';

    container.appendChild(label);
    container.appendChild(input);
    container.appendChild(gainVal);

    eqDiv.appendChild(container);
  });

  document.body.appendChild(eqDiv);

  // 4. Postavi AudioContext i filtere
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  const audioCtx = new AudioContext();
  const source = audioCtx.createMediaElementSource(audio);

  const filters = bands.map(({ freq }, i) => {
    const filter = audioCtx.createBiquadFilter();
    if(i === 0) filter.type = 'lowshelf';
    else if(i === bands.length - 1) filter.type = 'highshelf';
    else filter.type = 'peaking';
    filter.frequency.value = freq;
    filter.gain.value = 0;
    return filter;
  });

  source.connect(filters[0]);
  for(let i=0; i<filters.length-1; i++) {
    filters[i].connect(filters[i+1]);
  }
  filters[filters.length - 1].connect(audioCtx.destination);

  // 5. Aktiviraj AudioContext na klik zbog browser politika
  document.body.addEventListener('click', () => {
    if(audioCtx.state === 'suspended') {
      audioCtx.resume();
      console.log('AudioContext pokrenut');
    }
  });

  // 6. Poveži slider događaje sa gain-om filtera
  eqDiv.querySelectorAll('input[type=range]').forEach((slider) => {
    slider.addEventListener('input', () => {
      const bandIndex = parseInt(slider.parentElement.dataset.band);
      const gainValue = parseFloat(slider.value);
      filters[bandIndex].gain.value = gainValue;

      const gainDisplay = slider.parentElement.querySelector('.gain-value');
      gainDisplay.textContent = gainValue.toFixed(1) + ' dB';
    });
  });
});
