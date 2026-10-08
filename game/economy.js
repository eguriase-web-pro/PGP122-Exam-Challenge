// ============================================
// PNGPD LIVE - ECONOMY SYSTEM
// game/economy.js
// ============================================

const ECONOMY_STORAGE_KEY = "pngpd_live_economy_v1";


// ============================================
// DEFAULT ECONOMY DATA
// ============================================

const DEFAULT_ECONOMY = {
    transactions: [],
    prices: {
        "study-pack": 250000,
        "energy-drink": 100000,
        "academic-kit": 500000,

        "student-room": 2000000,
        "starter-house": 10000000,
        "executive-estate": 50000000,

        "student-bike": 3000000,
        "campus-car": 15000000,
        "executive-suv": 40000000
    }
};


// ============================================
// LOAD ECONOMY
// ============================================

function loadEconomy() {

    try {

        const saved =
            localStorage.getItem(ECONOMY_STORAGE_KEY);

        if (!saved) {

            const economy = {
                ...DEFAULT_ECONOMY,
                transactions: []
            };

            saveEconomy(economy);

            return economy;
        }

        const parsed = JSON.parse(saved);

        return {
            ...DEFAULT_ECONOMY,
            ...parsed,

            prices: {
                ...DEFAULT_ECONOMY.prices,
                ...(parsed.prices || {})
            },

            transactions:
                Array.isArray(parsed.transactions)
                    ? parsed.transactions
                    : []
        };

    } catch (error) {

        console.error(
            "Could not load economy:",
            error
        );

        return {
            ...DEFAULT_ECONOMY,
            transactions: []
        };
    }
}


// ============================================
// SAVE ECONOMY
// ============================================

function saveEconomy(economy) {

    try {

        localStorage.setItem(
            ECONOMY_STORAGE_KEY,
            JSON.stringify(economy)
        );

        return true;

    } catch (error) {

        console.error(
            "Could not save economy:",
            error
        );

        return false;
    }
}


// ============================================
// TRANSACTION LOG
// ============================================

function recordTransaction(
    type,
    amount,
    description
) {

    const economy = loadEconomy();

    economy.transactions.push({

        id:
            "TX-" +
            Date.now() +
            "-" +
            Math.floor(Math.random() * 10000),

        type: type,

        amount: Number(amount || 0),

        description:
            description || "Game transaction",

        timestamp:
            new Date().toISOString()
    });

    // Keep only the latest 500 transactions
    if (economy.transactions.length > 500) {

        economy.transactions =
            economy.transactions.slice(-500);
    }

    saveEconomy(economy);
}


// ============================================
// DEPOSIT
// ============================================

function depositMoney(amount) {

    const currentPlayer =
        getActivePlayer();

    amount = Number(amount);

    if (!currentPlayer) {
        return false;
   