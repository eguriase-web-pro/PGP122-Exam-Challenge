// ============================================
// PNGPD LIVE - PLAYER SYSTEM
// game/player.js
// ============================================

const PLAYER_STORAGE_KEY = "pngpd_live_player_v2";

const DEFAULT_PLAYER = {
    id: null,
    name: "",
    email: "",
    nickname: "",
    avatar: "👨🏾‍🎓",

    level: 1,
    xp: 0,

    coins: 0,
    bank: 0,

    energy: 100,
    maxEnergy: 100,

    rating: "Rookie",
    assessmentScore: 0,

    streak: 0,
    missionsCompleted: 0,

    questionsAnswered: 0,
    correctAnswers: 0,

    inventory: [],
    properties: [],
    vehicles: [],

    notifications: [],

    stats: {
        studySessions: 0,
        battlesWon: 0,
        battlesLost: 0,
        tournamentsWon: 0,
        moneyEarned: 0,
        moneySpent: 0,
        totalXP: 0
    },

    settings: {
        sound: true,
        notifications: true
    },

    createdAt: null,
    lastPlayed: null
};


// ============================================
// LOAD PLAYER
// ============================================

function loadPlayer() {
    try {
        const saved = localStorage.getItem(PLAYER_STORAGE_KEY);

        if (!saved) {
            return createDefaultPlayer();
        }

        const parsed = JSON.parse(saved);

        const playerData = {
            ...DEFAULT_PLAYER,
            ...parsed,

            stats: {
                ...DEFAULT_PLAYER.stats,
                ...(parsed.stats || {})
            },

            settings: {
                ...DEFAULT_PLAYER.settings,
                ...(parsed.settings || {})
            },

            inventory: Array.isArray(parsed.inventory)
                ? parsed.inventory
                : [],

            properties: Array.isArray(parsed.properties)
                ? parsed.properties
                : [],

            vehicles: Array.isArray(parsed.vehicles)
                ? parsed.vehicles
                : [],

            notifications: Array.isArray(parsed.notifications)
                ? parsed.notifications
                : []
        };

        return playerData;

    } catch (error) {
        console.error("Could not load player:", error);
        return createDefaultPlayer();
    }
}


// ============================================
// CREATE PLAYER
// ============================================

function createDefaultPlayer() {
    const newPlayer = {
        ...DEFAULT_PLAYER,
        id: "PNGPD-" + Date.now(),
        createdAt: new Date().toISOString(),
        lastPlayed: new Date().toISOString(),

        stats: {
            ...DEFAULT_PLAYER.stats
        },

        settings: {
            ...DEFAULT_PLAYER.settings
        },

        inventory: [],
        properties: [],
        vehicles: [],
        notifications: []
    };

    savePlayer(newPlayer);

    return newPlayer;
}


// ============================================
// SAVE PLAYER
// ============================================

function savePlayer(playerData) {
    try {
        if (!playerData) return false;

        playerData.lastPlayed = new Date().toISOString();

        localStorage.setItem(
            PLAYER_STORAGE_KEY,
            JSON.stringify(playerData)
        );

        return true;

    } catch (error) {
        console.error("Could not save player:", error);
        return false;
    }
}


// ============================================
// GET ACTIVE PLAYER
// ============================================

function getActivePlayer() {
    try {
        if (typeof player !== "undefined" && player) {
            return player;
        }
    } catch (error) {}

    if (window.pngpdPlayer) {
        return window.pngpdPlayer;
    }

    return loadPlayer();
}


// ============================================
// XP SYSTEM
// ============================================

function getXPRequired(level) {
    return 1000 + ((level - 1) * 500);
}


function addXP(amount) {
    const currentPlayer = getActivePlayer();

    if (!currentPlayer || !amount || amount <= 0) {
        return;
    }

    currentPlayer.xp += Number(amount);

    currentPlayer.stats = currentPlayer.stats || {};
    currentPlayer.stats.totalXP =
        (currentPlayer.stats.totalXP || 0) + Number(amount);

    let levelUps = 0;

    while (
        currentPlayer.xp >= getXPRequired(currentPlayer.level)
    ) {
        currentPlayer.xp -= getXPRequired(currentPlayer.level);

        currentPlayer.level++;

        levelUps++;

        // Level-up reward
        currentPlayer.coins =
            Number(currentPlayer.coins || 0) + 1000000;
    }

    savePlayer(currentPlayer);

    updateHUD();

    if (levelUps > 0) {
        showPlayerToast(
            `🎉 LEVEL UP! You are now Level ${currentPlayer.level}! +₦1,000,000`
        );
    }

    return levelUps;
}


// ============================================
// MONEY SYSTEM
// ============================================

