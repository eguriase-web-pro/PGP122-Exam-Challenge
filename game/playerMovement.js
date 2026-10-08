/* =========================================
   PNGPD LIFE — PLAYER MOVEMENT
========================================= */

const PNGPDMovement = {

    player: null,

    x: 570,
    y: 310,

    speed: 5,

    keys: {
        up: false,
        down: false,
        left: false,
        right: false
    },

    init() {

        this.player =
            document.getElementById("playerCharacter");

        if (!this.player) return;

        this.createControls();
        this.setupKeyboard();
        this.startMovement();

        this.updatePosition();
    },


    setupKeyboard() {

        document.addEventListener("keydown", (event) => {

            const key = event.key.toLowerCase();

            if (
                key === "arrowup" ||
                key === "w"
            ) {
                this.keys.up = true;
            }

            if (
                key === "arrowdown" ||
                key === "s"
            ) {
                this.keys.down = true;
            }

            if (
                key === "arrowleft" ||
                key === "a"
            ) {
                this.keys.left = true;
            }

            if (
                key === "arrowright" ||
                key === "d"
            ) {
                this.keys.right = true;
            }

        });


        document.addEventListener("keyup", (event) => {

            const key = event.key.toLowerCase();

            if (
                key === "arrowup" ||
                key === "w"
            ) {
                this.keys.up = false;
            }

            if (
                key === "arrowdown" ||
                key === "s"
            ) {
                this.keys.down = false;
            }

            if (
                key === "arrowleft" ||
                key === "a"
            ) {
                this.keys.left = false;
            }

            if (
                key === "arrowright" ||
                key === "d"
            ) {
                this.keys.right = false;
            }

        });

    },


    move() {

        let moved = false;

        if (this.keys.up) {
            this.y -= this.speed;
            moved = true;
        }

        if (this.keys.down) {
            this.y += this.speed;
            moved = true;
        }

        if (this.keys.left) {
            this.x -= this.speed;
            moved = true;
        }

        if (this.keys.right) {
            this.x += this.speed;
            moved = true;
        }


        /* WORLD BOUNDARIES */

        this.x = Math.max(
            10,
            Math.min(1138, this.x)
        );

        this.y = Math.max(
            100,
            Math.min(788, this.y)
        );


        if (moved) {
            this.updatePosition();
        }

    },


    updatePosition() {

        if (!this.player) return;

        this.player.style.left =
            this.x + "px";

        this.player.style.top =
            this.y + "px";


        const name =
            document.getElementById(
                "worldPlayerName"
            );

        if (name) {

            name.style.left =
                (this.x - 10) + "px";

            name.style.top =
                (this.y + 55) + "px";

        }

    },


    startMovement() {

        const loop = () => {

            this.move();

            requestAnimationFrame(loop);

        };

        requestAnimationFrame(loop);

    },


    createControls() {

        const controls =
            document.createElement("div");

        controls.id =
            "mobileMovementControls";

        controls.innerHTML = `

            <button data-direction="up">
                ▲
            </button>

            <div class="movement-row">

                <button data-direction="left">
                    ◀
                </button>

                <button data-direction="down">
                    ▼
                </button>

                <button data-direction="right">
                    ▶
                </button>

            </div>
        `;


        document.body.appendChild(
            controls
        );


        const style =
            document.createElement("style");

        style.textContent = `

            #mobileMovementControls {

                position:fixed;

                bottom:90px;

                left:15px;

                z-index:200;

                width:150px;

                display:flex;

                flex-direction:column;

                align-items:center;

                gap:4px;

                user-select:none;

                touch-action:none;

            }


            #mobileMovementControls
            .movement-row {

                display:flex;

                gap:4px;

            }


            #mobileMovementControls
            button {

                width:46px;

                height:46px;

                border-radius:12px;

                border:1px solid
                    rgba(255,255,255,.15);

                background:
                    rgba(5,20,32,.9);

                color:white;

                font-size:20px;

                font-weight:bold;

                box-shadow:
                    0 5px 15px
                    rgba(0,0,0,.35);

                touch-action:none;

            }


            #mobileMovementControls
            button:active {

                background:#00d49b;

                color:#00150f;

            }


            @media(min-width:801px) {

                #mobileMovementControls {
                    display:none;
                }

            }

        `;

        document.head.appendChild(style);


        controls
        .querySelectorAll("button")
        .forEach(button => {

            const direction =
                button.dataset.direction;


            const start = (event) => {

                event.preventDefault();

                this.keys[direction] = true;

            };


            const stop = (event) => {

                event.preventDefault();

                this.keys[direction] = false;

            };


            button.addEventListener(
                "touchstart",
                start,
                { passive:false }
            );

            button.addEventListener(
                "touchend",
                stop,
                { passive:false }
            );

            button.addEventListener(
                "touchcancel",
                stop,
                { passive:false }
            );


            button.addEventListener(
                "mousedown",
                start
            );

            button.addEventListener(
                "mouseup",
                stop
            );

            button.addEventListener(
                "mouseleave",
                stop
            );

        });

    }

};


/* =========================================
   START MOVEMENT
========================================= */

window.addEventListener(
    "load",
    () => {

        setTimeout(() => {

            PNGPDMovement.init();

        }, 500);

    }
);


window.PNGPDMovement =
    PNGPDMovement;