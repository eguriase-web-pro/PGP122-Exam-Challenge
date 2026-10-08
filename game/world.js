let currentLocation = null;

function initializeWorld() {

    const buildings =
        document.querySelectorAll(".building");

    buildings.forEach(building => {

        building.addEventListener("click", () => {

            const location =
                building.dataset.location;

            enterLocation(location);

        });

    });

    enablePlayerMovement();
}

function enterLocation(locationId) {

    const location =
        PNGPD_LOCATIONS[locationId];

    if (!location) return;

    currentLocation = locationId;

    document.getElementById(
        "locationTitle"
    ).textContent =
        `${location.icon} ${location.name}`;

    document.getElementById(
        "locationDescription"
    ).textContent =
        location.description;

    const notification =
        document.getElementById(
            "locationNotification"
        );

    notification.classList.remove("hidden");

    setTimeout(() => {

        notification.classList.add("hidden");

    }, 3000);

    handleLocation(locationId);
}

function handleLocation(locationId) {

    if (locationId === "library") {

        setTimeout(() => {
            openQuestion();
        }, 500);

    }

    if (locationId === "arena") {

        setTimeout(() => {
            startBattle();
        }, 500);

    }

    if (locationId === "cafeteria") {

        addEnergy(25);

        showToast(
            "🍔 You visited the cafeteria. +25 Energy"
        );

    }

    if (locationId === "hostel") {

        addEnergy(100);

        showToast(
            "🏠 You rested at the hostel. Energy restored!"
        );

    }

    if (locationId === "department") {

        showPanel("department");

    }

    if (locationId === "bank") {

        showPanel("bank");

    }

    if (locationId === "shop") {

        showPanel("shop");

    }

    if (locationId === "lab") {

        showPanel("lab");

    }
}

function enablePlayerMovement() {

    const playerElement =
        document.getElementById(
            "playerCharacter"
        );

    let x = 48;
    let y = 51;

    function move(dx, dy) {

        x += dx;
        y += dy;

        x = Math.max(5, Math.min(95, x));
        y = Math.max(18, Math.min(90, y));

        playerElement.style.left = x + "%";
        playerElement.style.top = y + "%";
    }

    document.addEventListener("keydown", event => {

        if (
            document.getElementById(
                "gameScreen"
            ).classList.contains("hidden")
        ) {
            return;
        }

        if (event.key === "ArrowUp" ||
            event.key.toLowerCase() === "w") {

            move(0, -3);
        }

        if (event.key === "ArrowDown" ||
            event.key.toLowerCase() === "s") {

            move(0, 3);
        }

        if (event.key === "ArrowLeft" ||
            event.key.toLowerCase() === "a") {

            move(-3, 0);
        }

        if (event.key === "ArrowRight" ||
            event.key.toLowerCase() === "d") {

            move(3, 0);
        }

    });
}