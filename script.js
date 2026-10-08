let assessmentQuestions = [];
let assessmentIndex = 0;
let assessmentScore = 0;
let selectedAssessmentAnswer = null;

let currentQuestion = null;
let currentQuestionIndex = 0;


/* ================= STARTUP ================= */

document.addEventListener("DOMContentLoaded", () => {

    startLoading();

});


function startLoading() {

    let progress = 0;

    const interval = setInterval(() => {

        progress += 10;

        document.getElementById(
            "loadingProgress"
        ).style.width = progress + "%";

        if (progress >= 100) {

            clearInterval(interval);

            setTimeout(() => {

                document.getElementById(
                    "splashScreen"
                ).classList.add("hidden");

                initializeApplication();

            }, 400);
        }

    }, 120);

}


function initializeApplication() {

    if (loadPlayer()) {

        enterGame();

    } else {

        document.getElementById(
            "startScreen"
        ).classList.remove("hidden");

    }

    setupButtons();
}


/* ================= BUTTONS ================= */

function setupButtons() {

    document.getElementById(
        "startGameBtn"
    ).onclick = () => {

        document.getElementById(
            "startScreen"
        ).classList.add("hidden");

        document.getElementById(
            "registrationScreen"
        ).classList.remove("hidden");

    };


    document.getElementById(
        "continueRegistration"
    ).onclick = beginRegistration;


    document.getElementById(
        "nextAssessment"
    ).onclick = nextAssessment;


    document.getElementById(
        "enterCampusBtn"
    ).onclick = enterGame;


    document.getElementById(
        "closeModal"
    ).onclick = closeModal;


    document.getElementById(
        "closeQuestionModal"
    ).onclick = closeQuestionModal;


    document.querySelectorAll(
        ".nav-btn"
    ).forEach(button => {

        button.addEventListener("click", () => {

            document.querySelectorAll(
                ".nav-btn"
            ).forEach(btn =>
                btn.classList.remove("active")
            );

            button.classList.add("active");

            showPanel(
                button.dataset.panel
            );

        });

    });
}


/* ================= REGISTRATION ================= */

function beginRegistration() {

    const name =
        document.getElementById(
            "playerName"
        ).value.trim();

    const email =
        document.getElementById(
            "playerEmail"
        ).value.trim();

    const nickname =
        document.getElementById(
            "playerNickname"
        ).value.trim();

    const error =
        document.getElementById(
            "registrationError"
        );

    if (!name || !email || !nickname) {

        error.textContent =
            "Please complete all fields.";

        return;
    }

    if (!email.includes("@")) {

        error.textContent =
            "Enter a valid email.";

        return;
    }

    player.name = name;
    player.email = email;
    player.nickname = nickname;
    player.createdAt = Date.now();

    savePlayer();

    startAssessment();
}


/* ================= ASSESSMENT ================= */

function startAssessment() {

    assessmentQuestions =
        [...PNGPD_QUESTIONS]
        .sort(() => Math.random() - .5)
        .slice(0, 15);

    assessmentIndex = 0;
    assessmentScore = 0;
    selectedAssessmentAnswer = null;

    document.getElementById(
        "registrationScreen"
    ).classList.add("hidden");

    document.getElementById(
        "assessmentScreen"
    ).classList.remove("hidden");

    document.getElementById(
        "assessmentTotal"
    ).textContent =
        assessmentQuestions.length;

    showAssessmentQuestion();
}


