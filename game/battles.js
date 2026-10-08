// PNGPD LIVE - Battle System

const BATTLE_STORAGE_KEY = "pngpd_live_battles_v1";

const DEFAULT_BATTLE = {
    active: false,
    opponent: null,
    playerScore: 0,
    opponentScore: 0,
    questionIndex: 0,
    totalQuestions: 5,
    questions: [],
    history: []
};

function loadBattle() {
    try {
        const saved = localStorage.getItem(BATTLE_STORAGE_KEY);

        if (!saved) {
            return { ...DEFAULT_BATTLE };
        }

        return {
            ...DEFAULT_BATTLE,
            ...JSON.parse(saved)
        };
    } catch (error) {
        console.error("Battle load error:", error);
        return { ...DEFAULT_BATTLE };
    }
}

function saveBattle(battle) {
    localStorage.setItem(
        BATTLE_STORAGE_KEY,
        JSON.stringify(battle)
    );
}

function getBattleQuestions(count = 5) {
    if (
        typeof questions === "undefined" ||
        !Array.isArray(questions) ||
        questions.length === 0
    ) {
        return [];
    }

    const shuffled = [...questions].sort(() => Math.random() - 0.5);

    return shuffled.slice(0, count);
}

function createOpponent() {
    const opponents = [
        {
            name: "AI Challenger",
            avatar: "🤖",
            level: 1,
            difficulty: 0.45
        },
        {
            name: "Campus Scholar",
            avatar: "👨🏾‍🎓",
            level: 2,
            difficulty: 0.55
        },
        {
            name: "Engineering Ace",
            avatar: "🧑🏾‍🔬",
            level: 3,
            difficulty: 0.65
        },
        {
            name: "PNGPD Elite",
            avatar: "🧑🏾‍💼",
            level: 5,
            difficulty: 0.75
        }
    ];

    return opponents[
        Math.floor(Math.random() * opponents.length)
    ];
}

function startBattle() {
    const player = getActivePlayer();

    if (!player) {
        showPlayerToast("Player data not found.");
        return;
    }

    if (player.energy < 10) {
        showPlayerToast("You need at least 10 energy to battle.");
        return;
    }

    useEnergy(10);

    const battle = {
        ...DEFAULT_BATTLE,
        active: true,
        opponent: createOpponent(),
        questions: getBattleQuestions(5)
    };

    if (battle.questions.length === 0) {
        showPlayerToast("No battle questions available.");
        return;
    }

    saveBattle(battle);

    showBattleQuestion();
}

function showBattleQuestion() {
    const battle = loadBattle();

    if (!battle.active) {
        return;
    }

    if (battle.questionIndex >= battle.questions.length) {
        finishBattle();
        return;
    }

    const question = battle.questions[battle.questionIndex];

    const modal = document.getElementById("questionModal");
    const topic = document.getElementById("questionModalTopic");
    const difficulty = document.getElementById("questionDifficulty");
    const questionText = document.getElementById("questionModalText");
    const options = document.getElementById("questionModalOptions");
    const explanation = document.getElementById("questionExplanation");

    if (!modal || !questionText || !options) {
        return;
    }

    if (topic) {
        topic.textContent = question.topic || "Battle Question";
    }

    if (difficulty) {
        difficulty.textContent =
            question.difficulty || "Battle";
    }

    questionText.textContent = question.question;

    options.innerHTML = "";
    explanation.innerHTML = "";

    question.options.forEach((option, index) => {
        const button = document.createElement("button");

        button.className = "question-option";
        button.textContent = option;

        button.addEventListener("click", () => {
            answerBattleQuestion(index);
        });

        options.appendChild(button);
    });

    modal.classList.add("active");
}

