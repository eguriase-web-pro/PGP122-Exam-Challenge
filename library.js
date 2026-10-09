/* =========================================================
   PNGPD LIFE — LOCATION ACTIONS
   ========================================================= */

/*
   This file controls what happens when the player
   enters the different places around PTI.
*/


/* =========================================================
   MAIN LOCATION ENTRY
   ========================================================= */

function enterLocation(action) {

    switch (action) {

        case "department":
            openDepartment();
            break;

        case "library":
            openPTILibrary();
            break;

        case "lab":
            openPGP126Lab();
            break;

        case "hostel":
            openHostels();
            break;

        case "cafeteria":
            openFoodCourt();
            break;

        case "arena":
            openArena();
            break;

        case "bank":
            openUBABank();
            break;

        case "shop":
            openShop();
            break;

        case "property":
            openPropertyOffice();
            break;

        case "garage":
            openGarage();
            break;

        case "tournament":
            openTournament();
            break;

        default:
            showGeneralPanel(
                "📍 Location",
                `
                    <p>
                        This location is not available yet.
                    </p>
                `
            );
    }
}


/* =========================================================
   PNGPD DEPARTMENT
   ========================================================= */

function openDepartment() {

    showGeneralPanel(
        "🏢 PNGPD Department",
        `
            <div class="panel-card">

                <h3>Petroleum & Natural Gas Processing Department</h3>

                <p>
                    Your academic headquarters at PTI.
                </p>

                <div style="
                    display:flex;
                    gap:8px;
                    flex-wrap:wrap;
                    margin-top:15px;
                ">
                    <span class="badge">📚 Courses</span>
                    <span class="badge">👨‍🏫 Lecturers</span>
                    <span class="badge">📝 Tests</span>
                    <span class="badge">🎓 Academics</span>
                </div>

            </div>
        `
    );
}


/* =========================================================
   PTI LIBRARY
   ========================================================= */

function openPTILibrary() {

    showGeneralPanel(
        "📚 PTI Library",
        `
            <div class="panel-card">

                <h3>Welcome to the PTI Library</h3>

                <p>
                    Study, read your handouts and prepare for
                    examinations.
                </p>

                <div style="
                    display:grid;
                    gap:10px;
                    margin-top:15px;
                ">

                    <button
                        class="btn btn-primary btn-block"
                        onclick="openHandouts()"
                    >
                        📖 Course Handouts
                    </button>

                    <button
                        class="btn btn-primary btn-block"
                        onclick="openPastQuestions()"
                    >
                        📝 Past Questions
                    </button>

                    <button
                        class="btn btn-primary btn-block"
                        onclick="startLibraryStudy()"
                    >
                        🧠 Study Session
                    </button>

                </div>

            </div>
        `
    );
}


/* =========================================================
   HANDOUTS
   ========================================================= */

function openHandouts() {

    showGeneralPanel(
        "📖 Course Handouts",
        `
            <div class="panel-card">

                <h3>PNGPD Handouts</h3>

                <p>
                    Your course materials will be available here.
                </p>

                <div style="
                    display:grid;
                    gap:8px;
                    margin-top:15px;
                ">

                    <button class="btn btn-primary btn-block">
                        PGP 121
                    </button>

                    <button class="btn btn-primary btn-block">
                        PGP 122
                    </button>

                    <button class="btn btn-primary btn-block">
                        PGP 123
                    </button>

                    <button class="btn btn-primary btn-block">
                        PGP 124
                    </button>

                    <button class="btn btn-primary btn-block">
                        PGP 125
                    </button>

                    <button class="btn btn-primary btn-block">
                        PGP 126
                    </button>

                    <button class="btn btn-primary btn-block">
                        PGP 127
                    </button>

                    <button class="btn btn-primary btn-block">
                        MTH 101 / 112
                    </button>

                    <button class="btn btn-primary btn-block">
                        GNS
                    </button>

                    <button class="btn btn-primary btn-block">
                        GLT
                    </button>

                    <button class="btn btn-primary btn-block">
                        CHE
                    </button>

                </div>

            </div>
        `
    );
}


/* =========================================================
   PAST QUESTIONS
   ========================================================= */

function openPastQuestions() {

    showGeneralPanel(
        "📝 Past Questions",
        `
            <div class="panel-card">

                <h3>Past Questions</h3>

                <p>
                    Practice previous examination questions
                    and prepare for your next test.
                </p>

                <button
                    class="btn btn-primary btn-block"
                    style="margin-top:15px"
                    onclick="
                        if(typeof startStudy === 'function'){
                            startStudy();
                        }
                    "
                >
                    Start Practice
                </button>

            </div>
        `
    );
}


