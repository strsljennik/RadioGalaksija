document.addEventListener('DOMContentLoaded', () => {
  const fonts = [
    'Arial', 'Verdana', 'Times New Roman', 'Courier New', 'Georgia', 'Trebuchet MS', 
    'Tahoma', 'Impact', 'Comic Sans MS', 'Lucida Console', 'Lucida Sans Unicode', 
    'Consolas', 'Palatino Linotype', 'Garamond', 'Bookman Old Style', 
    'Arial Black', 'MS Sans Serif', 'MS Serif', 'Helvetica', 'sans-serif', 
    'serif', 'monospace', 'cursive', 'fantasy'
  ];

  const fontButton = document.getElementById('font');
  let fontDiv;

  // Kreiraj div sa fontovima
  function createFontPicker() {
    fontDiv = document.createElement('div');
    fontDiv.style.position = 'absolute';
    fontDiv.style.top = '50px';
 fontDiv.style.bottom= '50px';
    fontDiv.style.left = '0px';
    fontDiv.style.backgroundColor = 'black';
    fontDiv.style.padding = '10px';
    fontDiv.style.display = 'none';
    fontDiv.style.zIndex = '1000';
    fontDiv.style.borderRadius = '10px';
    fontDiv.style.boxShadow = '0 0 15px #39FF14';
    fontDiv.style.transition = 'opacity 0.3s';
    
    // Dodaj auto scroll
    fontDiv.style.maxHeight = '700px'; // Veća visina tabele (800px)
    fontDiv.style.overflowY = 'auto';  // Omogućava vertikalni scroll

    // Dodaj gradijentni border
    fontDiv.style.border = '6px solid transparent';
    fontDiv.style.borderImage = 'linear-gradient(to right, skyblue, green, gray)'; 
    fontDiv.style.borderImageSlice = 1;

    // Dodaj fontove
    fonts.forEach(font => {
      const fontOption = document.createElement('div');
      fontOption.style.fontFamily = font;
      fontOption.style.color = '#39FF14';
      fontOption.style.padding = '5px';
      fontOption.style.cursor = 'pointer';
      fontOption.style.transition = 'background 0.2s';
      fontOption.textContent = font;

      fontOption.addEventListener('click', () => {
        document.body.style.fontFamily = font;
      });

      fontOption.addEventListener('mouseover', () => {
        fontOption.style.backgroundColor = '#39FF14';
        fontOption.style.color = 'black';
      });

      fontOption.addEventListener('mouseout', () => {
        fontOption.style.backgroundColor = 'transparent';
        fontOption.style.color = '#39FF14';
      });

      fontDiv.appendChild(fontOption);
    });

    document.body.appendChild(fontDiv);
  }

  // Klik za otvaranje i zatvaranje div-a
  fontButton.addEventListener('click', () => {
    if (fontDiv.style.display === 'none') {
      fontDiv.style.display = 'block';
    } else {
      fontDiv.style.display = 'none';
    }
  });

  createFontPicker();
});