function showAssessmentQuestion() {

    const question =
        assessmentQuestions[
            assessmentIndex
        ];

    selectedAssessmentAnswer = null;

    document.getElementById(
        "nextAssessment"
    ).disabled = true;

    document.getElementById(
        "assessmentNumber"
    ).textContent =
        assessmentIndex + 1;

    document.getElementById(
        "assessmentQuestion"
    ).textContent =
        question.question;

    const options =
        document.getElementById(
            "assessmentOptions"
        );

    options.innerHTML = "";

    question.options.forEach(
        (option, index) => {

            const button =
                document.createElement("button");

            button.className = "option";

            button.textContent = option;

            button.onclick = () => {

                document
                    .querySelectorAll(
                        "#assessmentOptions .option"
                    )
                    .forEach(
                        b => b.classList.remove(
                            "selected"
                        )
                    );

                button.classList.add("selected");

                selectedAssessmentAnswer =
                    index;

                document.getElementById(
                    "nextAssessment"
                ).disabled = false;

            };

            options.appendChild(button);

        }
    );

    const progress =
        ((assessmentIndex) /
            assessmentQuestions.length) *
        100;

    document.getElementById(
        "assessmentProgress"
    ).style.width =
        progress + "%";
}


function nextAssessment() {

    if (selectedAssessmentAnswer === null)
        return;

    const question =
        assessmentQuestions[
            assessmentIndex
        ];

    if (
        selectedAssessmentAnswer ===
        question.answer
    ) {

        assessmentScore++;

    }

    assessmentIndex++;

    if (
        assessmentIndex >=
        assessmentQuestions.length
    ) {

        finishAssessment();

    } else {

        showAssessmentQuestion();

    }
}


function finishAssessment() {

    player.assessmentScore =
        assessmentScore;

    let rating;
    let capital;

    if (assessmentScore <= 3) {

        rating = "Rookie";
        capital = 500000;

    } else if (assessmentScore <= 6) {

        rating = "Trainee";
        capital = 1000000;

    } else if (assessmentScore <= 9) {

        rating = "Skilled";
        capital = 2500000;

    } else if (assessmentScore <= 12) {

        rating = "Elite";
        capital = 5000000;

    } else {

        rating = "PNGPD Legend";
        capital = 10000000;

    }

    player.rating = rating;
    player.coins = capital;

    savePlayer();

    document.getElementById(
        "assessmentScreen"
    ).classList.add("hidden");

    document.getElementById(
        "assessmentResultScreen"
    ).classList.remove("hidden");

    document.getElementById(
        "resultScore"
    ).textContent =
        `${assessmentScore}/15`;

    document.getElementById(
        "resultRating"
    ).textContent =
        rating;

    document.getElementById(
        "resultMoney"
    ).textContent =
        formatMoney(capital);
}


/* ================= GAME ================= */

function enterGame() {

    document.getElementById(
        "startScreen"
    ).classList.add("hidden");

    document.getElementById(
        "registrationScreen"
    ).classList.add("hidden");

    document.getElementById(
        "assessmentScreen"
    ).classList.add("hidden");

    document.getElementById(
        "assessmentResultScreen"
    ).classList.add("hidden");

    document.getElementById(
        "gameScreen"
    ).classList.remove("hidden");

    updateHUD();
    initializeWorld();

    showToast(
        `Welcome to PNGPD LIVE, ${player.nickname || player.name}!`
    );
}


/* ================= QUESTIONS ================= */

function openQuestion() {

    if (!useEnergy(5))
        return;

    if (!PNGPD_QUESTIONS.length)
        return;

    currentQuestionIndex =
        Math.floor(
            Math.random() *
            PNGPD_QUESTIONS.length
        );

    currentQuestion =
        PNGPD_QUESTIONS[
            currentQuestionIndex
        ];

    document.getElementById(
        "questionModal"
    ).classList.remove("hidden");

    document.getElementById(
        "gameQuestion"
    ).textContent =
        currentQuestion.question;

    document.getElementById(
        "questionExplanation"
    ).classList.add("hidden");

    const options =
        document.getElementById(
            "gameOptions"
        );

    options.innerHTML = "";

    currentQuestion.options.forEach(
        (option, index) => {

            const button =
                document.createElement("button");

            button.className = "option";
            button.textContent = option;

            button.onclick = () => {

                answerQuestion(
                    index,
                    button
                );

            };

            options.appendChild(button);

        }
    );
}


