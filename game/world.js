// PNGPD LIVE - World & Location System

const WORLD_STORAGE_KEY = "pngpd_live_world_v1";

const DEFAULT_WORLD = {
    currentLocation: "department",
    visitedLocations: [],
    locationHistory: []
};

function loadWorld() {
    try {
        const saved = localStorage.getItem(WORLD_STORAGE_KEY);

        if (!saved) {
            return { ...DEFAULT_WORLD };
        }

        return {
            ...DEFAULT_WORLD,
            ...JSON.parse(saved)
        };
    } catch (error) {
        console.error("World load error:", error);
        return { ...DEFAULT_WORLD };
    }
}

function saveWorld(world) {
    localStorage.setItem(
        WORLD_STORAGE_KEY,
        JSON.stringify(world)
    );
}

function getLocationData(locationId) {
    if (
        typeof locations !== "undefined" &&
        Array.isArray(locations)
    ) {
        return locations.find(
            location => location.id === locationId
        );
    }

    if (
        typeof locations !== "undefined" &&
        typeof locations === "object"
    ) {
        return locations[locationId];
    }

    return null;
}

function enterLocation(locationId) {
    const world = loadWorld();
    const location = getLocationData(locationId);

    if (!location) {
        showPlayerToast("Location not found.");
        return;
    }

    world.currentLocation = locationId;

    if (!world.visitedLocations.includes(locationId)) {
        world.visitedLocations.push(locationId);

        if (
            window.pngpdMissions &&
            typeof window.pngpdMissions.locationVisited === "function"
        ) {
            window.pngpdMissions.locationVisited();
        }
    }

    world.locationHistory.push({
        location: locationId,
        time: new Date().toISOString()
    });

    if (world.locationHistory.length > 100) {
        world.locationHistory.shift();
    }

    saveWorld(world);

    updateLocationNotification(location);
    highlightCurrentLocation(locationId);
    movePlayerToLocation(locationId);
    openLocationAction(locationId);
}

function updateLocationNotification(location) {
    const notification =
        document.getElementById("locationNotification");

    const icon =
        document.getElementById("locationIcon");

    const name =
        document.getElementById("locationName");

    const description =
        document.getElementById("locationDescription");

    if (icon) {
        icon.textContent =
            location.icon || "📍";
    }

    if (name) {
        name.textContent =
            location.name || "Location";
    }

    if (description) {
        description.textContent =
            location.description || "";
    }

    if (notification) {
        notification.classList.add("show");

        setTimeout(() => {
            notification.classList.remove("show");
        }, 3000);
    }
}

function highlightCurrentLocation(locationId) {
    document
        .querySelectorAll("[data-location]")
        .forEach(element => {
            element.classList.remove("active-location");

            if (
                element.dataset.location === locationId
            ) {
                element.classList.add("active-location");
            }
        });
}

function movePlayerToLocation(locationId) {
    const player =
        document.getElementById("playerCharacter");

    if (!player) {
        return;
    }

    const positions = {
        department: {
            left: "15%",
            top: "45%"
        },

        library: {
            left: "32%",
            top: "30%"
        },

        lab: {
            left: "52%",
            top: "28%"
        },

        hostel: {
            left: "75%",
            top: "32%"
        },

        cafeteria: {
            left: "28%",
            top: "65%"
        },

        arena: {
            left: "52%",
            top: "65%"
        },

        bank: {
            left: "73%",
            top: "60%"
        },

        shop: {
            left: "87%",
            top: "55%"
        },

        properties: {
            left: "82%",
            top: "78%"
        },

        garage: {
            left: "62%",
            top: "82%"
        },

        tournaments: {
            left: "42%",
            top: "82%"
        }
    };

    const position = positions[locationId];

    if (!position) {
        return;
    }

    player.style.left = position.left;
    player.style.top = position.top;
}

