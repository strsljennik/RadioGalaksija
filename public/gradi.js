document.addEventListener("DOMContentLoaded", () => {
  const gradiBtn = document.getElementById("gradi");
  const gradijentTabla = document.createElement("div");
  gradijentTabla.id = "gradijent";
  gradijentTabla.style.display = "none";
  document.body.appendChild(gradijentTabla);

  const elementi = [
    "chatContainer",
    "toolbar",
    "chatInput",
    "guestList",
    "openModal",
    "smilesBtn",
    "GBtn",
    "tube",
    "sound",
 
  
  ];

  const paket = ["openModal", "smilesBtn", "GBtn","tube", "sound"];

const neonBoje = [
  "red", "yellow", "lime", "white", "blue", "gray", "pink", "purple",
  "orange", "cyan", "magenta", "turquoise", "gold", "silver", "navy", "teal",
  "darkred",            // trula višnja
  "fuchsia",            // jarka roze-ljubičasta
  "orchid",             // nežno ljubičasta
  "hotpink",            // intenzivna roze
  "lightcoral",         // bledo crvena
  "plum"                // svetlo ljubičasta
];


  gradiBtn.addEventListener("click", () => {
    if (gradijentTabla.style.display === "none") {
      prikaziPocetnuListu();
      Object.assign(gradijentTabla.style, {
        position: "fixed", top: "60px", left: "20px",
        background: "#000", color: "white", padding: "20px",
        border: "2px solid #fff", borderRadius: "10px",
        boxShadow: "0 0 15px #fff", fontFamily: "Arial, sans-serif",
        width: "200px", height: "600px", overflowY: "auto",
        zIndex: "99999"
      });
      gradijentTabla.style.display = "block";
    } else {
      gradijentTabla.style.display = "none";
    }
  });

  function prikaziPocetnuListu() {
    gradijentTabla.innerHTML = `
      <h3 style='margin-bottom:10px;'>Izaberi element</h3>
      <ul id='listaElem' style='list-style:none;padding:0;margin:0;'></ul>
      <button id="resetujSve" style="margin-top:10px; padding:5px 10px; cursor:pointer;">Resetuj sve</button>
    `;
    const lista = gradijentTabla.querySelector("#listaElem");

    elementi.forEach(id => {
      const el = document.createElement("li");
      el.textContent = `#${id}`;
      Object.assign(el.style, {
        cursor: "pointer", padding: "8px 12px", marginBottom: "4px",
        borderBottom: "1px solid yellow", fontWeight: "bold", fontStyle: "italic"
      });
      el.addEventListener("mouseover", () => el.style.background = "rgba(255,255,0,0.1)");
      el.addEventListener("mouseout", () => el.style.background = "transparent");
      el.addEventListener("click", () => prikaziBoje(id));
      lista.appendChild(el);
    });

    document.getElementById("resetujSve").addEventListener("click", () => {
      elementi.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
          el.style.border = "";
          el.style.boxShadow = "";
          if (id === "guestList") {
            el.style.borderBottom = "";
            document.querySelectorAll('.guest').forEach(gost => gost.style.borderBottom = "");
            const styleTag = document.getElementById('guestList-scrollbar-style');
            if (styleTag) styleTag.remove();
          }
        }
        socket.emit("promeniGradijent", { id: id, type: "border", gradijent: "" });
      });
      prikaziPocetnuListu();
    });
  }

  function prikaziBoje(id) {
    gradijentTabla.innerHTML = `
      <h3 style='margin-bottom:10px;'>Izaberi boju za <span style='color:yellow;'>#${id}</span></h3>
    `;

    neonBoje.forEach(boja => {
      const dugme = document.createElement("button");
      dugme.textContent = boja;
      Object.assign(dugme.style, {
        background: boja, color: "black", margin: "5px",
        padding: "6px 10px", cursor: "pointer"
      });
      dugme.addEventListener("click", () => primeniBoju(id, boja));
      gradijentTabla.appendChild(dugme);
    });

    const defaultBtn = document.createElement("button");
    defaultBtn.textContent = "Default";
    Object.assign(defaultBtn.style, {
      marginTop: "15px", padding: "5px 10px", border: "1px solid yellow",
      backgroundColor: "black", color: "yellow", cursor: "pointer",
      borderRadius: "5px"
    });
    defaultBtn.addEventListener("click", () => {
      const el = document.getElementById(id);
      if (el) {
        el.style.border = "";
        el.style.boxShadow = "";
        if (id === "guestList") {
          el.style.borderBottom = "";
          document.querySelectorAll('.guest').forEach(gost => gost.style.borderBottom = "");
          const styleTag = document.getElementById('guestList-scrollbar-style');
          if (styleTag) styleTag.remove();
        }
      }
      socket.emit("promeniGradijent", { id: id, type: "border", gradijent: "" });
      prikaziPocetnuListu();
    });
    gradijentTabla.appendChild(defaultBtn);

    gradijentTabla.appendChild(createBackButton());
  }

  function createBackButton() {
    const btn = document.createElement("button");
    btn.textContent = "Nazad";
    Object.assign(btn.style, {
      marginTop: "15px", padding: "5px 10px", border: "1px solid yellow",
      backgroundColor: "black", color: "yellow", cursor: "pointer",
      borderRadius: "5px"
    });
    btn.addEventListener("click", () => prikaziPocetnuListu());
    return btn;
  }

  function primeniBoju(id, boja) {
    const targetIds = paket.includes(id) ? paket : [id];
    targetIds.forEach(eid => {
      const el = document.getElementById(eid);
      if (el) {
        el.style.border = `2px solid ${boja}`;
        el.style.boxShadow = `0 0 10px ${boja}`;
        if (eid === "guestList") {
          el.style.borderBottom = `10px solid ${boja}`;
          document.querySelectorAll('.guest').forEach(gost => {
            gost.style.borderBottom = `1px solid ${boja}`;
          });
          const styleId = 'guestList-scrollbar-style';
          let styleTag = document.getElementById(styleId);
          if (!styleTag) {
            styleTag = document.createElement('style');
            styleTag.id = styleId;
            document.head.appendChild(styleTag);
          }
          styleTag.textContent = `
            #guestList::-webkit-scrollbar-thumb {
              background: ${boja};
              border-radius: 5px;
            }
          `;
        }
      }
      socket.emit("promeniGradijent", { id: eid, type: "border", gradijent: boja });
    });
  }

  socket.on("promeniGradijent", (data) => {
    const el = document.getElementById(data.id);
    if (el) {
      el.style.border = `2px solid ${data.gradijent}`;
      el.style.boxShadow = `0 0 10px ${data.gradijent}`;
    }
  });

  socket.on("pocetnoStanje", (stanje) => {
    for (const id in stanje) {
      const el = document.getElementById(id);
      if (el) {
        el.style.border = `2px solid ${stanje[id].gradijent}`;
        el.style.boxShadow = `0 0 10px ${stanje[id].gradijent}`;
      }
    }
  });
});
