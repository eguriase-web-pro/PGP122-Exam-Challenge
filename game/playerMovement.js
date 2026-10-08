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

        this.player =
            document.getElementById("playerCharacter");

        if (!this.player) return;

        this.createControls();
        this.setupKeyboard();
        this.setupEnterButton();

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

        const old =
            document.getElementById(
                "mobileMovementControls"
            );

        if (old) old.remove();


        const controls =
            document.createElement("div");

        controls.id =
            "mobileMovementControls";


        controls.innerHTML = `

            <button
                class="move-btn move-up"
                data-direction="up">
                ▲
            </button>

            <div class="move-middle">

                <button
                    class="move-btn move-left"
                    data-direction="left">
                    ◀
                </button>


                <button
                    id="enterWorldButton"
                    class="enter-world-btn">
                    ENTER
                </button>


                <button
                    class="move-btn move-right"
                    data-direction="right">
                    ▶
                </button>

            </div>

            <button
                class="move-btn move-down"
                data-direction="down">
                ▼
            </button>

        `;


        document.body.appendChild(
            controls
        );


        const style =
            document.createElement("style");

        style.id =
            "pngpdMovementStyle";


        style.textContent = `

            #mobileMovementControls {

                position:fixed;

                left:18px;

                bottom:88px;

                z-index:500;

                display:flex;

                flex-direction:column;

                align-items:center;

                gap:6px;

                user-select:none;

                touch-action:none;

            }


            .move-middle {

                display:flex;

                align-items:center;

                gap:6px;

            }


            .move-btn {

                width:52px;

                height:52px;

                border-radius:16px;

                border:1px solid
                    rgba(255,255,255,.15);

                background:
                    linear-gradient(
                        145deg,
                        rgba(25,48,67,.98),
                        rgba(8,24,38,.98)
                    );

                color:#d8fff4;

                font-size:19px;

                font-weight:900;

                box-shadow:
                    0 6px 15px
                    rgba(0,0,0,.35);

                transition:
                    transform .1s,
                    background .1s;

                touch-action:none;

            }


            .move-btn:active {

                transform:scale(.9);

                background:#00d49b;

                color:#00150f;

            }


            .enter-world-btn {

                width:70px;

                height:70px;

                border-radius:50%;

                border:3px solid
                    rgba(0,212,155,.7);

                background:
                    radial-gradient(
                        circle,
                        #00d49b 0%,
                        #008f70 70%,
                        #006550 100%
                    );

                color:#00150f;

                font-size:12px;

                font-weight:1000;

                letter-spacing:.5px;

                box-shadow:
                    0 0 0 5px
                    rgba(0,212,155,.12),
                    0 8px 20px
                    rgba(0,0,0,.4);

                transition:
                    transform .1s;

                touch-action:none;

            }


            .enter-world-btn:active {

                transform:scale(.9);

            }


            @media(min-width:801px) {

                #mobileMovementControls {

                    left:25px;

                    bottom:25px;

                }

            }

        `;


        document.head.appendChild(
            style
        );


        controls
            .querySelectorAll(
                ".move-btn"
            )
            .forEach(button => {

                const direction =
                    button.dataset.direction;


                const start = (e) => {

                    e.preventDefault();

                    this.keys[direction] =
                        true;

                };


                const stop = (e) => {

                    e.preventDefault();

                    this.keys[direction] =
                        false;

                };


                button.addEventListener(
                    "touchstart",
                    start,
                    {passive:false}
                );

                button.addEventListener(
                    "touchend",
                    stop,
                    {passive:false}
                );

                button.addEventListener(
                    "touchcancel",
                    stop,
                    {passive:false}
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

    },


    setupEnterButton() {

        const button =
            document.getElementById(
                "enterWorldButton"
            );

        if (!button) return;


        button.addEventListener(
            "click",
            () => {

                this.enterNearestLocation();

            }
        );

    },


    enterNearestLocation() {

        const locations =
            document.querySelectorAll(
                ".location"
            );

        let nearest = null;
        let nearestDistance = Infinity;


        locations.forEach(location => {

            const left =
                parseFloat(
                    location.style.left ||
                    getComputedStyle(
                        location
                    ).left
                );

            const top =
                parseFloat(
                    location.style.top ||
                    getComputedStyle(
                        location
                    ).top
                );


            const width =
                location.offsetWidth;

            const height =
                location.offsetHeight;


            const centerX =
                left + width / 2;

            const centerY =
                top + height / 2;


            const distance =
                Math.sqrt(
                    Math.pow(
                        this.x - centerX,
                        2
                    ) +
                    Math.pow(
                        this.y - centerY,
                        2
                    )
                );


            if (
                distance < nearestDistance
            ) {

                nearestDistance =
                    distance;

                nearest =
                    location;

            }

        });


        if (!nearest) return;


        /*
           Player must be reasonably close
           to a building before ENTER works.
        */

        if (nearestDistance > 150) {

            if (
                window.PNGPD &&
                PNGPD.openPanel
            ) {

                PNGPD.openPanel(
                    "📍 Move Closer",
                    `
                    <p style="
                        color:#9bb0c2;
                        line-height:1.6;
                    ">
                        Move closer to a building
                        before pressing ENTER.
                    </p>
                    `
                );

            }

            return;

        }


        /*
           Trigger the actual building button.
        */

        nearest.click();

    },


    loop() {

        if (!this.player) return;


        if (this.keys.up)
            this.y -= this.speed;

        if (this.keys.down)
            this.y += this.speed;

        if (this.keys.left)
            this.x -= this.speed;

        if (this.keys.right)
            this.x += this.speed;


        this.x =
            Math.max(
                10,
                Math.min(
                    1138,
                    this.x
                )
            );


        this.y =
            Math.max(
                100,
                Math.min(
                    788,
                    this.y
                )
            );


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


        requestAnimationFrame(
            () => this.loop()
        );

    }

};


window.addEventListener(
    "load",
    () => {

        setTimeout(
            () => {

                PNGPDMovement.init();

            },
            500
        );

    }
);


window.PNGPDMovement =
    PNGPDMovement;