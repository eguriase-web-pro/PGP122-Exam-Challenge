// =========================================================
// PNGPD LIVE — WORLD.JS
// =========================================================

document.addEventListener("DOMContentLoaded", () => {
    initializeWorld();
});

let worldInitialized = false;

function initializeWorld() {
    if (worldInitialized) return;
    worldInitialized = true;

    setupBuildingInteractions();
    setupPlayerMovement();
    setupWorldShortcuts();
}

/* =========================================================
   BUILDINGS
   ========================================================= */

function setupBuildingInteractions() {
    const buildings = document.querySelectorAll(".building");

    buildings.forEach(building => {
        building.addEventListener("click", () => {
            const location =
                building.dataset.location ||
                building.id ||
                building.className
                    .split(" ")
                    .find(x =>
                        [
                            "department",
                            "library",
                            "lab",
                            "hostel",
                            "cafeteria",
                            "arena",
                            "bank",
                            "shop",
                            "property",
                            "garage"
                        ].includes(x)
                    );

            enterLocation(location);
        });
    });
}

function enterLocation(location) {
    switch (location) {

        case "department":
            showGeneralPanel(
                "🏢 PNGPD Department",
                `
                    <p>Welcome to the PNGPD Department.</p>

                    <div class="panel-grid">
                        <div class="panel-card">
                            <h3>📚 Academic Centre</h3>
                            <p>Study your PGP courses and complete academic missions.</p>
                            <button class="btn btn-primary btn-block"
                                onclick="closeModal(); openMissions();">
                                View Missions
                            </button>
                        </div>

                        <div class="panel-card">
                            <h3>🏆 Student Ranking</h3>
                            <p>Check your position among PNGPD students.</p>
                            <button class="btn btn-gold btn-block"
                                onclick="closeModal(); openLeaderboard();">
                                Leaderboard
                            </button>
                        </div>
                    </div>
                `
            );
            break;

        case "library":
            startStudySession();
            break;

        case "lab":
            showGeneralPanel(
                "🧪 PNGPD Laboratory",
                `
                    <div class="panel-card">
                        <h3>Process Engineering Laboratory</h3>
                        <p>
                            Improve your practical knowledge of filtration,
                            evaporation, membrane separation, mixing,
                            leaching and integrated process engineering.
                        </p>
                    </div>

                    <br>

                    <button class="btn btn-primary btn-block"
                        onclick="closeModal(); startStudySession();">
                        🧠 Start Laboratory Challenge
                    </button>
                `
            );
            break;

        case "hostel":
            addEnergy(100);

            showToast(
                "🛏️ Hostel Restored +100 Energy",
                "success"
            );

            showLocationNotification(
                "Hostel",
                "You rested and restored your energy."
            );
            break;

        case "cafeteria":
            addEnergy(25);

            showToast(
                "🍛 Meal purchased — +25 Energy",
                "success"
            );

            showLocationNotification(
                "Cafeteria",
                "You grabbed a meal."
            );
            break;

        case "arena":
            startArena();
            break;

        case "bank":
            openBank();
            break;

        case "shop":
            openShop();
            break;

        case "property":
            openProperty();
            break;

        case "garage":
            openGarage();
            break;

        default:
            showToast(
                "Location unavailable.",
                "warning"
            );
    }
}

/* =========================================================
   STUDY SESSION
   ========================================================= */

function startStudySession() {
    if (typeof player !== "undefined" && player.energy < 5) {
        showToast(
            "⚡ You need at least 5 energy to study.",
            "warning"
        );
        return;
    }

    if (typeof useEnergy === "function") {
        useEnergy(5);
    }

    if (typeof openStudyQuestion === "function") {
        openStudyQuestion();
        return;
    }

    if (typeof startQuestion === "function") {
        startQuestion();
        return;
    }

    showToast(
        "Study system is loading...",
        "warning"
    );
}

/* =========================================================
   ARENA / BATTLE
   ========================================================= */

function startArena() {
    if (typeof player !== "undefined" && player.energy < 20) {
        showToast(
            "⚡ You need 20 energy to enter the Arena.",
            "warning"
        );
        return;
    }

    if (typeof startBattle === "function") {
        startBattle();
        return;
    }

    showGeneralPanel(
        "⚔️ PNGPD Arena",
        `
            <div class="tournament-card">
                <div class="tournament-title">
                    PNGPD Academic Arena
                </div>

                <p style="margin-top:8px;color:var(--muted)">
                    Challenge your academic knowledge and earn
                    XP, coins and ranking points.
                </p>

                <div class="tournament-info">
                    <span>⚡ Cost: 20 Energy</span>
                    <span>🏆 XP Reward</span>
                    <span>💰 Coin Reward</span>
                </div>

                <button class="btn btn-primary btn-block"
                    onclick="closeModal(); startBattleFallback();">
                    Enter Battle
                </button>
            </div>
        `
    );
}

function startBattleFallback() {
    if (typeof player !== "undefined" && player.energy < 20) {
        showToast("Not enough energy.", "warning");
        return;
    }

    if (typeof useEnergy === "function") {
        useEnergy(20);
    }

    if (typeof openStudyQuestion === "function") {
        openStudyQuestion(true);
    } else {
        showToast("Battle system unavailable.", "warning");
    }
}

