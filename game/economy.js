function depositMoney(amount) {

    amount = Number(amount);

    if (!amount || amount <= 0) {
        showToast("Enter a valid amount.");
        return;
    }

    if (player.coins < amount) {
        showToast("❌ You don't have enough money.");
        return;
    }

    player.coins -= amount;
    player.bank += amount;

    savePlayer();
    updateHUD();

    showToast(
        `🏦 ${formatMoney(amount)} deposited.`
    );
}

function withdrawMoney(amount) {

    amount = Number(amount);

    if (!amount || amount <= 0) {
        showToast("Enter a valid amount.");
        return;
    }

    if (player.bank < amount) {
        showToast("❌ Insufficient bank balance.");
        return;
    }

    player.bank -= amount;
    player.coins += amount;

    savePlayer();
    updateHUD();

    showToast(
        `💰 ${formatMoney(amount)} withdrawn.`
    );
}

function buyItem(name, price) {

    if (!removeMoney(price)) {
        showToast("❌ Not enough money.");
        return;
    }

    player.inventory.push({
        name,
        purchasedAt: Date.now()
    });

    savePlayer();

    showToast(`🛒 Purchased ${name}!`);
}