function addMoney(amount) {
    const currentPlayer = getActivePlayer();

    if (!currentPlayer || !amount || amount <= 0) {
        return false;
    }

    amount = Number(amount);

    currentPlayer.coins =
        Number(currentPlayer.coins || 0) + amount;

    currentPlayer.stats = currentPlayer.stats || {};

    currentPlayer.stats.moneyEarned =
        Number(currentPlayer.stats.moneyEarned || 0) + amount;

    savePlayer(currentPlayer);

    updateHUD();

    return true;
}


function removeMoney(amount) {
    const currentPlayer = getActivePlayer();

    if (!currentPlayer || !amount || amount <= 0) {
        return false;
    }

    amount = Number(amount);

    if (Number(currentPlayer.coins || 0) < amount) {
        return false;
    }

    currentPlayer.coins -= amount;

    currentPlayer.stats = currentPlayer.stats || {};

    currentPlayer.stats.moneySpent =
        Number(currentPlayer.stats.moneySpent || 0) + amount;

    savePlayer(currentPlayer);

    updateHUD();

    return true;
}


// ============================================
// ENERGY SYSTEM
// ============================================

function addEnergy(amount) {
    const currentPlayer = getActivePlayer();

    if (!currentPlayer || !amount) {
        return;
    }

    currentPlayer.energy = Math.min(
        Number(currentPlayer.maxEnergy || 100),
        Number(currentPlayer.energy || 0) + Number(amount)
    );

    savePlayer(currentPlayer);

    updateHUD();
}


function useEnergy(amount) {
    const currentPlayer = getActivePlayer();

    if (!currentPlayer || !amount || amount <= 0) {
        return false;
    }

    amount = Number(amount);

    if (Number(currentPlayer.energy || 0) < amount) {
        showPlayerToast("⚡ Not enough energy!");
        return false;
    }

    currentPlayer.energy -= amount;

    savePlayer(currentPlayer);

    updateHUD();

    return true;
}


// ============================================
// STREAK
// ============================================

function increaseStreak() {
    const currentPlayer = getActivePlayer();

    if (!currentPlayer) return;

    currentPlayer.streak =
        Number(currentPlayer.streak || 0) + 1;

    savePlayer(currentPlayer);

    updateHUD();
}


function resetStreak() {
    const currentPlayer = getActivePlayer();

    if (!currentPlayer) return;

    currentPlayer.streak = 0;

    savePlayer(currentPlayer);

    updateHUD();
}


// ============================================
// QUESTION STATISTICS
// ============================================

function recordQuestion(correct) {
    const currentPlayer = getActivePlayer();

    if (!currentPlayer) return;

    currentPlayer.questionsAnswered =
        Number(currentPlayer.questionsAnswered || 0) + 1;

    if (correct) {
        currentPlayer.correctAnswers =
            Number(currentPlayer.correctAnswers || 0) + 1;

        increaseStreak();
    } else {
        resetStreak();
    }

    savePlayer(currentPlayer);
}


// ============================================
// INVENTORY
// ============================================

function addInventoryItem(item) {
    const currentPlayer = getActivePlayer();

    if (!currentPlayer || !item) return false;

    currentPlayer.inventory =
        Array.isArray(currentPlayer.inventory)
            ? currentPlayer.inventory
            : [];

    currentPlayer.inventory.push(item);

    savePlayer(currentPlayer);

    return true;
}


function removeInventoryItem(itemId) {
    const currentPlayer = getActivePlayer();

    if (!currentPlayer) return false;

    const index = currentPlayer.inventory.findIndex(
        item =>
            item &&
            (item.id === itemId || item === itemId)
    );

    if (index === -1) {
        return false;
    }

    currentPlayer.inventory.splice(index, 1);

    savePlayer(currentPlayer);

    return true;
}


// ============================================
// PROPERTY SYSTEM
// ============================================

function addProperty(property) {
    const currentPlayer = getActivePlayer();

    if (!currentPlayer || !property) return false;

    currentPlayer.properties =
        Array.isArray(currentPlayer.properties)
            ? currentPlayer.properties
            : [];

    currentPlayer.properties.push(property);

    savePlayer(currentPlayer);

    return true;
}


// ============================================
// VEHICLE SYSTEM
// ============================================

function addVehicle(vehicle) {
    const currentPlayer = getActivePlayer();

    if (!currentPlayer || !vehicle) return false;

    currentPlayer.vehicles =
        Array.isArray(currentPlayer.vehicles)
            ? currentPlayer.vehicles
            : [];

    currentPlayer.vehicles.push(vehicle);

    savePlayer(currentPlayer);

    return true;
}


// ============================================
// RATING
// ============================================

