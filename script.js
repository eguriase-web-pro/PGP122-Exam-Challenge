/* =========================================================
   PNGPD LIVE — MAIN GAME ENGINE
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       GLOBAL STATE
    ===================================================== */

    let player = typeof loadPlayer === "function"
        ? loadPlayer()
        : null;

    let selectedAvatar = "👨🏽‍🎓";

    let assessmentQuestions = [];
    let assessmentAnswers = [];
    let markedQuestions = [];
    let currentQuestion = 0;

    let assessmentTime = 60 * 60;
    let assessmentTimerInterval = null;
    let assessmentStartedAt = null;
    let assessmentSubmitted = false;

    let normalQuestion = null;
    let normalQuestionIndex = 0;

    const $ = id => document.getElementById(id);

    const screens = [
        "splashScreen",
        "startScreen",
        "registrationScreen",
        "assessmentScreen",
        "assessmentResultScreen",
        "gameScreen"
    ];


    /* =====================================================
       BASIC HELPERS
    ===================================================== */

    function showScreen(id) {
        screens.forEach(screen => {
            const el = $(screen);
            if (el) el.classList.add("hidden");
        });

        const target = $(id);
        if (target) target.classList.remove("hidden");
    }


    function toast(message, type = "info") {
        const container = $("toastContainer");

        if (!container) return;

        const toastEl = document.createElement("div");

        toastEl.className = `toast toast-${type}`;
        toastEl.textContent = message;

        container.appendChild(toastEl);

        setTimeout(() => {
            toastEl.classList.add("toast-hide");

            setTimeout(() => {
                toastEl.remove();
            }, 300);
        }, 3000);
    }


    function formatNumber(number) {
        return Number(number || 0).toLocaleString("en-NG");
    }


    function formatCurrency(number) {
        return `₦${formatNumber(number)}`;
    }


    function clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    }


    function saveCurrentPlayer() {
        if (typeof savePlayer === "function") {
            savePlayer(player);
        } else {
            localStorage.setItem(
                "pngpd_live_player_v2",
                JSON.stringify(player)
            );
        }
    }


    function refreshPlayer() {
        if (typeof updateHUD === "function") {
            updateHUD();
        }

        updateProfileUI();
        updateInventoryUI();
        updateBankUI();
    }


    /* =====================================================
       SPLASH
    ===================================================== */

    let loading = 0;

    const loadingInterval = setInterval(() => {

        loading += 5;

        const bar = $("loadingProgress");

        if (bar) {
            bar.style.width = `${loading}%`;
        }

        if (loading >= 100) {

            clearInterval(loadingInterval);

            setTimeout(() => {

                if (player && player.name) {
                    showScreen("startScreen");
                } else {
                    showScreen("startScreen");
                }

            }, 300);

        }

    }, 60);


    /* =====================================================
       START GAME
    ===================================================== */

    $("startGameBtn")?.addEventListener("click", () => {

        if (player && player.name) {

            const continueGame = confirm(
                `Continue as ${player.nickname || player.name}?`
            );

            if (continueGame) {
                enterGame();
                return;
            }

        }

        showScreen("registrationScreen");

    });


    /* =====================================================
       AVATAR SELECTION
    ===================================================== */

    document.querySelectorAll(".avatar-choice").forEach(button => {

        button.addEventListener("click", () => {

            document.querySelectorAll(".avatar-choice")
                .forEach(btn => btn.classList.remove("selected"));

            button.classList.add("selected");

            selectedAvatar = button.dataset.avatar || "👨🏽‍🎓";

        });

    });


    /* =====================================================
       REGISTRATION
    ===================================================== */

    $("registrationForm")?.addEventListener("submit", event => {

        event.preventDefault();

        const name = $("playerName")?.value.trim();
        const email = $("playerEmail")?.value.trim();
        const nickname = $("playerNickname")?.value.trim();

        if (!name || !email || !nickname) {
            toast("Please complete all fields.", "error");
            return;
        }


        player = {

            id:
                "p" +
                Math.random()
                    .toString(36)
                    .substring(2, 10),

            name,
            email,
            nickname,
            avatar: selectedAvatar,

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

            properties: [],

            vehicles: [],

            battlesWon: 0,

            battlesLost: 0,

            tournamentWins: 0,

            createdAt: Date.now()

        };


        saveCurrentPlayer();

        startAssessment();

    });


    /* =====================================================
       CBT START
    ===================================================== */

    function startAssessment() {

        if (
            typeof PNGPD_QUESTIONS === "undefined" ||
            !PNGPD_QUESTIONS.length
        ) {
            toast("Question bank could not be loaded.", "error");
            return;
        }


        assessmentQuestions =
            typeof shuffleQuestions === "function"
                ? shuffleQuestions(PNGPD_QUESTIONS).slice(0, 50)
                : [...PNGPD_QUESTIONS]
                    .sort(() => Math.random() - 0.5)
                    .slice(0, 50);


        assessmentAnswers =
            new Array(assessmentQuestions.length).fill(null);

        markedQuestions =
            new Array(assessmentQuestions.length).fill(false);


        currentQuestion = 0;

        assessmentTime = 60 * 60;

        assessmentStartedAt = Date.now();

        assessmentSubmitted = false;


        showScreen("assessmentScreen");

        renderAssessment();

        startAssessmentTimer();

    }


    /* =====================================================
       CBT TIMER
    ===================================================== */

    function startAssessmentTimer() {

        clearInterval(assessmentTimerInterval);

        updateAssessmentTimer();

        assessmentTimerInterval = setInterval(() => {

            if (assessmentSubmitted) {
                clearInterval(assessmentTimerInterval);
                return;
            }


            assessmentTime--;

            updateAssessmentTimer();


            if (assessmentTime <= 0) {

                clearInterval(assessmentTimerInterval);

                toast(
                    "Time is up. Your assessment is being submitted.",
                    "warning"
                );

                submitAssessment(true);

            }

        }, 1000);

    }


    function updateAssessmentTimer() {

        const timer = $("assessmentTimer");

        if (!timer) return;

        const minutes =
            Math.floor(assessmentTime / 60)
                .toString()
                .padStart(2, "0");

        const seconds =
            (assessmentTime % 60)
                .toString()
                .padStart(2, "0");

        timer.textContent =
            `${minutes}:${seconds}`;


        if (assessmentTime <= 300) {
            timer.classList.add("danger");
        }

    }


    /* =====================================================
       CBT RENDER
    ===================================================== */

    function renderAssessment() {

        const question =
            assessmentQuestions[currentQuestion];

        if (!question) return;


        const questionNumber =
            $("assessmentQuestionNumber");

        const topic =
            $("assessmentQuestionTopic");

        const difficulty =
            $("assessmentQuestionDifficulty");

        const text =
            $("assessmentQuestion");

        const options =
            $("assessmentOptions");


        if (questionNumber) {
            questionNumber.textContent =
                `Question ${currentQuestion + 1} of ${assessmentQuestions.length}`;
        }


        if (topic) {
            topic.textContent =
                question.topic || "PGP 122";
        }


        if (difficulty) {
            difficulty.textContent =
                question.difficulty || "Medium";

            difficulty.className =
                `difficulty-badge ${String(
                    question.difficulty || "medium"
                ).toLowerCase()}`;
        }


        if (text) {
            text.textContent =
                question.question;
        }


        if (options) {

            options.innerHTML = "";

            question.options.forEach((option, index) => {

                const button =
                    document.createElement("button");

                button.type = "button";

                button.className =
                    "cbt-option";

                if (
                    assessmentAnswers[currentQuestion] === index
                ) {
                    button.classList.add("selected");
                }


                const letter =
                    String.fromCharCode(65 + index);


                button.innerHTML = `
                    <span class="option-letter">
                        ${letter}
                    </span>

                    <span class="option-text">
                        ${option}
                    </span>
                `;


                button.addEventListener("click", () => {

                    assessmentAnswers[currentQuestion] =
                        index;

                    renderAssessment();

                });


                options.appendChild(button);

            });

        }


        updateAssessmentStats();
        renderQuestionPalette();

    }


    /* =====================================================
       CBT STATS
    ===================================================== */

    function updateAssessmentStats() {

        const answered =
            assessmentAnswers.filter(
                answer => answer !== null
            ).length;

        const unanswered =
            assessmentAnswers.length - answered;

        const marked =
            markedQuestions.filter(Boolean).length;


        if ($("assessmentAnsweredCount")) {
            $("assessmentAnsweredCount").textContent =
                answered;
        }


        if ($("assessmentUnansweredCount")) {
            $("assessmentUnansweredCount").textContent =
                unanswered;
        }


        if ($("assessmentMarkedCount")) {
            $("assessmentMarkedCount").textContent =
                marked;
        }


        const percentage =
            assessmentAnswers.length
                ? (answered / assessmentAnswers.length) * 100
                : 0;


        if ($("assessmentProgressBar")) {
            $("assessmentProgressBar").style.width =
                `${percentage}%`;
        }

    }


    /* =====================================================
       QUESTION PALETTE
    ===================================================== */

    function renderQuestionPalette() {

        const palette =
            $("assessmentPalette");

        if (!palette) return;

        palette.innerHTML = "";


        assessmentQuestions.forEach((question, index) => {

            const button =
                document.createElement("button");

            button.type = "button";

            button.textContent =
                index + 1;

            button.className =
                "palette-question";


            if (index === currentQuestion) {
                button.classList.add("current");
            }


            if (assessmentAnswers[index] !== null) {
                button.classList.add("answered");
            }


            if (markedQuestions[index]) {
                button.classList.add("marked");
            }


            button.addEventListener("click", () => {

                currentQuestion = index;

                renderAssessment();

            });


            palette.appendChild(button);

        });

    }


    /* =====================================================
       CBT NAVIGATION
    ===================================================== */

    $("nextAssessment")?.addEventListener(
        "click",
        () => {

            if (
                currentQuestion <
                assessmentQuestions.length - 1
            ) {

                currentQuestion++;

                renderAssessment();

            } else {

                submitAssessment();

            }

        }
    );


    $("prevAssessment")?.addEventListener(
        "click",
        () => {

            if (currentQuestion > 0) {

                currentQuestion--;

                renderAssessment();

            }

        }
    );


    $("markAssessment")?.addEventListener(
        "click",
        () => {

            markedQuestions[currentQuestion] =
                !markedQuestions[currentQuestion];

            renderAssessment();

            toast(
                markedQuestions[currentQuestion]
                    ? "Question marked for review."
                    : "Question removed from review.",
                "info"
            );

        }
    );


    /* =====================================================
       SUBMIT CBT
    ===================================================== */

    $("submitAssessment")?.addEventListener(
        "click",
        () => submitAssessment(false)
    );


    function submitAssessment(autoSubmit = false) {

        if (assessmentSubmitted) return;


        if (!autoSubmit) {

            const unanswered =
                assessmentAnswers.filter(
                    answer => answer === null
                ).length;


            if (unanswered > 0) {

                const proceed =
                    confirm(
                        `You have ${unanswered} unanswered question(s). Submit anyway?`
                    );

                if (!proceed) return;

            } else {

                const proceed =
                    confirm(
                        "Submit your assessment now?"
                    );

                if (!proceed) return;

            }

        }


        assessmentSubmitted = true;

        clearInterval(assessmentTimerInterval);


        let score = 0;


        assessmentQuestions.forEach(
            (question, index) => {

                if (
                    assessmentAnswers[index] ===
                    question.answer
                ) {
                    score++;
                }

            }
        );


        const total =
            assessmentQuestions.length;

        const percentage =
            total
                ? (score / total) * 100
                : 0;


        let rating;
        let capital;


        if (percentage < 20) {

            rating = "Rookie";
            capital = 500000;

        } else if (percentage < 40) {

            rating = "Trainee";
            capital = 1000000;

        } else if (percentage < 60) {

            rating = "Skilled";
            capital = 2500000;

        } else if (percentage < 80) {

            rating = "Elite";
            capital = 5000000;

        } else {

            rating = "PNGPD Legend";
            capital = 10000000;

        }


        player.assessmentScore = score;

        player.rating = rating;

        player.coins = capital;

        player.questionsAnswered =
            (player.questionsAnswered || 0) + total;

        player.correctAnswers =
            (player.correctAnswers || 0) + score;


        const xpEarned =
            score * 250;


        if (typeof addXP === "function") {
            addXP(xpEarned);
        } else {
            player.xp =
                (player.xp || 0) + xpEarned;
        }


        saveCurrentPlayer();


        const timeUsed =
            (60 * 60) - assessmentTime;


        const usedMinutes =
            Math.floor(timeUsed / 60)
                .toString()
                .padStart(2, "0");

        const usedSeconds =
            (timeUsed % 60)
                .toString()
                .padStart(2, "0");


        if ($("assessmentResultScore")) {
            $("assessmentResultScore").textContent =
                `${score} / ${total}`;
        }


        if ($("assessmentResultPercentage")) {
            $("assessmentResultPercentage").textContent =
                `${percentage.toFixed(1)}%`;
        }


        if ($("assessmentResultRating")) {
            $("assessmentResultRating").textContent =
                rating;
        }


        if ($("assessmentResultCapital")) {
            $("assessmentResultCapital").textContent =
                formatCurrency(capital);
        }


        if ($("assessmentTimeUsed")) {
            $("assessmentTimeUsed").textContent =
                `${usedMinutes}:${usedSeconds}`;
        }


        showScreen("assessmentResultScreen");

    }


    /* =====================================================
       ENTER GAME
    ===================================================== */

    $("enterGameFromResult")?.addEventListener(
        "click",
        enterGame
    );


    function enterGame() {

        if (!player) {

            toast(
                "Create a player first.",
                "error"
            );

            showScreen("registrationScreen");

            return;
        }


        showScreen("gameScreen");


        if ($("hudPlayerName")) {
            $("hudPlayerName").textContent =
                player.nickname || player.name;
        }


        if ($("worldPlayerName")) {
            $("worldPlayerName").textContent =
                player.nickname || player.name;
        }


        if ($("hudAvatar")) {
            $("hudAvatar").textContent =
                player.avatar || "👨🏽‍🎓";
        }


        if ($("worldPlayerAvatar")) {
            $("worldPlayerAvatar").textContent =
                player.avatar || "👨🏽‍🎓";
        }


        refreshPlayer();


        if (
            typeof initializeWorld === "function"
        ) {
            initializeWorld();
        }

    }


    /* =====================================================
       PANELS
    ===================================================== */

    function closeAllPanels() {

        document
            .querySelectorAll(".panel")
            .forEach(panel => {

                panel.classList.add("hidden");

            });

    }


    function openPanel(id) {

        closeAllPanels();

        const panel = $(id);

        if (panel) {
            panel.classList.remove("hidden");
        }

    }


    document.querySelectorAll(
        "[data-panel]"
    ).forEach(button => {

        button.addEventListener("click", () => {

            const panel =
                button.dataset.panel;

            openPanel(
                `${panel}Panel`
            );

            if (panel === "profile") {
                updateProfileUI();
            }

            if (panel === "missions") {
                renderMissions();
            }

            if (panel === "items") {
                updateInventoryUI();
            }

            if (panel === "ranks") {
                updateLeaderboard();
            }

        });

    });


    document.querySelectorAll(
        ".close-panel"
    ).forEach(button => {

        button.addEventListener(
            "click",
            closeAllPanels
        );

    });


    /* =====================================================
       HUD MENU
    ===================================================== */

    $("gameMenuBtn")?.addEventListener(
        "click",
        () => openPanel("menuPanel")
    );


    $("notificationBtn")?.addEventListener(
        "click",
        () => openPanel("notificationPanel")
    );


    /* =====================================================
       PROFILE
    ===================================================== */

    function updateProfileUI() {

        if (!player) return;


        const avatar =
            player.avatar || "👨🏽‍🎓";


        if ($("profileAvatar")) {
            $("profileAvatar").textContent =
                avatar;
        }


        if ($("profileName")) {
            $("profileName").textContent =
                player.name || "Player";
        }


        if ($("profileNickname")) {
            $("profileNickname").textContent =
                `@${player.nickname || "player"}`;
        }


        if ($("profileRating")) {
            $("profileRating").textContent =
                player.rating || "Rookie";
        }


        if ($("profileLevel")) {
            $("profileLevel").textContent =
                player.level || 1;
        }


        if ($("profileXP")) {
            $("profileXP").textContent =
                formatNumber(player.xp);
        }


        if ($("profileQuestions")) {
            $("profileQuestions").textContent =
                formatNumber(
                    player.questionsAnswered
                );
        }


        if ($("profileCorrect")) {
            $("profileCorrect").textContent =
                formatNumber(
                    player.correctAnswers
                );
        }


        if ($("profileStreak")) {
            $("profileStreak").textContent =
                `${player.streak || 0} 🔥`;
        }


        if ($("profileMissions")) {
            $("profileMissions").textContent =
                formatNumber(
                    player.missionsCompleted
                );
        }

    }


    /* =====================================================
       MISSIONS
    ===================================================== */

    function renderMissions() {

        const container =
            $("missionsList");

        if (!container) return;


        if (
            typeof MISSIONS === "undefined"
        ) {

            container.innerHTML = `
                <div class="empty-state">
                    <span>🎯</span>
                    <p>No missions available.</p>
                </div>
            `;

            return;
        }


        container.innerHTML = "";


        MISSIONS.forEach(mission => {

            let progress = 0;

            if (
                typeof getMissionProgress === "function"
            ) {
                progress =
                    getMissionProgress(
                        mission,
                        player
                    );
            }


            const complete =
                typeof isMissionComplete === "function"
                    ? isMissionComplete(
                        mission,
                        player
                    )
                    : false;


            const card =
                document.createElement("div");

            card.className =
                "mission-card";


            card.innerHTML = `

                <div class="mission-icon">
                    🎯
                </div>

                <div class="mission-info">

                    <h3>
                        ${mission.name}
                    </h3>

                    <p>
                        ${mission.description || ""}
                    </p>

                    <div class="mission-progress">
                        ${progress}
                    </div>

                    <small>
                        Reward:
                        ${formatCurrency(
                            mission.reward || 0
                        )}
                    </small>

                </div>

                <button
                    class="mission-claim"
                    ${complete ? "" : "disabled"}
                >
                    ${complete ? "CLAIM" : "LOCKED"}
                </button>
            `;


            const claim =
                card.querySelector(
                    ".mission-claim"
                );


            claim?.addEventListener(
                "click",
                () => {

                    if (
                        typeof claimMission === "function"
                    ) {

                        claimMission(
                            mission,
                            player
                        );

                        saveCurrentPlayer();

                        refreshPlayer();

                        renderMissions();

                        toast(
                            "Mission reward claimed!",
                            "success"
                        );

                    }

                }
            );


            container.appendChild(card);

        });

    }


    /* =====================================================
       LEADERBOARD
    ===================================================== */

    function updateLeaderboard() {

        const row =
            $("playerRankRow");

        if (!row || !player) return;


        const xp =
            Number(player.xp || 0);


        row.querySelector("strong")
            ?.replaceChildren(
                document.createTextNode(
                    player.nickname ||
                    player.name ||
                    "You"
                )
            );


        const score =
            row.querySelector("b");

        if (score) {
            score.textContent =
                `${formatNumber(xp)} XP`;
        }

    }


    /* =====================================================
       INVENTORY
    ===================================================== */

    function updateInventoryUI() {

        const grid =
            $("inventoryGrid");

        if (!grid || !player) return;


        const inventory =
            player.inventory || [];


        if (!inventory.length) {

            grid.innerHTML = `

                <div class="empty-inventory">

                    <span>
                        🎒
                    </span>

                    <h3>
                        Your inventory is empty
                    </h3>

                    <p>
                        Visit the Shop to purchase your first item.
                    </p>

                </div>
            `;

            return;
        }


        grid.innerHTML = "";


        inventory.forEach(item => {

            const card =
                document.createElement("div");

            card.className =
                "inventory-item";


            card.innerHTML = `

                <span>
                    🎒
                </span>

                <strong>
                    ${item.name || item}
                </strong>

                <small>
                    Owned
                </small>

            `;


            grid.appendChild(card);

        });

    }


    /* =====================================================
       BANK
    ===================================================== */

    function updateBankUI() {

        if (!player) return;


        const balance =
            Number(player.bank || 0);


        if ($("bankCash")) {
            $("bankCash").textContent =
                formatCurrency(balance);
        }

    }


    $("depositBtn")?.addEventListener(
        "click",
        () => {

            const amount =
                Number(
                    prompt(
                        "Enter amount to deposit:"
                    )
                );


            if (!amount || amount <= 0) {
                return;
            }


            if (
                amount >
                Number(player.coins || 0)
            ) {

                toast(
                    "Insufficient cash.",
                    "error"
                );

                return;
            }


            if (
                typeof depositMoney === "function"
            ) {

                depositMoney(amount);

            } else {

                player.coins -= amount;

                player.bank =
                    (player.bank || 0) +
                    amount;

            }


            saveCurrentPlayer();

            refreshPlayer();

            toast(
                `${formatCurrency(amount)} deposited.`,
                "success"
            );

        }
    );


    $("withdrawBtn")?.addEventListener(
        "click",
        () => {

            const amount =
                Number(
                    prompt(
                        "Enter amount to withdraw:"
                    )
                );


            if (!amount || amount <= 0) {
                return;
            }


            if (
                amount >
                Number(player.bank || 0)
            ) {

                toast(
                    "Insufficient bank balance.",
                    "error"
                );

                return;
            }


            if (
                typeof withdrawMoney === "function"
            ) {

                withdrawMoney(amount);

            } else {

                player.bank -= amount;

                player.coins =
                    (player.coins || 0) +
                    amount;

            }


            saveCurrentPlayer();

            refreshPlayer();

            toast(
                `${formatCurrency(amount)} withdrawn.`,
                "success"
            );

        }
    );


    /* =====================================================
       SHOP
    ===================================================== */

    document.querySelectorAll(
        "[data-item]"
    ).forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const itemId =
                    button.dataset.item;

                const price =
                    Number(
                        button.dataset.price || 0
                    );


                if (
                    Number(player.coins || 0) <
                    price
                ) {

                    toast(
                        "You cannot afford this item.",
                        "error"
                    );

                    return;
                }


                if (
                    typeof buyItem === "function"
                ) {

                    buyItem(
                        itemId,
                        price
                    );

                } else {

                    player.coins -= price;

                    if (!player.inventory) {
                        player.inventory = [];
                    }

                    player.inventory.push({
                        id: itemId,
                        name: itemId,
                        price
                    });

                }


                saveCurrentPlayer();

                refreshPlayer();

                toast(
                    "Item purchased successfully!",
                    "success"
                );

            }
        );

    });


    /* =====================================================
       MENU ACTIONS
    ===================================================== */

    document.querySelectorAll(
        "[data-menu]"
    ).forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const action =
                    button.dataset.menu;

                closeAllPanels();


                const panelMap = {

                    bank: "bankPanel",

                    shop: "shopPanel",

                    properties: "propertyPanel",

                    garage: "garagePanel",

                    tournaments:
                        "tournamentPanel",

                    transfers:
                        "transferPanel",

                    friends:
                        "friendsPanel",

                    settings:
                        "settingsPanel",

                    admin:
                        "adminPanel",

                    help:
                        "helpPanel"

                };


                if (panelMap[action]) {

                    openPanel(
                        panelMap[action]
                    );

                }

            }
        );

    });


    /* =====================================================
       RESET PLAYER
    ===================================================== */

    $("resetPlayerBtn")?.addEventListener(
        "click",
        () => {

            const confirmReset =
                confirm(
                    "This will erase your PNGPD LIVE player data. Continue?"
                );


            if (!confirmReset) return;


            if (
                typeof resetPlayer === "function"
            ) {

                resetPlayer();

            } else {

                localStorage.removeItem(
                    "pngpd_live_player_v2"
                );

            }


            localStorage.removeItem(
                "pngpd_live_player_v2"
            );


            player = null;

            closeAllPanels();

            showScreen("startScreen");

            toast(
                "Player data reset.",
                "success"
            );

        }
    );


    /* =====================================================
       GENERAL MODAL
    ===================================================== */

    function openModal(content) {

        const modal =
            $("modalOverlay");

        const contentBox =
            $("modalContent");

        if (!modal || !contentBox) return;

        contentBox.innerHTML = content;

        modal.classList.remove("hidden");

    }


    function closeModal() {

        $("modalOverlay")
            ?.classList.add("hidden");

    }


    $("closeModal")?.addEventListener(
        "click",
        closeModal
    );


    $("modalOverlay")?.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                $("modalOverlay")
            ) {
                closeModal();
            }

        }
    );


    $("closeQuestionModal")?.addEventListener(
        "click",
        () => {

            $("questionModal")
                ?.classList.add("hidden");

        }
    );


    /* =====================================================
       NORMAL STUDY QUESTION
    ===================================================== */

    function openQuestion() {

        if (
            typeof PNGPD_QUESTIONS === "undefined"
        ) return;


        if (!PNGPD_QUESTIONS.length) return;


        normalQuestionIndex =
            Math.floor(
                Math.random() *
                PNGPD_QUESTIONS.length
            );


        normalQuestion =
            PNGPD_QUESTIONS[
                normalQuestionIndex
            ];


        const topic =
            $("questionModalTopic");

        const difficulty =
            $("questionDifficulty");

        const text =
            $("questionModalText");

        const options =
            $("questionModalOptions");

        const explanation =
            $("questionExplanation");


        if (topic) {
            topic.textContent =
                normalQuestion.topic ||
                "PGP 122";
        }


        if (difficulty) {

            difficulty.textContent =
                normalQuestion.difficulty ||
                "Medium";

        }


        if (text) {
            text.textContent =
                normalQuestion.question;
        }


        if (explanation) {
            explanation.classList.add(
                "hidden"
            );

            explanation.innerHTML = "";
        }


        if (options) {

            options.innerHTML = "";


            normalQuestion.options
                .forEach(
                    (option, index) => {

                        const button =
                            document.createElement(
                                "button"
                            );

                        button.type =
                            "button";

                        button.className =
                            "modal-option";


                        button.innerHTML = `

                            <span>
                                ${String.fromCharCode(
                                    65 + index
                                )}
                            </span>

                            <strong>
                                ${option}
                            </strong>

                        `;


                        button.addEventListener(
                            "click",
                            () => {

                                answerNormalQuestion(
                                    index,
                                    button
                                );

                            }
                        );


                        options.appendChild(
                            button
                        );

                    }
                );

        }


        $("questionModal")
            ?.classList.remove("hidden");

    }


    function answerNormalQuestion(
        selected,
        selectedButton
    ) {

        if (!normalQuestion) return;


        const buttons =
            document.querySelectorAll(
                "#questionModalOptions button"
            );


        buttons.forEach(button => {
            button.disabled = true;
        });


        const correct =
            selected ===
            normalQuestion.answer;


        if (correct) {

            selectedButton.classList.add(
                "correct"
            );


            if (
                typeof addMoney === "function"
            ) {

                addMoney(250000);

            } else {

                player.coins =
                    (player.coins || 0) +
                    250000;

            }


            if (
                typeof addXP === "function"
            ) {

                addXP(250);

            } else {

                player.xp =
                    (player.xp || 0) +
                    250;

            }


            player.correctAnswers =
                (player.correctAnswers || 0) + 1;


            player.questionsAnswered =
                (player.questionsAnswered || 0) + 1;


            player.streak =
                (player.streak || 0) + 1;


            toast(
                "Correct! +₦250,000 and +250 XP",
                "success"
            );

        } else {

            selectedButton.classList.add(
                "wrong"
            );


            if (buttons[normalQuestion.answer]) {

                buttons[
                    normalQuestion.answer
                ].classList.add(
                    "correct"
                );

            }


            player.questionsAnswered =
                (player.questionsAnswered || 0) + 1;


            player.streak = 0;


            toast(
                "Incorrect answer.",
                "error"
            );

        }


        const explanation =
            $("questionExplanation");


        if (explanation) {

            explanation.innerHTML = `

                <strong>
                    Explanation
                </strong>

                <p>
                    ${
                        normalQuestion.explanation ||
                        "Review this topic and try again."
                    }
                </p>

            `;

            explanation.classList.remove(
                "hidden"
            );

        }


        saveCurrentPlayer();

        refreshPlayer();

    }


    /* =====================================================
       LOCATION BUILDINGS
    ===================================================== */

    document.querySelectorAll(
        ".building"
    ).forEach(building => {

        building.addEventListener(
            "click",
            () => {

                const location =
                    building.dataset.location;

                handleLocation(location);

            }
        );

    });


    function handleLocation(location) {

        switch (location) {

            case "library":

                if (
                    Number(player.energy || 0) < 10
                ) {

                    toast(
                        "You need at least 10 energy to study.",
                        "error"
                    );

                    return;
                }


                if (
                    typeof useEnergy === "function"
                ) {

                    useEnergy(10);

                } else {

                    player.energy -= 10;

                }


                openQuestion();

                break;


            case "arena":

                startBattle();

                break;


            case "cafeteria":

                player.energy =
                    clamp(
                        Number(player.energy || 0) + 25,
                        0,
                        100
                    );

                saveCurrentPlayer();

                refreshPlayer();

                showLocationMessage(
                    "🍛",
                    "Cafeteria",
                    "You recovered 25 energy."
                );

                toast(
                    "+25 Energy",
                    "success"
                );

                break;


            case "hostel":

                player.energy = 100;

                saveCurrentPlayer();

                refreshPlayer();

                showLocationMessage(
                    "🏠",
                    "Hostel",
                    "You rested and restored your energy."
                );

                toast(
                    "Energy fully restored.",
                    "success"
                );

                break;


            case "bank":

                openPanel("bankPanel");

                break;


            case "shop":

                openPanel("shopPanel");

                break;


            case "properties":

                openPanel("propertyPanel");

                break;


            case "garage":

                openPanel("garagePanel");

                break;


            case "tournaments":

                openPanel("tournamentPanel");

                break;


            case "department":

                openModal(`

                    <div class="location-modal">

                        <div class="location-big-icon">
                            🏢
                        </div>

                        <h2>
                            PNGPD DEPARTMENT
                        </h2>

                        <p>
                            Welcome to the Petroleum &
                            Natural Gas Processing Technology
                            department.
                        </p>

                        <div class="location-actions">

                            <button
                                onclick="closeLocationModal()"
                            >
                                ENTER
                            </button>

                        </div>

                    </div>

                `);

                break;


            case "lab":

                openModal(`

                    <div class="location-modal">

                        <div class="location-big-icon">
                            🧪
                        </div>

                        <h2>
                            PNGPD LABORATORY
                        </h2>

                        <p>
                            Practical engineering activities,
                            experiments and technical challenges
                            will be available here.
                        </p>

                    </div>

                `);

                break;


            default:

                showLocationMessage(
                    "📍",
                    "PNGPD Campus",
                    "Location available."
                );

        }

    }


    window.closeLocationModal =
        closeModal;


    /* =====================================================
       LOCATION NOTIFICATION
    ===================================================== */

    function showLocationMessage(
        icon,
        name,
        description
    ) {

        const notification =
            $("locationNotification");

        if (!notification) return;


        if ($("locationIcon")) {
            $("locationIcon").textContent =
                icon;
        }


        if ($("locationName")) {
            $("locationName").textContent =
                name;
        }


        if ($("locationDescription")) {
            $("locationDescription").textContent =
                description;
        }


        notification.classList.remove(
            "hidden"
        );


        setTimeout(() => {

            notification.classList.add(
                "hidden"
            );

        }, 4000);

    }


    /* =====================================================
       PVP BATTLE
    ===================================================== */

    function startBattle() {

        if (
            Number(player.energy || 0) < 20
        ) {

            toast(
                "You need 20 energy to enter the Arena.",
                "error"
            );

            return;
        }


        player.energy -= 20;


        saveCurrentPlayer();

        refreshPlayer();


        if (
            typeof window.startBattle === "function" &&
            window.startBattle !== startBattle
        ) {

            try {

                window.startBattle();

                return;

            } catch (error) {

                console.warn(
                    "External battle system failed.",
                    error
                );

            }

        }


        openBattleQuestion();

    }


    function openBattleQuestion() {

        if (
            typeof PNGPD_QUESTIONS === "undefined"
        ) return;


        const question =
            PNGPD_QUESTIONS[
                Math.floor(
                    Math.random() *
                    PNGPD_QUESTIONS.length
                )
            ];


        let seconds = 15;

        openModal(`

            <div class="battle-screen">

                <div class="battle-header">

                    <span>
                        ⚔️ ARENA BATTLE
                    </span>

                    <strong id="battleTimer">
                        15
                    </strong>

                </div>


                <h2>
                    ${question.question}
                </h2>


                <div
                    id="battleOptions"
                    class="battle-options"
                >

                    ${question.options
                        .map(
                            (option, index) => `
                                <button
                                    data-answer="${index}"
                                >
                                    ${String.fromCharCode(
                                        65 + index
                                    )}.
                                    ${option}
                                </button>
                            `
                        )
                        .join("")}

                </div>

            </div>

        `);


        const timer =
            setInterval(() => {

                seconds--;


                const timerElement =
                    $("battleTimer");

                if (timerElement) {
                    timerElement.textContent =
                        seconds;
                }


                if (seconds <= 0) {

                    clearInterval(timer);

                    endBattle(false);

                }

            }, 1000);


        document.querySelectorAll(
            "#battleOptions button"
        ).forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    clearInterval(timer);


                    const answer =
                        Number(
                            button.dataset.answer
                        );


                    endBattle(
                        answer === question.answer
                    );

                }
            );

        });

    }


    function endBattle(won) {

        if (won) {

            player.battlesWon =
                (player.battlesWon || 0) + 1;


            player.coins =
                (player.coins || 0) + 500000;


            if (
                typeof addXP === "function"
            ) {
                addXP(500);
            } else {
                player.xp =
                    (player.xp || 0) + 500;
            }


            toast(
                "🏆 Victory! +₦500,000 +500 XP",
                "success"
            );

        } else {

            player.battlesLost =
                (player.battlesLost || 0) + 1;


            toast(
                "Battle lost. Study and try again.",
                "error"
            );

        }


        saveCurrentPlayer();

        refreshPlayer();

        closeModal();

    }


    /* =====================================================
       PURCHASE PLACEHOLDERS
    ===================================================== */

    document.querySelectorAll(
        "#propertyPanel .market-card button"
    ).forEach(button => {

        button.addEventListener(
            "click",
            () => {

                toast(
                    "Property marketplace is ready for the economy system.",
                    "info"
                );

            }
        );

    });


    document.querySelectorAll(
        "#garagePanel .market-card button"
    ).forEach(button => {

        button.addEventListener(
            "click",
            () => {

                toast(
                    "Vehicle marketplace is ready for the economy system.",
                    "info"
                );

            }
        );

    });


    /* =====================================================
       TOURNAMENT BUTTONS
    ===================================================== */

    document.querySelectorAll(
        "#tournamentPanel button"
    ).forEach(button => {

        if (
            button.textContent
                .trim()
                .toUpperCase() === "ENTER"
        ) {

            button.addEventListener(
                "click",
                () => {

                    toast(
                        "Tournament registration system ready.",
                        "info"
                    );

                }
            );

        }

    });


    /* =====================================================
       UPDATE HUD
    ===================================================== */

    function updateGameHUD() {

        if (!player) return;


        if ($("hudPlayerName")) {
            $("hudPlayerName").textContent =
                player.nickname ||
                player.name ||
                "Player";
        }


        if ($("worldPlayerName")) {
            $("worldPlayerName").textContent =
                player.nickname ||
                player.name ||
                "Player";
        }


        if ($("hudAvatar")) {
            $("hudAvatar").textContent =
                player.avatar ||
                "👨🏽‍🎓";
        }


        if ($("worldPlayerAvatar")) {
            $("worldPlayerAvatar").textContent =
                player.avatar ||
                "👨🏽‍🎓";
        }


        if ($("hudLevel")) {
            $("hudLevel").textContent =
                player.level || 1;
        }


        if ($("hudCoins")) {
            $("hudCoins").textContent =
                formatCurrency(
                    player.coins || 0
                );
        }


        if ($("hudEnergy")) {
            $("hudEnergy").textContent =
                player.energy || 0;
        }


        if ($("hudRating")) {
            $("hudRating").textContent =
                player.rating ||
                "Rookie";
        }


        if ($("hudXP")) {

            let required = 1000;

            if (
                typeof getXPRequired === "function"
            ) {

                required =
                    getXPRequired(
                        player.level || 1
                    );

            }

            $("hudXP").textContent =
                `${formatNumber(
                    player.xp || 0
                )} / ${formatNumber(required)} XP`;

        }


        if ($("xpProgress")) {

            let required = 1000;

            if (
                typeof getXPRequired === "function"
            ) {

                required =
                    getXPRequired(
                        player.level || 1
                    );

            }


            const percentage =
                required
                    ? (
                        Number(player.xp || 0) /
                        required
                    ) * 100
                    : 0;


            $("xpProgress").style.width =
                `${clamp(
                    percentage,
                    0,
                    100
                )}%`;

        }

    }


    /* =====================================================
       KEYBOARD MOVEMENT
    ===================================================== */

    document.addEventListener(
        "keydown",
        event => {

            if (
                ["INPUT", "TEXTAREA"].includes(
                    document.activeElement?.tagName
                )
            ) return;


            if (
                !["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight",
                  "w", "a", "s", "d",
                  "W", "A", "S", "D"].includes(
                    event.key
                )
            ) return;


            const character =
                $("playerCharacter");

            if (!character) return;


            const world =
                $("gameWorld");

            if (!world) return;


            const step = 15;

            const currentLeft =
                parseInt(
                    character.style.left || "50",
                    10
                );


            const currentTop =
                parseInt(
                    character.style.top || "50",
                    10
                );


            let left = currentLeft;

            let top = currentTop;


            if (
                event.key === "ArrowLeft" ||
                event.key.toLowerCase() === "a"
            ) {
                left -= step;
            }


            if (
                event.key === "ArrowRight" ||
                event.key.toLowerCase() === "d"
            ) {
                left += step;
            }


            if (
                event.key === "ArrowUp" ||
                event.key.toLowerCase() === "w"
            ) {
                top -= step;
            }


            if (
                event.key === "ArrowDown" ||
                event.key.toLowerCase() === "s"
            ) {
                top += step;
            }


            character.style.left =
                `${clamp(left, 5, 90)}%`;

            character.style.top =
                `${clamp(top, 10, 85)}%`;

        }
    );


    /* =====================================================
       QUICK ACTIONS
    ===================================================== */

    document.querySelectorAll(
        ".quick-action"
    ).forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const panel =
                    button.dataset.panel;

                if (panel) {
                    openPanel(
                        `${panel}Panel`
                    );
                }

            }
        );

    });


    /* =====================================================
       GLOBAL ESCAPE
    ===================================================== */

    document.addEventListener(
        "keydown",
        event => {

            if (event.key === "Escape") {

                closeAllPanels();

                closeModal();

                $("questionModal")
                    ?.classList.add("hidden");

            }

        }
    );


    /* =====================================================
       PERIODIC ENERGY REGENERATION
    ===================================================== */

    setInterval(() => {

        if (
            !player ||
            !player.name
        ) return;


        if (
            Number(player.energy || 0) < 100
        ) {

            player.energy =
                clamp(
                    Number(player.energy || 0) + 1,
                    0,
                    100
                );


            saveCurrentPlayer();

            refreshPlayer();

        }

    }, 60000);


    /* =====================================================
       GLOBAL REFRESH
    ===================================================== */

    window.pngpdLive = {

        getPlayer: () => player,

        savePlayer: () => {
            saveCurrentPlayer();
        },

        refresh: () => {
            refreshPlayer();
            updateGameHUD();
        },

        openQuestion,

        startBattle,

        enterGame,

        openPanel,

        closePanels: closeAllPanels

    };


    /* =====================================================
       INITIAL PLAYER LOAD
    ===================================================== */

    if (player && player.name) {

        updateGameHUD();

        updateProfileUI();

    }


    /* =====================================================
       SAFETY AUTO-SAVE
    ===================================================== */

    window.addEventListener(
        "beforeunload",
        () => {

            if (player) {
                saveCurrentPlayer();
            }

        }
    );

});