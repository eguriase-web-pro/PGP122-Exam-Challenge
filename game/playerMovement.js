const PNGPDMovement = {

player: null,

x: 570,
y: 310,

speed: 4,

keys: {
    up: false,
    down: false,
    left: false,
    right: false
},

init() {

    this.player = document.getElementById("playerCharacter");

    if (!this.player) return;

    this.createControls();
    this.setupKeyboard();
    this.loop();

},

setupKeyboard() {

    document.addEventListener("keydown", (e) => {

        const key = e.key.toLowerCase();

        if (key === "arrowup" || key === "w")
            this.keys.up = true;

        if (key === "arrowdown" || key === "s")
            this.keys.down = true;

        if (key === "arrowleft" || key === "a")
            this.keys.left = true;

        if (key === "arrowright" || key === "d")
            this.keys.right = true;

    });

    document.addEventListener("keyup", (e) => {

        const key = e.key.toLowerCase();

        if (key === "arrowup" || key === "w")
            this.keys.up = false;

        if (key === "arrowdown" || key === "s")
            this.keys.down = false;

        if (key === "arrowleft" || key === "a")
            this.keys.left = false;

        if (key === "arrowright" || key === "d")
            this.keys.right = false;

    });

},

createControls() {

    document.getElementById("mobileMovementControls")?.remove();

    document.getElementById("pngpdMovementStyle")?.remove();

    const controls = document.createElement("div");

    controls.id = "mobileMovementControls";

    controls.innerHTML = `
        <button class="move-btn" data-direction="up">▲</button>

        <div class="move-middle">
            <button class="move-btn" data-direction="left">◀</button>
            <button class="move-btn" data-direction="down">▼</button>
            <button class="move-btn" data-direction="right">▶</button>
        </div>
    `;

    document.body.appendChild(controls);

    const style = document.createElement("style");

    style.id = "pngpdMovementStyle";

    style.textContent = `
        #mobileMovementControls {
            position: fixed;
            left: 12px;
            bottom: 12px;
            z-index: 500;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 5px;
            user-select: none;
            touch-action: none;
        }

        .move-middle {
            display: flex;
            align-items: center;
            gap: 5px;
        }

        .move-btn {
            width: 43px;
            height: 43px;
            border-radius: 12px;
            border: 1px solid rgba(255,255,255,.2);
            background: rgba(8,24,38,.9);
            color: #d8fff4;
            font-size: 17px;
            font-weight: 900;
            touch-action: none;
        }

        .move-btn:active {
            background: #00d49b;
            color: #00150f;
        }

        @media (min-width: 801px) {
            #mobileMovementControls {
                left: 20px;
                bottom: 20px;
            }
        }

        @media (max-width: 600px) {
            #mobileMovementControls {
                left: 8px;
                bottom: 8px;
            }

            .move-btn {
                width: 38px;
                height: 38px;
            }
        }
    `;

    document.head.appendChild(style);

    controls.querySelectorAll(".move-btn").forEach(button => {

        const direction = button.dataset.direction;

        const start = (e) => {
            e.preventDefault();
            this.keys[direction] = true;
        };

        const stop = (e) => {
            e.preventDefault();
            this.keys[direction] = false;
        };

        button.addEventListener("touchstart", start, { passive: false });
        button.addEventListener("touchend", stop, { passive: false });
        button.addEventListener("touchcancel", stop, { passive: false });

        button.addEventListener("mousedown", start);
        button.addEventListener("mouseup", stop);
        button.addEventListener("mouseleave", stop);

    });

},

loop() {

    if (!this.player) return;

    if (this.keys.up) this.y -= this.speed;
    if (this.keys.down) this.y += this.speed;
    if (this.keys.left) this.x -= this.speed;
    if (this.keys.right) this.x += this.speed;

    this.x = Math.max(10, Math.min(1138, this.x));
    this.y = Math.max(100, Math.min(788, this.y));

    this.player.style.left = this.x + "px";
    this.player.style.top = this.y + "px";

    const name = document.getElementById("worldPlayerName");

    if (name) {
        name.style.left = (this.x - 10) + "px";
        name.style.top = (this.y + 55) + "px";
    }

    requestAnimationFrame(() => this.loop());

}

};

window.addEventListener("load", () => {

setTimeout(() => {
    PNGPDMovement.init();
}, 500);

});

window.PNGPDMovement = PNGPDMovement;