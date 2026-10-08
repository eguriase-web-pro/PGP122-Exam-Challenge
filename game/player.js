const PLAYER_STORAGE_KEY = "pngpd_live_player_v2";

let player = {
    name: "",
    email: "",
    nickname: "",
    avatar: "👨🏽‍🎓",

    level: 1,
    xp: 0,

    coins: 0,
    bank: 0,

    energy: 100,

    rating: "Rookie",
    assessmentScore: 0,

    streak: 0,

    missionsCompleted: 0,
    questionsAnswered: 0,
    correctAnswers: 0,

    inventory: [],

    createdAt: null
};

function savePlayer() {
    localStorage.setItem(
        PLAYER_STORAGE_KEY,
        JSON.stringify(player)
    );
}

function loadPlayer() {

    const saved = localStorage.getItem(PLAYER_STORAGE_KEY);

    if (!saved) return false;

    try {
        player = {
            ...player,
            ...JSON.parse(saved)
        };

        return true;

    } catch {
        return false;
    }
}

function resetPlayer() {
    localStorage.removeItem(PLAYER_STORAGE_KEY);
    location.reload();
}

function addXP(amount) {

    player.xp += amount;

    let required = getXPRequired();

    while (player.xp >= required) {

        player.xp -= required;
        player.level++;

        addMoney(1000000);

        showToast(
            `🎉 LEVEL UP! You reached Level ${player.level}`
        );

        required = getXPRequired();
    }

    savePlayer();
    updateHUD();
}

function getXPRequired() {
    return 1000 + ((player.level - 1) * 500);
}

function addMoney(amount) {
    player.coins += amount;
    savePlayer();
    updateHUD();
}

function removeMoney(amount) {

    if (player.coins < amount) {
        return false;
    }

    player.coins -= amount;

    savePlayer();
    updateHUD();

    return true;
}

function addEnergy(amount) {

    player.energy = Math.min(
        100,
        player.energy + amount
    );

    savePlayer();
    updateHUD();
}

function useEnergy(amount) {

    if (player.energy < amount) {
        showToast("⚡ Not enough energy!");
        return false;
    }

    player.energy -= amount;

    savePlayer();
    updateHUD();

    return true;
}

function updateHUD() {

    const name = player.nickname || player.name || "PLAYER";

    const nameElement =
        document.getElementById("hudPlayerName");

    const tagElement =
        document.getElementById("playerNameTag");

    if (nameElement)
        nameElement.textContent = name;

    if (tagElement)
        tagElement.textContent = name.toUpperCase();

    document.getElementById("hudLevel").textContent =
        player.level;

    document.getElementById("hudCoins").textContent =
        formatMoney(player.coins);

    document.getElementById("hudEnergy").textContent =
        player.energy;

    document.getElementById("hudXP").textContent =
        `${player.xp} XP`;

    const required = getXPRequired();

    const percentage =
        Math.min(100, (player.xp / required) * 100);

    document.getElementById("hudXPBar").style.width =
        percentage + "%";
}

function formatMoney(amount) {

    return "₦" + Number(amount).toLocaleString("en-NG");
}