/* =========================================================
   LIBRARY STUDY
   ========================================================= */

function startLibraryStudy() {

    if (typeof startStudy === "function") {

        startStudy();

    } else {

        showGeneralPanel(
            "🧠 Study Session",
            `
                <div class="panel-card">
                    <p>
                        The study system is loading.
                    </p>
                </div>
            `
        );

    }
}


/* =========================================================
   PGP 126 LABORATORY
   ========================================================= */

function openPGP126Lab() {

    showGeneralPanel(
        "🧪 PGP 126 Laboratory",
        `
            <div class="panel-card">

                <h3>PGP 126 Practical Laboratory</h3>

                <p>
                    This is where PNGPD students carry out
                    their PGP 126 practical experiments.
                </p>

                <div style="
                    display:flex;
                    gap:8px;
                    flex-wrap:wrap;
                    margin-top:15px;
                ">
                    <span class="badge">🧪 Experiments</span>
                    <span class="badge">📋 Reports</span>
                    <span class="badge">⭐ Practical XP</span>
                </div>

                <button
                    class="btn btn-primary btn-block"
                    style="margin-top:15px"
                    onclick="startPGP126Experiment()"
                >
                    🧪 Start Experiment
                </button>

            </div>
        `
    );
}


function startPGP126Experiment() {

    showGeneralPanel(
        "🧪 PGP 126 Experiment",
        `
            <div class="panel-card">

                <h3>Laboratory Challenge</h3>

                <p>
                    Complete the PGP 126 practical challenge
                    to earn XP.
                </p>

                <button
                    class="btn btn-primary btn-block"
                    style="margin-top:15px"
                    onclick="
                        if(typeof addXP === 'function'){
                            addXP(100);
                        }
                        closeModal();
                    "
                >
                    Complete Experiment
                </button>

            </div>
        `
    );
}


/* =========================================================
   HOSTELS
   ========================================================= */

function openHostels() {

    const location = window.PNGPD_LOCATIONS
        ? window.PNGPD_LOCATIONS.find(
            item => item.id === "hostel"
        )
        : null;

    const hostels = location?.hostels || [];

    showGeneralPanel(
        "🏠 PTI Student Hostels",
        `
            <p style="
                color:var(--muted);
                margin-bottom:15px;
            ">
                Choose where you want to stay.
            </p>

            <div class="panel-grid">

                ${hostels.map(hostel => `

                    <div class="panel-card">

                        <div style="font-size:32px">
                            ${hostel.icon}
                        </div>

                        <h3>${hostel.name}</h3>

                        <p>
                            ${hostel.type}
                        </p>

                        <button
                            class="btn btn-primary btn-small"
                            onclick="
                                restAtHostel('${hostel.id}')
                            "
                        >
                            Rest
                        </button>

                    </div>

                `).join("")}

            </div>
        `
    );
}


