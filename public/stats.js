document.getElementById("ram").addEventListener("click", async () => {
    let panel = document.getElementById("cpuram");
    
    if (panel) {
        // Ako panel postoji, ukloni ga (zatvori)
        panel.remove();
        return;
    }

    // Ako ne postoji, kreiraj panel i prikaži podatke
    panel = document.createElement("div");
    panel.id = "cpuram";
    panel.style.position = "absolute";
    panel.style.left = "0px";
    panel.style.bottom = "0px";
    panel.style.width = "200px";
    panel.style.height = "200px";
    panel.style.backgroundColor = "black";
    panel.style.border = "2px solid white";
    panel.style.boxShadow = "0 0 10px white";
    panel.style.color = "white";
    panel.style.padding = "10px";
    panel.style.fontFamily = "monospace";
    panel.style.cursor = "move";
    panel.style.userSelect = "none";
    panel.innerText = "Loading...";

    document.body.appendChild(panel);

    makeDraggable(panel);

    const res = await fetch("/stats");
    const data = await res.json();
    panel.innerText = `RAM: ${data.ram} MB\nCPU: ${data.cpu}%`;
});

// Drag funkcija ista kao pre
function makeDraggable(el) {
    let isDown = false, offset = [0, 0];

    el.addEventListener("mousedown", (e) => {
        isDown = true;
        offset = [
            el.offsetLeft - e.clientX,
            el.offsetTop - e.clientY
        ];
    }, true);

    document.addEventListener("mouseup", () => { isDown = false; }, true);

    document.addEventListener("mousemove", (e) => {
        e.preventDefault();
        if (isDown) {
            el.style.left = (e.clientX + offset[0]) + 'px';
            el.style.top = (e.clientY + offset[1]) + 'px';
            el.style.bottom = 'auto';
        }
    }, true);
}