function openLocationAction(locationId) {
    switch (locationId) {

        case "department":
            showLocationMessage(
                "🏢 Department",
                "Welcome to PNGPD. Attend classes, take assessments and build your academic reputation."
            );
            break;

        case "library":
            showLocationMessage(
                "📚 Library",
                "Study, answer academic questions and increase your XP."
            );
            break;

        case "lab":
            showLocationMessage(
                "🧪 Laboratory",
                "Improve your practical knowledge through technical challenges."
            );
            break;

        case "hostel":
            showLocationMessage(
                "🏠 Hostel",
                "Your campus home. Rest and manage your energy."
            );
            break;

        case "cafeteria":
            showLocationMessage(
                "🍽️ Cafeteria",
                "Take a break and restore some energy."
            );
            restoreEnergyAtCafeteria();
            break;

        case "arena":
            showLocationMessage(
                "⚔️ Battle Arena",
                "Challenge an academic opponent."
            );

            if (window.pngpdBattles) {
                setTimeout(() => {
                    window.pngpdBattles.startBattle();
                }, 500);
            }
            break;

        case "bank":
            openPanel("bank");
            break;

        case "shop":
            openPanel("shop");
            break;

        case "properties":
            openPanel("properties");
            break;

        case "garage":
            openPanel("garage");
            break;

        case "tournaments":
            openPanel("tournaments");
            break;

        default:
            break;
    }
}

function showLocationMessage(title, message) {
    if (typeof openGeneralModal === "function") {
        openGeneralModal(
            title,
            `
                <div class="location-message">
                    <p>${message}</p>

                    <button
                        class="primary-btn"
                        onclick="closeGeneralModal()"
                    >
                        Continue
                    </button>
                </div>
            `
        );
    } else {
        showPlayerToast(message);
    }
}

function restoreEnergyAtCafeteria() {
    const player = getActivePlayer();

    if (!player) {
        return;
    }

    const before = player.energy;

    addEnergy(20);

    const restored =
        player.energy - before;

    if (restored > 0) {
        showPlayerToast(
            `🍽️ Cafeteria: +${restored} energy`
        );
    } else {
        showPlayerToast(
            "Your energy is already full."
        );
    }
}

function getCurrentLocation() {
    const world = loadWorld();

    return getLocationData(
        world.currentLocation
    );
}

function getVisitedLocations() {
    return loadWorld().visitedLocations;
}

function getLocationHistory() {
    return loadWorld().locationHistory;
}

function initialiseWorld() {

    document
        .querySelectorAll("[data-location]")
        .forEach(element => {

            element.addEventListener("click", () => {

                const locationId =
                    element.dataset.location;

                enterLocation(locationId);
            });
        });

    const world = loadWorld();

    highlightCurrentLocation(
        world.currentLocation
    );

    movePlayerToLocation(
        world.currentLocation
    );
}

function resetWorld() {
    localStorage.removeItem(
        WORLD_STORAGE_KEY
    );

    location.reload();
}

function openPanel(panelName) {
    const panels = {
        profile: "profilePanel",
        missions: "missionsPanel",
        ranks: "ranksPanel",
        items: "itemsPanel",
        menu: "menuPanel",
        bank: "bankPanel",
        shop: "shopPanel",
        properties: "propertyPanel",
        garage: "garagePanel",
        tournaments: "tournamentPanel",
        transfers: "transferPanel",
        friends: "friendsPanel",
        settings: "settingsPanel",
        admin: "adminPanel",
        help: "helpPanel"
    };

    const panelId = panels[panelName];

    if (!panelId) {
        return;
    }

    document
        .querySelectorAll(
            ".game-panel, .side-panel"
        )
        .forEach(panel => {
            panel.classList.remove("active");
        });

    const panel =
        document.getElementById(panelId);

    if (panel) {
        panel.classList.add("active");
    }

    if (
        panelName === "missions" &&
        window.pngpdMissions
    ) {
        window.pngpdMissions.render();
    }

    if (
        panelName === "items" &&
        window.pngpdEconomy
    ) {
        window.pngpdEconomy.updateInventory();
    }

    if (
        panelName === "bank" &&
        window.pngpdEconomy
    ) {
        window.pngpdEconomy.updateBank();
    }
}

function closePanels() {
    document
        .querySelectorAll(
            ".game-panel, .side-panel"
        )
        .forEach(panel => {
            panel.classList.remove("active");
        });
}

window.pngpdWorld = {
    enterLocation,
    getCurrentLocation,
    getVisitedLocations,
    getLocationHistory,
    initialiseWorld,
    resetWorld,
    openPanel,
    closePanels
};

document.addEventListener(
    "DOMContentLoaded",
    () => {
        setTimeout(() => {
            initialiseWorld();
        }, 250);
    }
);