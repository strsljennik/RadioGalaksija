document.addEventListener('DOMContentLoaded', () => {
  const audio = document.getElementById('radioStream');
  if (!audio) {
    console.error('Audio element sa id="radioStream" nije pronađen');
    return;
  }

  // Kreiraj AudioContext i source node za audio element
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const sourceNode = audioCtx.createMediaElementSource(audio);

  // Frekvencijski pojasevi ekvilajzera
  const bands = [
    { freq: 60, label: 'Bas (60 Hz)' },
    { freq: 170, label: 'Donji srednji tonovi (170 Hz)' },
    { freq: 350, label: 'Srednji tonovi (350 Hz)' },
    { freq: 1000, label: 'Viši srednji tonovi (1 kHz)' },
    { freq: 3500, label: 'Visoki tonovi (3.5 kHz)' },
    { freq: 10000, label: 'Jasnoća (10 kHz)' }
  ];

  // Kreiraj filtere
  const filters = bands.map(band => {
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'peaking';
    filter.frequency.value = band.freq;
    filter.Q.value = 1;
    filter.gain.value = 0; // početni gain 0 dB
    return filter;
  });

  // Poveži filtere u lanac
  for (let i = 0; i < filters.length - 1; i++) {
    filters[i].connect(filters[i + 1]);
  }

  // Poveži izvor -> prvi filter
  sourceNode.connect(filters[0]);

  // Analyser node za vizualizaciju spektra
  const analyser = audioCtx.createAnalyser();
  analyser.fftSize = 256;
  filters[filters.length - 1].connect(analyser);

  // Analyser -> output
  analyser.connect(audioCtx.destination);

  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  // Kreiraj container za ekvilajzer i vizualizaciju
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '0';
  container.style.bottom = '0';
  container.style.width = '360px';
  container.style.backgroundColor = 'rgba(0, 0, 0, 0.85)';
  container.style.color = '#fff';
  container.style.fontFamily = 'Arial, sans-serif';
  container.style.padding = '12px';
  container.style.zIndex = '99999';
  container.style.userSelect = 'none';
  container.style.borderTopRightRadius = '12px';
  container.style.boxShadow = '0 0 12px rgba(0,0,0,0.7)';
  document.body.appendChild(container);

  // Tabla sa sliderima
  const eqTable = document.createElement('div');
  eqTable.style.display = 'flex';
  eqTable.style.justifyContent = 'space-between';
  eqTable.style.marginBottom = '12px';
  container.appendChild(eqTable);

  // Kreiraj slider za svaki band
  bands.forEach((band, i) => {
    const wrapper = document.createElement('div');
    wrapper.style.flex = '1';
    wrapper.style.margin = '0 6px';
    wrapper.style.textAlign = 'center';

    const label = document.createElement('div');
    label.textContent = band.label;
    label.style.fontSize = '12px';
    label.style.marginBottom = '6px';

    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = '-40';
    slider.max = '20';
    slider.step = '0.1';
    slider.value = '0';
    slider.style.width = '100%';
    slider.style.cursor = 'pointer';

    const gainVal = document.createElement('div');
    gainVal.textContent = '0 dB';
    gainVal.style.marginTop = '4px';
    gainVal.style.fontSize = '11px';

    slider.addEventListener('input', () => {
      const val = parseFloat(slider.value);
      filters[i].gain.value = val;
      gainVal.textContent = val.toFixed(1) + ' dB';
    });

    wrapper.appendChild(label);
    wrapper.appendChild(slider);
    wrapper.appendChild(gainVal);

    eqTable.appendChild(wrapper);
  });

  // Canvas za vizualizaciju
  const canvas = document.createElement('canvas');
  canvas.width = 340;
  canvas.height = 100;
  canvas.style.display = 'block';
  canvas.style.margin = '0 auto';
  canvas.style.backgroundColor = 'rgba(20,20,20,0.85)';
  canvas.style.borderRadius = '8px';
  container.appendChild(canvas);

  const ctx = canvas.getContext('2d');

  function drawSpectrum() {
    requestAnimationFrame(drawSpectrum);
    analyser.getByteFrequencyData(dataArray);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const barWidth = (canvas.width / bufferLength) * 2.5;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      const barHeight = dataArray[i];
      const r = barHeight + 50;
      const g = 250 * (i / bufferLength);
      const b = 50;

      ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.fillRect(x, canvas.height - barHeight / 2, barWidth, barHeight / 2);

      x += barWidth + 1;
    }
  }

  // Pokreni vizualizaciju
  drawSpectrum();

  // Zbog autoplay pravila, audioCtx mora biti aktiviran klikom korisnika
  // Pa dodaj ovo na dugme ili neki klik da se audioCtx "pokrene"
  function resumeAudioContext() {
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  // Pretpostavljam da imaš dugme sa id="sound" za play/stop
  const btn = document.getElementById('sound');
  if (btn) {
    btn.addEventListener('click', () => {
      resumeAudioContext();
    });
  } else {
    // Ako nema dugmeta, možeš pozvati ručno npr:
    // window.addEventListener('click', resumeAudioContext, { once: true });
  }
});