function answerQuestion(index, button) {

    const buttons =
        document.querySelectorAll(
            "#gameOptions .option"
        );

    buttons.forEach(
        b => b.disabled = true
    );

    player.questionsAnswered++;

    if (index === currentQuestion.answer) {

        button.classList.add("correct");

        player.correctAnswers++;

        addMoney(250000);
        addXP(250);

        showToast(
            "✅ Correct! +₦250,000 +250 XP"
        );

    } else {

        button.classList.add("wrong");

        buttons[
            currentQuestion.answer
        ].classList.add("correct");

        showToast(
            "❌ Wrong answer."
        );

    }

    document.getElementById(
        "questionExplanation"
    ).innerHTML =
        `<strong>Explanation:</strong><br>${currentQuestion.explanation}`;

    document.getElementById(
        "questionExplanation"
    ).classList.remove("hidden");

    savePlayer();
}


/* ================= PANELS ================= */

function showPanel(type) {

    let html = "";

    if (type === "profile") {

        html = `
            <h2 class="panel-title">👤 Player Profile</h2>

            <div class="stat-grid">

                <div class="stat-box">
                    <span>Name</span>
                    <strong>${player.name}</strong>
                </div>

                <div class="stat-box">
                    <span>Nickname</span>
                    <strong>${player.nickname}</strong>
                </div>

                <div class="stat-box">
                    <span>Level</span>
                    <strong>${player.level}</strong>
                </div>

                <div class="stat-box">
                    <span>Rating</span>
                    <strong>${player.rating}</strong>
                </div>

                <div class="stat-box">
                    <span>Wallet</span>
                    <strong>${formatMoney(player.coins)}</strong>
                </div>

                <div class="stat-box">
                    <span>Bank</span>
                    <strong>${formatMoney(player.bank)}</strong>
                </div>

                <div class="stat-box">
                    <span>Questions</span>
                    <strong>${player.questionsAnswered}</strong>
                </div>

                <div class="stat-box">
                    <span>Correct</span>
                    <strong>${player.correctAnswers}</strong>
                </div>

            </div>
        `;
    }


    if (type === "missions") {

        html = `
            <h2 class="panel-title">🎯 Missions</h2>
        `;

        MISSIONS.forEach(mission => {

            const progress =
                Math.min(
                    getMissionProgress(mission),
                    mission.target
                );

            const claimed =
                localStorage.getItem(
                    `mission_${mission.id}`
                );

            html += `
                <div class="mission">

                    <strong>${mission.title}</strong>

                    <p>${mission.description}</p>

                    <p>
                        Progress:
                        ${progress}/${mission.target}
                    </p>

                    <p>
                        Reward:
                        ${formatMoney(mission.reward)}
                    </p>

                    ${
                        claimed
                        ? `<button class="menu-button" disabled>
                            ✓ Claimed
                           </button>`
                        : isMissionComplete(mission)
                        ? `<button
                            class="menu-button"
                            onclick="claimMission('${mission.id}')">
                            CLAIM REWARD
                           </button>`
                        : ""
                    }

                </div>
            `;

        });

    }


    if (type === "ranks") {

        html = `
            <h2 class="panel-title">🏆 Rankings</h2>

            <div class="stat-box">

                <span>Your Academic Rating</span>

                <strong>
                    ${player.rating}
                </strong>

                <p style="color:#9eafc2;margin-top:10px;">
                    Global multiplayer rankings will be
                    connected when the PNGPD LIVE database
                    is activated.
                </p>

            </div>
        `;
    }


    if (type === "items") {

        html = `
            <h2 class="panel-title">🎒 Inventory</h2>
        `;

        if (!player.inventory.length) {

            html += `
                <p style="color:#9eafc2;">
                    Your inventory is empty.
                </p>
            `;

        } else {

            player.inventory.forEach(item => {

                html += `
                    <div class="mission">
                        🎒 ${item.name}
                    </div>
                `;

            });

        }
    }


    if (type === "bank") {

        html = `
            <h2 class="panel-title">🏦 PNGPD Bank</h2>

            <div class="stat-box">
                <span>Bank Balance</span>
                <strong>
                    ${formatMoney(player.bank)}
                </strong>
            </div>

            <button
                class="menu-button"
                onclick="depositPrompt()">
                💰 Deposit Money
            </button>

            <button
                class="menu-button"
                onclick="withdrawPrompt()">
                💵 Withdraw Money
            </button>
        `;
    }


    if (type === "shop") {

        html = `
            <h2 class="panel-title">🛒 Campus Shop</h2>

            <div class="mission">

                <strong>⚡ Energy Drink</strong>

                <p>
                    Restores 25 energy.
                </p>

                <p>
                    Price: ₦100,000
                </p>

                <button
                    class="menu-button"
                    onclick="buyEnergyDrink()">
                    BUY
                </button>

            </div>

            <div class="mission">

                <strong>🎓 Study Pack</strong>

                <p>
                    A fictional academic upgrade.
                </p>

                <p>
                    Price: ₦500,000
                </p>

                <button
                    class="menu-button"
                    onclick="buyItem('Study Pack',500000)">
                    BUY
                </button>

            </div>
        `;
    }


    if (type === "department") {

        html = `
            <h2 class="panel-title">
                🏢 PNGPD Department
            </h2>

            <p style="color:#9eafc2;line-height:1.6;">
                Welcome to the PNGPD Department.
                Complete academic missions, participate
                in department activities and build your
                reputation.
            </p>

            <button
                class="menu-button"
                onclick="openQuestion()">
                📚 Take PGP 122 Challenge
            </button>
        `;
    }


    if (type === "lab") {

        html = `
            <h2 class="panel-title">
                🧪 Process Laboratory
            </h2>

            <p style="color:#9eafc2;line-height:1.6;">
                Practical engineering challenges will
                appear here in future updates.
            </p>

            <button
                class="menu-button"
                onclick="openQuestion()">
                🧠 Attempt Technical Question
            </button>
        `;
    }


    if (type === "menu") {

        html = `
            <h2 class="panel-title">☰ Game Menu</h2>

            <button
                class="menu-button"
                onclick="showToast('⚙️ Settings coming soon.')">
                ⚙️ Settings
            </button>

            <button
                class="menu-button"
                onclick="showToast('🌙 Day/night system coming soon.')">
                🌙 World
            </button>

            <button
                class="menu-button"
                onclick="resetPlayer()">
                🔄 Reset Local Player
            </button>
        `;
    }


    document.getElementById(
        "modalContent"
    ).innerHTML = html;

    document.getElementById(
        "gameModal"
    ).classList.remove("hidden");
}


function closeModal() {

    document.getElementById(
        "gameModal"
    ).classList.add("hidden");
}


function closeQuestionModal() {

    document.getElementById(
        "questionModal"
    ).classList.add("hidden");
}


/* ================= BANK ================= */

function depositPrompt() {

    const amount =
        prompt("How much do you want to deposit?");

    if (amount) {

        depositMoney(amount);

        showPanel("bank");

    }
}


function withdrawPrompt() {

    const amount =
        prompt("How much do you want to withdraw?");

    if (amount) {

        withdrawMoney(amount);

        showPanel("bank");

    }
}


/* ================= SHOP ================= */

function buyEnergyDrink() {

    if (!removeMoney(100000)) {

        showToast(
            "❌ Not enough money."
        );

        return;
    }

    addEnergy(25);

    showToast(
        "🥤 Energy Drink purchased! +25 Energy"
    );
}


/* ================= TOAST ================= */

function showToast(message) {

    const container =
        document.getElementById(
            "toastContainer"
        );

    const toast =
        document.createElement("div");

    toast.className = "toast";

    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => {

        toast.remove();

    }, 3500);
}