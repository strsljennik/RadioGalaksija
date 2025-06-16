document.getElementById("ram").addEventListener("click", async () => {
  let panel = document.getElementById("popram");

  if (!panel) {
    panel = document.createElement("div");
    panel.id = "popram";
    panel.style.position = "absolute";
    panel.style.width = "200px";
    panel.style.height = "200px";
    panel.style.left = "0";
    panel.style.bottom = "0";
    panel.style.backgroundColor = "black";
    panel.style.border = "2px solid #0ff";
    panel.style.color = "#0ff";
    panel.style.fontFamily = "monospace";
    panel.style.padding = "10px";
    panel.style.cursor = "move";
    panel.style.userSelect = "none";
    panel.style.zIndex = "1000";
    document.body.appendChild(panel);

    // Drag funkcija
    let isDragging = false, startX, startY, origX, origY;
    panel.addEventListener("mousedown", (e) => {
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      origX = parseInt(panel.style.left);
      origY = parseInt(panel.style.bottom);
      e.preventDefault();
    });
    window.addEventListener("mousemove", (e) => {
      if (isDragging) {
        let dx = e.clientX - startX;
        let dy = startY - e.clientY; // bottom raste nagore
        panel.style.left = origX + dx + "px";
        panel.style.bottom = origY + dy + "px";
      }
    });
    window.addEventListener("mouseup", () => {
      isDragging = false;
    });
  }

  if (panel.style.display === "none" || panel.style.display === "") {
    panel.style.display = "block";

    // Uzmi podatke sa servera i prikazi
    try {
      let res = await fetch("/metrics");
      if (!res.ok) throw new Error("Fetch failed");
      let data = await res.json();

      let ramMB = (data.memoryUsage.rss / 1024 / 1024).toFixed(2);
      let heapUsedMB = (data.memoryUsage.heapUsed / 1024 / 1024).toFixed(2);
      let cpuUserMS = data.cpuUsage.user / 1000; // mikrosekunde u milisekunde
      let cpuSysMS = data.cpuUsage.system / 1000;

      panel.innerHTML =
        `<b>RAM (RSS):</b> ${ramMB} MB<br>` +
        `<b>Heap used:</b> ${heapUsedMB} MB<br>` +
        `<b>CPU User:</b> ${cpuUserMS} ms<br>` +
        `<b>CPU System:</b> ${cpuSysMS} ms<br>`;
    } catch (e) {
      panel.innerHTML = "Greška pri učitavanju podataka";
    }
  } else {
    panel.style.display = "none";
  }
});
