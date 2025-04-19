document.addEventListener("DOMContentLoaded", () => {
  const gradiBtn = document.getElementById("gradi");

  // Kreiraj tablu
  const gradijentTabla = document.createElement("div");
  gradijentTabla.id = "gradijent";
  gradijentTabla.style.display = "none";
  document.body.appendChild(gradijentTabla);

  // Elementi koje prikazujemo
  const elementi = [
    "gradijent", // i samu tablu dodajemo kao opciju
    "authContainer",
    "chatContainer",
    "toolbar",
    "messageArea",
    "chatInput",
    "guestList",
    "openModal",
    "smilesBtn",
    "GBtn",
    "gostimodal",
    "functionModal",
    "uuidModal"
  ];

  // Klik na dugme
  gradiBtn.addEventListener("click", () => {
    if (gradijentTabla.style.display === "none") {
      gradijentTabla.innerHTML = "<h3 style='margin-bottom:10px;'>Izaberi element</h3><ul id='listaElem' style='list-style:none;padding:0;margin:0;'></ul>";

      const lista = gradijentTabla.querySelector("#listaElem");
      elementi.forEach(id => {
        const el = document.createElement("li");
        el.textContent = `#${id}`;
        el.style.cursor = "pointer";
        el.style.padding = "8px 12px";
        el.style.marginBottom = "4px";
        el.style.borderBottom = "1px solid yellow";
        el.style.fontWeight = "bold";
        el.style.fontStyle = "italic";
        el.style.transition = "background 0.2s";
        el.addEventListener("mouseover", () => el.style.background = "rgba(255,255,0,0.1)");
        el.addEventListener("mouseout", () => el.style.background = "transparent");
        el.addEventListener("click", () => prikaziOpcijeZaGradijent(id));
        lista.appendChild(el);
      });

      // Stilizacija table
      Object.assign(gradijentTabla.style, {
        position: "fixed",
        top: "60px",
        left: "20px",
        background: "linear-gradient(to right, black, yellow)",
        color: "white",
        padding: "20px",
        border: "2px solid yellow",
        borderRadius: "10px",
        boxShadow: "0 0 15px yellow",
        fontFamily: "Arial, sans-serif",
        maxWidth: "300px",
        zIndex: "99999"
      });

      gradijentTabla.style.display = "block";
    } else {
      gradijentTabla.style.display = "none";
    }
  });

  // Funkcija za prikazivanje opcija za gradijent
  function prikaziOpcijeZaGradijent(id) {
    gradijentTabla.innerHTML = `
      <h3 style="margin-bottom:10px;">Gradijent za: <span style="color:yellow;">#${id}</span></h3>
      <h4>Odaberi opciju za gradijent:</h4>
      <button class="gradijentOption" data-type="border" style="margin-bottom: 10px;">Border Gradijent</button>
      <button class="gradijentOption" data-type="text">Text Gradijent</button>
      <button id="nazad" style="
        margin-top: 15px;
        padding: 5px 10px;
        border: 1px solid yellow;
        background-color: black;
        color: yellow;
        cursor: pointer;
        border-radius: 5px;
      ">Nazad</button>
    `;

    // Dodajemo event listener za nazad dugme
    document.getElementById("nazad").addEventListener("click", () => {
      gradiBtn.click(); // ponovo otvori listu
    });

    // Dodajemo event listener za opcije gradijenta
    document.querySelectorAll(".gradijentOption").forEach(button => {
      button.addEventListener("click", (e) => {
        const type = e.target.getAttribute("data-type");
        prikaziListaGradijenata(type, id);
      });
    });
  }

  // Prikazivanje lista gradijenata
  function prikaziListaGradijenata(type, id) {
    const gradijentLista = document.createElement("ul");
    gradijentLista.style.listStyle = "none";
    gradijentLista.style.padding = "0";

    const gradijenti = type === "border" ? borderGradijenti : textGradijenti;

    gradijenti.forEach((gradijent, index) => {
      const gradijentItem = document.createElement("li");
      gradijentItem.textContent = `Gradijent ${index + 1}`;
      gradijentItem.style.cursor = "pointer";
      gradijentItem.style.padding = "8px";
      gradijentItem.style.marginBottom = "4px";
      gradijentItem.style.borderBottom = "1px solid yellow";
      gradijentItem.style.fontWeight = "bold";
      gradijentItem.style.fontStyle = "italic";
      gradijentItem.addEventListener("click", () => {
        primeniGradijent(type, gradijent, id);
      });
      gradijentLista.appendChild(gradijentItem);
    });

    gradijentTabla.innerHTML = `<h3>Odaberi gradijent za ${type} #${id}</h3>`;
    gradijentTabla.appendChild(gradijentLista);
    gradijentTabla.appendChild(createBackButton());
  }

  // Kreiraj dugme za nazad
  function createBackButton() {
    const backButton = document.createElement("button");
    backButton.textContent = "Nazad";
    backButton.style.marginTop = "15px";
    backButton.style.padding = "5px 10px";
    backButton.style.border = "1px solid yellow";
    backButton.style.backgroundColor = "black";
    backButton.style.color = "yellow";
    backButton.style.cursor = "pointer";
    backButton.style.borderRadius = "5px";
    backButton.addEventListener("click", () => {
      gradiBtn.click();
    });
    return backButton;
  }

  // Funkcija za primenu gradijenta
  function primeniGradijent(type, gradijent, id) {
    const element = document.querySelector(`#${id}`);
    if (type === "border") {
      element.style.borderImage = `${gradijent} 1`;
    } else if (type === "text") {
      element.style.background = gradijent;
      element.style.webkitBackgroundClip = "text";
      element.style.color = "transparent";
    }
  }

  // Primer gradijenata
  const borderGradijenti = [
    "linear-gradient(135deg, red, yellow)",
    "linear-gradient(25deg, blue, green)",
    "linear-gradient(45deg, purple, orange)",
    "linear-gradient(38deg, pink, cyan)",
    "linear-gradient(115deg, violet, indigo, blue)",
    "linear-gradient(64deg, lime, pink)",
    "linear-gradient(82deg, red, blue, green)",
    "linear-gradient(36deg, purple, yellow, teal)",
    "linear-gradient(15deg, orange, red, purple, blue)",
    "linear-gradient(79deg, gold, silver, bronze)"
  ];

  const textGradijenti = [
    "linear-gradient(135deg, red, yellow)",
    "linear-gradient(25deg, blue, green)",
    "linear-gradient(45deg, purple, orange)",
    "linear-gradient(38deg, pink, cyan)",
    "linear-gradient(115deg, violet, indigo, blue)",
    "linear-gradient(64deg, lime, pink)",
    "linear-gradient(82deg, red, blue, green)",
    "linear-gradient(36deg, purple, yellow, teal)",
    "linear-gradient(15deg, orange, red, purple, blue)",
    "linear-gradient(79deg, gold, silver, bronze)"
  ];
});