function updatePlayerRating(score) {
    const currentPlayer = getActivePlayer();

    if (!currentPlayer) return;

    score = Number(score || 0);

    currentPlayer.assessmentScore = score;

    if (score >= 80) {
        currentPlayer.rating = "PNGPD Legend";
    } else if (score >= 60) {
        currentPlayer.rating = "Elite";
    } else if (score >= 40) {
        currentPlayer.rating = "Skilled";
    } else if (score >= 20) {
        currentPlayer.rating = "Trainee";
    } else {
        currentPlayer.rating = "Rookie";
    }

    savePlayer(currentPlayer);
}


// ============================================
// FORMAT MONEY
// ============================================

function formatMoney(amount) {
    amount = Number(amount || 0);

    return "₦" + amount.toLocaleString("en-NG");
}


// ============================================
// HUD UPDATE
// ============================================

function updateHUD() {
    const currentPlayer = getActivePlayer();

    if (!currentPlayer) return;

    const elements = {
        name: document.getElementById("hudName"),
        level: document.getElementById("hudLevel"),
        coins: document.getElementById("hudCoins"),
        bank: document.getElementById("hudBank"),
        energy: document.getElementById("hudEnergy"),
        streak: document.getElementById("hudStreak"),
        xp: document.getElementById("hudXP"),
        rating: document.getElementById("hudRating")
    };

    if (elements.name) {
        elements.name.textContent =
            currentPlayer.nickname ||
            currentPlayer.name ||
            "PNGPD Student";
    }

    if (elements.level) {
        elements.level.textContent =
            "Lv. " + currentPlayer.level;
    }

    if (elements.coins) {
        elements.coins.textContent =
            formatMoney(currentPlayer.coins);
    }

    if (elements.bank) {
        elements.bank.textContent =
            formatMoney(currentPlayer.bank);
    }

    if (elements.energy) {
        elements.energy.textContent =
            `${currentPlayer.energy}/${currentPlayer.maxEnergy}`;
    }

    if (elements.streak) {
        elements.streak.textContent =
            currentPlayer.streak;
    }

    if (elements.xp) {
        const required =
            getXPRequired(currentPlayer.level);

        elements.xp.textContent =
            `${currentPlayer.xp}/${required}`;
    }

    if (elements.rating) {
        elements.rating.textContent =
            currentPlayer.rating;
    }

    // XP progress bar
    const xpBar =
        document.getElementById("xpBar");

    if (xpBar) {
        const required =
            getXPRequired(currentPlayer.level);

        const percentage =
            Math.min(
                100,
                (currentPlayer.xp / required) * 100
            );

        xpBar.style.width =
            percentage + "%";
    }

    // Energy bar
    const energyBar =
        document.getElementById("energyBar");

    if (energyBar) {
        const percentage =
            (currentPlayer.energy /
                currentPlayer.maxEnergy) * 100;

        energyBar.style.width =
            Math.max(0, percentage) + "%";
    }
}


// ============================================
// RESET PLAYER
// ============================================

function resetPlayer() {
    const confirmed = confirm(
        "Reset your entire PNGPD LIVE account?\n\nAll progress, money, XP, properties and vehicles will be deleted."
    );

    if (!confirmed) {
        return false;
    }

    localStorage.removeItem(PLAYER_STORAGE_KEY);

    const newPlayer = createDefaultPlayer();

    window.pngpdPlayer = newPlayer;

    try {
        if (typeof player !== "undefined") {
            player = newPlayer;
        }
    } catch (error) {}

    updateHUD();

    location.reload();

    return true;
}


// ============================================
// TOAST HELPER
// ============================================

function showPlayerToast(message) {
    const container =
        document.getElementById("toastContainer");

    if (!container) {
        console.log(message);
        return;
    }

    const toast =
        document.createElement("div");

    toast.className = "toast";

    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add("hide");

        setTimeout(() => {
            toast.remove();
        }, 300);

    }, 3000);
}


// ============================================
// ENERGY REGENERATION
// ============================================

setInterval(() => {
    const currentPlayer = getActivePlayer();

    if (!currentPlayer) return;

    if (
        currentPlayer.energy <
        currentPlayer.maxEnergy
    ) {
        currentPlayer.energy++;

        savePlayer(currentPlayer);

        updateHUD();
    }

}, 60000);


// ============================================
// INITIALISE PLAYER DATA
// ============================================

window.pngpdPlayer = loadPlayer();


// ============================================
// GLOBAL API
// ============================================

window.pngpdPlayerSystem = {
    loadPlayer,
    savePlayer,
    createDefaultPlayer,

    getXPRequired,
    addXP,

    addMoney,
    removeMoney,

    addEnergy,
    useEnergy,

    increaseStreak,
    resetStreak,
    recordQuestion,

    addInventoryItem,
    removeInventoryItem,

    addProperty,
    addVehicle,

    updatePlayerRating,

    formatMoney,
    updateHUD,

    resetPlayer
};


// Initial HUD update when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        updateHUD();
    }, 100);
});