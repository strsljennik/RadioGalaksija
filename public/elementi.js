document.addEventListener("DOMContentLoaded", () => {
    const chatButton = document.getElementById("chat");
    const chatContainer = document.getElementById("chatContainer");
    let isDraggable = false;
    let isResizable = false;
    let resizeDir = null; // 'right', 'bottom', 'left', 'top', 'bottom-right', etc.

    chatButton.addEventListener("click", () => {
        isDraggable = !isDraggable;
        isResizable = !isResizable;
        chatContainer.style.cursor = isDraggable ? "grab" : isResizable ? "default" : "default";

        if (isDraggable || isResizable) {
            chatContainer.addEventListener("mousedown", startAction);
        } else {
            chatContainer.removeEventListener("mousedown", startAction);
        }
    });

    function startAction(event) {
        if (isResizable && (resizeDir = getResizeDirection(event))) {
            startResize(event, resizeDir);
        } else if (isDraggable) {
            startDrag(event);
        }
    }

    function getResizeDirection(event) {
        const rect = chatContainer.getBoundingClientRect();
        const offset = 10; // Resize zone size
        const x = event.clientX;
        const y = event.clientY;
        let dir = "";

        if (x >= rect.right - offset && y >= rect.bottom - offset) dir = "bottom-right";
        else if (x <= rect.left + offset && y >= rect.bottom - offset) dir = "bottom-left";
        else if (x >= rect.right - offset && y <= rect.top + offset) dir = "top-right";
        else if (x <= rect.left + offset && y <= rect.top + offset) dir = "top-left";
        else if (x >= rect.right - offset) dir = "right";
        else if (x <= rect.left + offset) dir = "left";
        else if (y >= rect.bottom - offset) dir = "bottom";
        else if (y <= rect.top + offset) dir = "top";

        return dir || null;
    }

    chatContainer.addEventListener("mousemove", (event) => {
        if (!isResizable) return;
        const dir = getResizeDirection(event);
        let cursor = "default";
        switch (dir) {
            case "bottom-right":
            case "top-left":
                cursor = "nwse-resize";
                break;
            case "bottom-left":
            case "top-right":
                cursor = "nesw-resize";
                break;
            case "right":
            case "left":
                cursor = "ew-resize";
                break;
            case "top":
            case "bottom":
                cursor = "ns-resize";
                break;
        }
        chatContainer.style.cursor = cursor;
    });

    function startDrag(event) {
        const offsetX = event.clientX - chatContainer.offsetLeft;
        const offsetY = event.clientY - chatContainer.offsetTop;

        function move(event) {
            const x = event.clientX - offsetX;
            const y = event.clientY - offsetY;
            chatContainer.style.left = `${x}px`;
            chatContainer.style.top = `${y}px`;
            socket.emit("moveChatContainer", { x, y });
        }

        function stopDrag() {
            document.removeEventListener("mousemove", move);
            document.removeEventListener("mouseup", stopDrag);
        }

        document.addEventListener("mousemove", move);
        document.addEventListener("mouseup", stopDrag);
    }

    function startResize(event, direction) {
        const startX = event.clientX;
        const startY = event.clientY;
        const startWidth = chatContainer.offsetWidth;
        const startHeight = chatContainer.offsetHeight;
        const startLeft = chatContainer.offsetLeft;
        const startTop = chatContainer.offsetTop;

        function resize(event) {
            let newWidth = startWidth;
            let newHeight = startHeight;
            let newLeft = startLeft;
            let newTop = startTop;

            const dx = event.clientX - startX;
            const dy = event.clientY - startY;

            if (direction.includes("right")) {
                newWidth = startWidth + dx;
            }
            if (direction.includes("left")) {
                newWidth = startWidth - dx;
                newLeft = startLeft + dx;
            }
            if (direction.includes("bottom")) {
                newHeight = startHeight + dy;
            }
            if (direction.includes("top")) {
                newHeight = startHeight - dy;
                newTop = startTop + dy;
            }

            // Minimalne dimenzije
            if (newWidth < 100) {
                newWidth = 100;
                if (direction.includes("left")) newLeft = startLeft + (startWidth - 100);
            }
            if (newHeight < 100) {
                newHeight = 100;
                if (direction.includes("top")) newTop = startTop + (startHeight - 100);
            }

            chatContainer.style.width = `${newWidth}px`;
            chatContainer.style.height = `${newHeight}px`;
            chatContainer.style.left = `${newLeft}px`;
            chatContainer.style.top = `${newTop}px`;

            socket.emit("resizeChatContainer", { width: newWidth, height: newHeight, x: newLeft, y: newTop });
        }

        function stopResize() {
            document.removeEventListener("mousemove", resize);
            document.removeEventListener("mouseup", stopResize);
        }

        document.addEventListener("mousemove", resize);
        document.addEventListener("mouseup", stopResize);
    }

    // Prijem početnih podataka za poziciju i dimenzije od servera
    socket.on("initialChatContainerData", (data) => {
        if (data.x !== undefined && data.y !== undefined) {
            chatContainer.style.left = `${data.x}px`;
            chatContainer.style.top = `${data.y}px`;
        }
        if (data.width !== undefined && data.height !== undefined) {
            chatContainer.style.width = `${data.width}px`;
            chatContainer.style.height = `${data.height}px`;
        }
    });

    // Prijem update podataka (kad drugi korisnici pomeraju/resize)
    socket.on("updateChatContainer", (data) => {
        if (data.x !== undefined && data.y !== undefined) {
            chatContainer.style.left = `${data.x}px`;
            chatContainer.style.top = `${data.y}px`;
        }
        if (data.width !== undefined && data.height !== undefined) {
            chatContainer.style.width = `${data.width}px`;
            chatContainer.style.height = `${data.height}px`;
        }
    });

    // Traži početne podatke od servera odmah po konekciji
    socket.emit("requestInitialChatContainerData");
});