/* =========================================================
   PLAYER MOVEMENT
   ========================================================= */

let movement = {
    up: false,
    down: false,
    left: false,
    right: false
};

let playerPosition = {
    x: 50,
    y: 65
};

let movementAnimation = null;

function setupPlayerMovement() {
    const playerElement =
        document.getElementById("playerCharacter");

    if (!playerElement) return;

    positionPlayer();

    document.addEventListener("keydown", event => {
        const key = event.key.toLowerCase();

        if (
            key === "arrowup" ||
            key === "w"
        ) movement.up = true;

        if (
            key === "arrowdown" ||
            key === "s"
        ) movement.down = true;

        if (
            key === "arrowleft" ||
            key === "a"
        ) movement.left = true;

        if (
            key === "arrowright" ||
            key === "d"
        ) movement.right = true;
    });

    document.addEventListener("keyup", event => {
        const key = event.key.toLowerCase();

        if (
            key === "arrowup" ||
            key === "w"
        ) movement.up = false;

        if (
            key === "arrowdown" ||
            key === "s"
        ) movement.down = false;

        if (
            key === "arrowleft" ||
            key === "a"
        ) movement.left = false;

        if (
            key === "arrowright" ||
            key === "d"
        ) movement.right = false;
    });

    if (!movementAnimation) {
        movementAnimation = requestAnimationFrame(movePlayer);
    }
}

function movePlayer() {
    const playerElement =
        document.getElementById("playerCharacter");

    if (!playerElement) {
        movementAnimation =
            requestAnimationFrame(movePlayer);
        return;
    }

    const speed = 0.65;

    if (movement.up) {
        playerPosition.y -= speed;
    }

    if (movement.down) {
        playerPosition.y += speed;
    }

    if (movement.left) {
        playerPosition.x -= speed;
    }

    if (movement.right) {
        playerPosition.x += speed;
    }

    playerPosition.x =
        Math.max(2, Math.min(96, playerPosition.x));

    playerPosition.y =
        Math.max(8, Math.min(90, playerPosition.y));

    positionPlayer();

    movementAnimation =
        requestAnimationFrame(movePlayer);
}

function positionPlayer() {
    const playerElement =
        document.getElementById("playerCharacter");

    if (!playerElement) return;

    playerElement.style.left =
        `${playerPosition.x}%`;

    playerElement.style.top =
        `${playerPosition.y}%`;
}

/* =========================================================
   QUICK WORLD MOVEMENT
   ========================================================= */

function moveToLocation(location) {
    const positions = {
        department: {
            x: 14,
            y: 25
        },

        library: {
            x: 48,
            y: 25
        },

        lab: {
            x: 84,
            y: 25
        },

        hostel: {
            x: 14,
            y: 60
        },

        cafeteria: {
            x: 48,
            y: 60
        },

        arena: {
            x: 84,
            y: 60
        },

        bank: {
            x: 28,
            y: 82
        },

        shop: {
            x: 50,
            y: 82
        },

        property: {
            x: 73,
            y: 82
        },

        garage: {
            x: 91,
            y: 82
        }
    };

    if (!positions[location]) return;

    playerPosition.x = positions[location].x;
    playerPosition.y = positions[location].y;

    positionPlayer();

    showLocationNotification(
        location.charAt(0).toUpperCase() +
        location.slice(1),
        "You moved to this location."
    );
}

/* =========================================================
   WORLD SHORTCUTS
   ========================================================= */

function setupWorldShortcuts() {
    document.addEventListener("keydown", event => {

        if (
            event.target.tagName === "INPUT" ||
            event.target.tagName === "TEXTAREA"
        ) {
            return;
        }

        switch (event.key) {

            case "1":
                moveToLocation("department");
                break;

            case "2":
                moveToLocation("library");
                break;

            case "3":
                moveToLocation("lab");
                break;

            case "4":
                moveToLocation("hostel");
                break;

            case "5":
                moveToLocation("cafeteria");
                break;

            case "6":
                moveToLocation("arena");
                break;

            case "7":
                moveToLocation("bank");
                break;

            case "8":
                moveToLocation("shop");
                break;
        }
    });
}

/* =========================================================
   LOCATION NOTIFICATION
   ========================================================= */

function showLocationNotification(title, message) {
    const notification =
        document.getElementById("locationNotification");

    if (!notification) return;

    notification.innerHTML = `
        <strong>${title}</strong>
        <div style="
            color:var(--muted);
            font-size:11px;
            margin-top:3px;
        ">
            ${message}
        </div>
    `;

    notification.classList.add("show");

    clearTimeout(
        showLocationNotification.timeout
    );

    showLocationNotification.timeout =
        setTimeout(() => {
            notification.classList.remove("show");
        }, 2500);
}

/* =========================================================
   EXPORT
   ========================================================= */

window.pngpdWorld = {
    initializeWorld,
    enterLocation,
    moveToLocation,
    showLocationNotification,
    startStudySession,
    startArena
};