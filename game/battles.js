let battleState = {
    active: false,
    score: 0,
    questionIndex: 0
};

function startBattle() {

    if (!useEnergy(20)) return;

    battleState.active = true;
    battleState.score = 0;
    battleState.questionIndex = 0;

    showToast("⚔️ Academic Battle started!");

    openQuestion();
}

function calculateBattleReward() {

    return 250000 +
        (battleState.score * 100000);
}

function endBattle() {

    battleState.active = false;

    const reward =
        calculateBattleReward();

    addMoney(reward);
    addXP(battleState.score * 200);

    showToast(
        `🏆 Battle finished! +${formatMoney(reward)}`
    );
}