function restAtHostel(hostelId) {

    if (typeof addEnergy === "function") {
        addEnergy(30);
    }

    showGeneralPanel(
        "😴 Rest Complete",
        `
            <div class="panel-card">

                <h3>You rested at the hostel.</h3>

                <p>
                    ⚡ +30 Energy
                </p>

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
   PTI FOOD COURT
   ========================================================= */

function openFoodCourt() {

    const location = window.PNGPD_LOCATIONS
        ? window.PNGPD_LOCATIONS.find(
            item => item.id === "cafeteria"
        )
        : null;

    const restaurants = location?.restaurants || [];

    showGeneralPanel(
        "🍛 PTI Food Court",
        `
            <p style="
                color:var(--muted);
                margin-bottom:15px;
            ">
                Choose where you want to eat.
            </p>

            <div class="panel-grid">

                ${restaurants.map(restaurant => `

                    <div class="panel-card">

                        <div style="font-size:32px">
                            ${restaurant.icon}
                        </div>

                        <h3>${restaurant.name}</h3>

                        <p>
                            ${restaurant.description}
                        </p>

                        <button
                            class="btn btn-primary btn-small"
                            onclick="
                                openRestaurant('${restaurant.id}')
                            "
                        >
                            View Menu
                        </button>

                    </div>

                `).join("")}

            </div>
        `
    );
}


/* =========================================================
   RESTAURANT MENU
   ========================================================= */

function openRestaurant(restaurantId) {

    const location = window.PNGPD_LOCATIONS
        ? window.PNGPD_LOCATIONS.find(
            item => item.id === "cafeteria"
        )
        : null;

    const restaurant =
        location?.restaurants?.find(
            item => item.id === restaurantId
        );

    if (!restaurant) return;

    showGeneralPanel(
        `${restaurant.icon} ${restaurant.name}`,
        `
            <div class="panel-grid">

                ${restaurant.foods.map(food => `

                    <div class="panel-card">

                        <div style="
                            font-size:30px;
                            margin-bottom:6px;
                        ">
                            ${food.icon}
                        </div>

                        <h3>${food.name}</h3>

                        <p>
                            ⚡ +${food.energy} Energy
                        </p>

                        <p>
                            💰 ₦${food.price.toLocaleString()}
                        </p>

                        <button
                            class="btn btn-primary btn-small"
                            onclick="
                                buyFood(
                                    '${restaurant.id}',
                                    '${food.name}'
                                )
                            "
                        >
                            Buy
                        </button>

                    </div>

                `).join("")}

            </div>
        `
    );
}


/* =========================================================
   BUY FOOD
   ========================================================= */

function buyFood(restaurantId, foodName) {

    const location = window.PNGPD_LOCATIONS
        ? window.PNGPD_LOCATIONS.find(
            item => item.id === "cafeteria"
        )
        : null;

    const restaurant =
        location?.restaurants?.find(
            item => item.id === restaurantId
        );

    const food =
        restaurant?.foods?.find(
            item => item.name === foodName
        );

    if (!food) return;

    /*
       For now we only restore energy.
       Money deduction can be connected to the
       permanent player economy later.
    */

    if (typeof addEnergy === "function") {
        addEnergy(food.energy);
    }

    if (typeof addXP === "function") {
        addXP(5);
    }

    showGeneralPanel(
        "🍽️ Meal Purchased",
        `
            <div class="panel-card">

                <h3>
                    ${food.icon} ${food.name}
                </h3>

                <p>
                    You enjoyed your meal.
                </p>

                <div style="
                    display:flex;
                    gap:8px;
                    margin-top:12px;
                    flex-wrap:wrap;
                ">
                    <span class="badge">
                        ⚡ +${food.energy} Energy
                    </span>

                    <span class="badge">
                        ⭐ +5 XP
                    </span>
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
   UBA BANK
   ========================================================= */

function openUBABank() {

    showGeneralPanel(
        "🏦 UBA Bank",
        `
            <div class="panel-card">

                <h3>UBA</h3>

                <p>
                    Manage your student finances.
                </p>

                <div style="
                    display:grid;
                    gap:10px;
                    margin-top:15px;
                ">

                    <button class="btn btn-primary btn-block">
                        💰 Account Balance
                    </button>

                    <button class="btn btn-primary btn-block">
                        💳 Withdraw
                    </button>

                    <button class="btn btn-primary btn-block">
                        💵 Deposit
                    </button>

                    <button class="btn btn-primary btn-block">
                        📲 Transfer
                    </button>

                </div>

            </div>
        `
    );
}


/* =========================================================
   OTHER LOCATIONS
   ========================================================= */

function openArena() {

    showGeneralPanel(
        "⚔️ PNGPD Arena",
        `
            <div class="panel-card">
                <h3>PNGPD Arena</h3>
                <p>
                    Academic and skill battles will take place here.
                </p>
            </div>
        `
    );
}


function openShop() {

    showGeneralPanel(
        "🛒 PNGPD Shop",
        `
            <div class="panel-card">
                <h3>PNGPD Shop</h3>
                <p>
                    Items, school supplies and upgrades will be available here.
                </p>
            </div>
        `
    );
}


function openPropertyOffice() {

    showGeneralPanel(
        "🏘️ Property Office",
        `
            <div class="panel-card">
                <h3>Property Office</h3>
                <p>
                    Purchase properties around your virtual campus.
                </p>
            </div>
        `
    );
}


function openGarage() {

    showGeneralPanel(
        "🚗 Vehicle Garage",
        `
            <div class="panel-card">
                <h3>Vehicle Garage</h3>
                <p>
                    Manage your vehicles here.
                </p>
            </div>
        `
    );
}


function openTournament() {

    showGeneralPanel(
        "🏆 Tournament Ground",
        `
            <div class="panel-card">
                <h3>Academic Tournament</h3>
                <p>
                    Compete against other students and win XP.
                </p>
            </div>
        `
    );
}


/* =========================================================
   GLOBAL EXPORT
   ========================================================= */

window.enterLocation = enterLocation;
window.openPTILibrary = openPTILibrary;
window.openPGP126Lab = openPGP126Lab;
window.openHostels = openHostels;
window.openFoodCourt = openFoodCourt;
window.openRestaurant = openRestaurant;
window.openUBABank = openUBABank;