function answerBattleQuestion(answerIndex) {
    const battle = loadBattle();

    if (!battle.active) {
        return;
    }

    const question = battle.questions[battle.questionIndex];

    const correctAnswer =
        question.answer !== undefined
            ? question.answer
            : question.correctAnswer;

    const isCorrect =
        answerIndex === correctAnswer ||
        answerIndex === Number(correctAnswer);

    const player = getActivePlayer();

    if (isCorrect) {
        battle.playerScore++;

        addXP(100);
        addMoney(50000);

        if (typeof recordQuestion === "function") {
            recordQuestion(true);
        }

        if (
            window.pngpdMissions &&
            typeof window.pngpdMissions.questionAnswered === "function"
        ) {
            window.pngpdMissions.questionAnswered(true);
        }

        showPlayerToast("Correct! +100 XP +₦50,000");
    } else {
        if (typeof recordQuestion === "function") {
            recordQuestion(false);
        }

        if (
            window.pngpdMissions &&
            typeof window.pngpdMissions.questionAnswered === "function"
        ) {
            window.pngpdMissions.questionAnswered(false);
        }

        showPlayerToast("Wrong answer!");
    }

    const opponent = battle.opponent;

    if (Math.random() < opponent.difficulty) {
        battle.opponentScore++;
    }

    battle.questionIndex++;

    saveBattle(battle);

    setTimeout(() => {
        showBattleQuestion();
    }, 600);
}

function finishBattle() {
    const battle = loadBattle();
    const player = getActivePlayer();

    const modal = document.getElementById("questionModal");

    if (modal) {
        modal.classList.remove("active");
    }

    if (!player) {
        return;
    }

    let resultMessage = "";

    if (battle.playerScore > battle.opponentScore) {
        player.stats.battlesWon++;

        addXP(500);
        addMoney(200000);

        resultMessage =
            `🏆 Victory! ${battle.playerScore} - ${battle.opponentScore}. ` +
            `You earned 500 XP and ₦200,000.`;

    } else if (battle.playerScore < battle.opponentScore) {
        player.stats.battlesLost++;

        resultMessage =
            `💀 Defeat. ${battle.playerScore} - ${battle.opponentScore}. ` +
            `Train harder and try again.`;

    } else {
        addXP(200);
        addMoney(75000);

        resultMessage =
            `🤝 Draw! ${battle.playerScore} - ${battle.opponentScore}. ` +
            `You earned 200 XP and ₦75,000.`;
    }

    battle.history.push({
        opponent: battle.opponent.name,
        playerScore: battle.playerScore,
        opponentScore: battle.opponentScore,
        result:
            battle.playerScore > battle.opponentScore
                ? "win"
                : battle.playerScore < battle.opponentScore
                ? "loss"
                : "draw",
        date: new Date().toISOString()
    });

    if (battle.history.length > 20) {
        battle.history.shift();
    }

    battle.active = false;
    saveBattle(battle);

    savePlayer();
    updateHUD();

    showPlayerToast(resultMessage);

    setTimeout(() => {
        showBattleResult(
            battle.playerScore,
            battle.opponentScore,
            battle.opponent
        );
    }, 300);
}

function showBattleResult(playerScore, opponentScore, opponent) {
    const content = `
        <div class="battle-result">
            <h2>⚔️ Battle Complete</h2>

            <div class="battle-players">
                <div>
                    <div style="font-size:40px;">👨🏾‍🎓</div>
                    <strong>${getActivePlayer().name || "You"}</strong>
                    <h2>${playerScore}</h2>
                </div>

                <div style="font-size:30px;">VS</div>

                <div>
                    <div style="font-size:40px;">${opponent.avatar}</div>
                    <strong>${opponent.name}</strong>
                    <h2>${opponentScore}</h2>
                </div>
            </div>

            <button
                class="primary-btn"
                onclick="closeGeneralModal()"
            >
                Continue
            </button>
        </div>
    `;

    if (typeof openGeneralModal === "function") {
        openGeneralModal("Battle Result", content);
    } else {
        alert(
            `Battle Result\n\n` +
            `You: ${playerScore}\n` +
            `${opponent.name}: ${opponentScore}`
        );
    }
}

function getBattleHistory() {
    return loadBattle().history || [];
}

function resetBattles() {
    localStorage.removeItem(BATTLE_STORAGE_KEY);
}

window.pngpdBattles = {
    startBattle,
    answerBattleQuestion,
    finishBattle,
    getBattleHistory,
    resetBattles
};

document.addEventListener("DOMContentLoaded", () => {
    loadBattle();
});