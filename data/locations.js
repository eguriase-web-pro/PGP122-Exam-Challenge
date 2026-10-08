const LOCATIONS = [
    {
        id: "department",
        name: "PNGPD Department",
        icon: "🏢",
        description: "Your academic headquarters.",
        action: "department"
    },
    {
        id: "library",
        name: "PNGPD Library",
        icon: "📚",
        description: "Study, answer questions and earn XP.",
        action: "library"
    },
    {
        id: "lab",
        name: "Process Laboratory",
        icon: "🧪",
        description: "Take practical engineering challenges.",
        action: "lab"
    },
    {
        id: "hostel",
        name: "Student Hostel",
        icon: "🏠",
        description: "Rest and restore your energy.",
        action: "hostel"
    },
    {
        id: "cafeteria",
        name: "Campus Cafeteria",
        icon: "🍛",
        description: "Eat and recover some energy.",
        action: "cafeteria"
    },
    {
        id: "arena",
        name: "PNGPD Arena",
        icon: "⚔️",
        description: "Battle other students.",
        action: "arena"
    },
    {
        id: "bank",
        name: "PNGPD Bank",
        icon: "🏦",
        description: "Manage your in-game money.",
        action: "bank"
    },
    {
        id: "shop",
        name: "PNGPD Shop",
        icon: "🛒",
        description: "Buy items and upgrades.",
        action: "shop"
    },
    {
        id: "property",
        name: "Property Office",
        icon: "🏘️",
        description: "Buy properties and build your empire.",
        action: "property"
    },
    {
        id: "garage",
        name: "Vehicle Garage",
        icon: "🚗",
        description: "Buy and manage vehicles.",
        action: "garage"
    },
    {
        id: "tournament",
        name: "Tournament Ground",
        icon: "🏆",
        description: "Enter academic competitions.",
        action: "tournament"
    }
];

/* =========================================================
   LOCATION HELPERS
   ========================================================= */

function getLocation(locationId) {
    return LOCATIONS.find(
        location => location.id === locationId
    );
}

function getAllLocations() {
    return [...LOCATIONS];
}

function createLocationCard(location) {
    return `
        <div
            class="panel-card"
            data-location="${location.id}"
            onclick="enterLocation('${location.action}')"
            style="cursor:pointer"
        >
            <div style="font-size:32px;margin-bottom:8px">
                ${location.icon}
            </div>

            <h3>${location.name}</h3>

            <p>
                ${location.description}
            </p>

            <button
                class="btn btn-primary btn-small"
                style="margin-top:12px"
                onclick="event.stopPropagation(); enterLocation('${location.action}')"
            >
                Enter
            </button>
        </div>
    `;
}

/* =========================================================
   LOCATION DIRECTORY
   ========================================================= */

function openLocationDirectory() {
    showGeneralPanel(
        "🗺️ PNGPD Campus",
        `
            <p style="color:var(--muted);margin-bottom:16px">
                Select a location to travel around the PNGPD campus.
            </p>

            <div class="panel-grid">
                ${LOCATIONS.map(createLocationCard).join("")}
            </div>
        `
    );
}

/* =========================================================
   RANDOM CAMPUS EVENT
   ========================================================= */

const CAMPUS_EVENTS = [
    {
        title: "📢 Department Announcement",
        message: "A new academic challenge has been posted.",
        reward: 0,
        xp: 50
    },
    {
        title: "📚 Library Bonus",
        message: "The library is offering a temporary study bonus.",
        reward: 100000,
        xp: 100
    },
    {
        title: "🎓 Academic Opportunity",
        message: "Your academic performance has attracted attention.",
        reward: 150000,
        xp: 150
    },
    {
        title: "⚡ Energy Boost",
        message: "You found an energy drink around campus.",
        reward: 0,
        xp: 25,
        energy: 15
    }
];

function triggerRandomCampusEvent() {
    const event =
        CAMPUS_EVENTS[
            Math.floor(
                Math.random() * CAMPUS_EVENTS.length
            )
        ];

    if (event.reward && typeof addMoney === "function") {
        addMoney(event.reward);
    }

    if (event.xp && typeof addXP === "function") {
        addXP(event.xp);
    }

    if (
        event.energy &&
        typeof addEnergy === "function"
    ) {
        addEnergy(event.energy);
    }

    showGeneralPanel(
        event.title,
        `
            <div class="panel-card">
                <p>${event.message}</p>

                <div style="
                    display:flex;
                    gap:8px;
                    flex-wrap:wrap;
                    margin-top:15px;
                ">
                    ${
                        event.reward
                            ? `<span class="badge">
                                💰 +₦${event.reward.toLocaleString()}
                               </span>`
                            : ""
                    }

                    ${
                        event.xp
                            ? `<span class="badge">
                                ⭐ +${event.xp} XP
                               </span>`
                            : ""
                    }

                    ${
                        event.energy
                            ? `<span class="badge">
                                ⚡ +${event.energy} Energy
                               </span>`
                            : ""
                    }
                </div>
            </div>

            <button
                class="btn btn-primary btn-block"
                style="margin-top:15px"
                onclick="closeModal()"
            >
                Continue
            </button>
        `
    );
}

/* =========================================================
   CAMPUS EVENT TIMER
   ========================================================= */

let campusEventTimer = null;

function startCampusEvents() {
    if (campusEventTimer) {
        clearInterval(campusEventTimer);
    }

    campusEventTimer = setInterval(() => {

        if (
            typeof document !== "undefined" &&
            document.hidden
        ) {
            return;
        }

        if (
            typeof player === "undefined" ||
            !player
        ) {
            return;
        }

        if (Math.random() < 0.25) {
            triggerRandomCampusEvent();
        }

    }, 120000);
}

/* =========================================================
   INITIALIZATION
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    startCampusEvents();

    const directoryButton =
        document.getElementById("campusDirectory");

    if (directoryButton) {
        directoryButton.addEventListener(
            "click",
            openLocationDirectory
        );
    }
});

/* =========================================================
   GLOBAL EXPORT
   ========================================================= */

window.PNGPD_LOCATIONS = LOCATIONS;

window.pngpdLocations = {
    getLocation,
    getAllLocations,
    openLocationDirectory,
    triggerRandomCampusEvent,
    startCampusEvents
};