// ==========================================
// PNGPD LIFE 3D
// MOBILE CONTROLS
// ==========================================

function createMobileControls() {

    const controls = document.createElement("div");

    controls.id = "mobile-controls";

    controls.innerHTML = `
        <div id="joystick">
            <div id="joystick-knob"></div>
        </div>

        <button id="interact-button">INTERACT</button>
    `;

    document.body.appendChild(controls);


    const joystick =
        document.getElementById("joystick");

    const knob =
        document.getElementById("joystick-knob");


    let active = false;


    function moveJoystick(x, y) {

        const rect =
            joystick.getBoundingClientRect();

        const centerX =
            rect.left + rect.width / 2;

        const centerY =
            rect.top + rect.height / 2;

        let dx = x - centerX;
        let dy = y - centerY;

        const maxDistance = 45;

        const distance =
            Math.sqrt(
                dx * dx + dy * dy
            );

        if (distance > maxDistance) {

            dx =
                (dx / distance) *
                maxDistance;

            dy =
                (dy / distance) *
                maxDistance;
        }


        knob.style.transform =
            `translate(${dx}px, ${dy}px)`;


        const sensitivity = 0.035;


        if (window.PNGPDGame3D) {

            window.PNGPDGame3D.joystickX =
                dx * sensitivity;

            window.PNGPDGame3D.joystickY =
                dy * sensitivity;
        }
    }


    joystick.addEventListener(
        "touchstart",
        function(event) {

            event.preventDefault();

            active = true;

            const touch =
                event.touches[0];

            moveJoystick(
                touch.clientX,
                touch.clientY
            );
        },
        { passive: false }
    );


    joystick.addEventListener(
        "touchmove",
        function(event) {

            event.preventDefault();

            if (!active) return;

            const touch =
                event.touches[0];

            moveJoystick(
                touch.clientX,
                touch.clientY
            );
        },
        { passive: false }
    );


    joystick.addEventListener(
        "touchend",
        function() {

            active = false;

            knob.style.transform =
                "translate(0px, 0px)";

            if (window.PNGPDGame3D) {

                window.PNGPDGame3D.joystickX = 0;
                window.PNGPDGame3D.joystickY = 0;
            }
        }
    );


    // INTERACT BUTTON

    document
        .getElementById("interact-button")
        .addEventListener(
            "click",
            function() {

                if (
                    window.PNGPDGame3D &&
                    window.PNGPDGame3D.interact
                ) {

                    window.PNGPDGame3D.interact();
                }
            }
        );
}


// ==========================================
// START MOBILE CONTROLS
// ==========================================

window.addEventListener(
    "load",
    function() {

        createMobileControls();

    }
);