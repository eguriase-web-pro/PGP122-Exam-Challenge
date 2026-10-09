const LOCATIONS = [
    {
        id: "department",
        name: "PNGPD Department",
        icon: "🏢",
        description: "The PNGPD department — attend classes, meet lecturers and manage your academic life.",
        action: "department"
    },

    {
        id: "library",
        name: "PTI Library",
        icon: "📚",
        description: "Study at the PTI Library, access course handouts and prepare for examinations.",
        action: "library",
        features: [
            "Course Handouts",
            "Past Questions",
            "Study Area",
            "Exam Preparation"
        ]
    },

    {
        id: "lab",
        name: "PGP 126 Laboratory",
        icon: "🧪",
        description: "Carry out PGP 126 practical experiments and complete laboratory challenges.",
        action: "lab",
        features: [
            "PGP 126 Experiments",
            "Practical Challenges",
            "Laboratory Reports",
            "Practical XP"
        ]
    },

    {
        id: "hostel",
        name: "Student Hostels",
        icon: "🏠",
        description: "Choose your hostel, rest, recover energy and manage your student life.",
        action: "hostel",

        hostels: [
            {
                id: "kokori",
                name: "Kokori Hostel",
                icon: "🏠",
                type: "Boys Hostel",
                description: "Kokori Boys Hostel."
            },
            {
                id: "ptdf",
                name: "PTDF Hostel",
                icon: "🏠",
                type: "Student Hostel",
                description: "PTDF student accommodation."
            },
            {
                id: "noble",
                name: "Noble Hostel",
                icon: "🏠",
                type: "Student Hostel",
                description: "Noble student hostel."
            },
            {
                id: "nddc",
                name: "NDDC Hostel",
                icon: "🏠",
                type: "Student Hostel",
                description: "NDDC student accommodation."
            }
        ]
    },

    {
        id: "cafeteria",
        name: "PTI Food Court",
        icon: "🍛",
        description: "Visit Bush Mama or Tutu Restaurant to buy food and restore your energy.",
        action: "cafeteria",

        restaurants: [
            {
                id: "bush-mama",
                name: "Bush Mama",
                icon: "🍽️",
                description: "A popular food spot around PTI.",
                foods: [
                    {
                        name: "Jollof Rice",
                        icon: "🍚",
                        energy: 25,
                        price: 800
                    },
                    {
                        name: "Fried Rice",
                        icon: "🍛",
                        energy: 30,
                        price: 1000
                    },
                    {
                        name: "Beans",
                        icon: "🥣",
                        energy: 25,
                        price: 700
                    },
                    {
                        name: "Beans & Plantain",
                        icon: "🍌",
                        energy: 35,
                        price: 1000
                    },
                    {
                        name: "Rice & Stew",
                        icon: "🍚",
                        energy: 30,
                        price: 900
                    },
                    {
                        name: "Fried Egg",
                        icon: "🍳",
                        energy: 15,
                        price: 400
                    },
                    {
                        name: "Meat",
                        icon: "🍖",
                        energy: 20,
                        price: 500
                    },
                    {
                        name: "Salad",
                        icon: "🥗",
                        energy: 15,
                        price: 500
                    },
                    {
                        name: "Meat Pie",
                        icon: "🥧",
                        energy: 15,
                        price: 500
                    },
                    {
                        name: "Zobo",
                        icon: "🥤",
                        energy: 10,
                        price: 300
                    }
                ]
            },

            {
                id: "tutu",
                name: "Tutu Restaurant",
                icon: "🍴",
                description: "Grab a meal, snack or drink before heading back to campus activities.",
                foods: [
                    {
                        name: "Jollof Rice",
                        icon: "🍚",
                        energy: 25,
                        price: 800
                    },
                    {
                        name: "Fried Rice",
                        icon: "🍛",
                        energy: 30,
                        price: 1000
                    },
                    {
                        name: "White Rice & Stew",
                        icon: "🍚",
                        energy: 30,
                        price: 900
                    },
                    {
                        name: "Beans",
                        icon: "🥣",
                        energy: 25,
                        price: 700
                    },
                    {
                        name: "Spaghetti",
                        icon: "🍝",
                        energy: 25,
                        price: 800
                    },
                    {
                        name: "Salad",
                        icon: "🥗",
                        energy: 15,
                        price: 500
                    },
                    {
                        name: "Meat Pie",
                        icon: "🥧",
                        energy: 15,
                        price: 500
                    },
                    {
                        name: "Sausage Roll",
                        icon: "🌭",
                        energy: 12,
                        price: 400
                    },
                    {
                        name: "Meat",
                        icon: "🍖",
                        energy: 20,
                        price: 500
                    },
                    {
                        name: "Zobo",
                        icon: "🥤",
                        energy: 10,
                        price: 300
                    }
                ]
            }
        ]
    },

    {
        id: "arena",
        name: "PNGPD Arena",
        icon: "⚔️",
        description: "Compete against other PNGPD students in academic and skill challenges.",
        action: "arena"
    },

    {
        id: "bank",
        name: "UBA Bank",
        icon: "🏦",
        description: "Visit UBA to manage your in-game money and financial activities.",
        action: "bank",
        features: [
            "Withdraw",
            "Deposit",
            "Transfer",
            "Balance"
        ]
    },

    {
        id: "shop",
        name: "PNGPD Shop",
        icon: "🛒",
        description: "Buy useful items, school supplies, food and upgrades.",
        action: "shop"
    },

    {
        id: "property",
        name: "Property Office",
        icon: "🏘️",
        description: "Buy properties and gradually build your campus-life empire.",
        action: "property"
    },

    {
        id: "garage",
        name: "Vehicle Garage",
        icon: "🚗",
        description: "Buy, store and manage vehicles.",
        action: "garage"
    },

    {
        id: "tournament",
        name: "Tournament Ground",
        icon: "🏆",
        description: "Enter academic competitions and compete for rewards and XP.",
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


/* =========================================================
   LOCATION CARD
   ========================================================= */

function createLocationCard(location) {

    return `
        <div
            class="panel-card"
            data-location="${location.id}"
            onclick="enterLocation('${location.action}')"
            style="cursor:pointer"
        >

            <div style="
                font-size:32px;
                margin-bottom:8px;
            ">
                ${location.icon}
            </div>

            <h3>${location.name}</h3>

            <p>
                ${location.description}
            </p>

            ${
                location.features
                    ? `
                        <div style="
                            display:flex;
                            gap:6px;
                            flex-wrap:wrap;
                            margin-top:10px;
                        ">
                            ${location.features.map(
                                feature => `
                                    <span class="badge">
                                        ${feature}
                                    </span>
                                `
                            ).join("")}
                        </div>
                    `
                    : ""
            }

            <button
                class="btn btn-primary btn-small"
                style="margin-top:12px"
                onclick="
                    event.stopPropagation();
                    enterLocation('${location.action}')
                "
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
        "🗺️ PTI Campus",
        `
            <p style="
                color:var(--muted);
                margin-bottom:16px;
            ">
                Explore the places around your PNGPD student life.
            </p>

            <div class="panel-grid">
                ${LOCATIONS.map(createLocationCard).join("")}
            </div>
        `
    );
}


/* =========================================================
   RANDOM CAMPUS EVENTS
   ========================================================= */

const CAMPUS_EVENTS = [

    {
        title: "📢 Department Announcement",
        message: "A new academic challenge has been posted.",
        reward: 0,
        xp: 50
    },

    {
        title: "📚 PTI Library Bonus",
        message: "You spent time studying at the PTI Library and gained useful knowledge.",
        reward: 0,
        xp: 100
    },

    {
        title: "🎓 Academic Opportunity",
        message: "Your academic performance has attracted attention.",
        reward: 150000,
        xp: 150
    },

    {
        title: "🧪 Laboratory Discovery",
        message: "You successfully completed part of a PGP 126 laboratory challenge.",
        reward: 0,
        xp: 100
    },

    {
        title: "🍛 Food Break",
        message: "You stopped at one of the PTI food spots for a quick meal.",
        reward: 0,
        xp: 25
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

    if (
        event.reward &&
        typeof addMoney === "function"
    ) {
        addMoney(event.reward);
    }

    if (
        event.xp &&
        typeof addXP === "function"
    ) {
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

                <p>
                    ${event.message}
                </p>

                <div style="
                    display:flex;
                    gap:8px;
                    flex-wrap:wrap;
                    margin-top:15px;
                ">

                    ${
                        event.reward
                            ? `
                                <span class="badge">
                                    💰 +₦${event.reward.toLocaleString()}
                                </span>
                            `
                            : ""
                    }

                    ${
                        event.xp
                            ? `
                                <span class="badge">
                                    ⭐ +${event.xp} XP
                                </span>
                            `
                            : ""
                    }

                    ${
                        event.energy
                            ? `
                                <span class="badge">
                                    ⚡ +${event.energy} Energy
                                </span>
                            `
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

document.addEventListener(
    "DOMContentLoaded",
    () => {

        startCampusEvents();

        const directoryButton =
            document.getElementById(
                "campusDirectory"
            );

        if (directoryButton) {

            directoryButton.addEventListener(
                "click",
                openLocationDirectory
            );

        }

    }
);


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