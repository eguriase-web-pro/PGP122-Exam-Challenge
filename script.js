// PNGPD LIVE - Main Game Controller

document.addEventListener("DOMContentLoaded", () => {
    initialiseGame();
});

let currentAssessmentIndex = 0;
let assessmentQuestions = [];
let assessmentAnswers = [];
let assessmentMarked = [];
let assessmentStartTime = null;
let assessmentTimerInterval = null;
let assessmentSubmitted = false;

function initialiseGame() {
    setupSplashScreen();
    setupStartScreen();
    setupRegistration();
    setupAssessment();
    setupNavigation();
    setupModals();
    setupMenu();
    setupResetButton();

    if (typeof initialiseWorld === "function") {
        initialiseWorld();
    }

    if (typeof initialiseEconomy === "function") {
        initialiseEconomy();
    }

    if (typeof renderMissions === "function") {
        renderMissions();
    }

    updateMainUI();
}

function setupSplashScreen() {
    const splash = document.getElementById("splashScreen");

    if (!splash) return;

    setTimeout(() => {
        splash.classList.add("hidden");
    }, 1800);
}

function setupStartScreen() {
    const startButtons = document.querySelectorAll(
        "#startScreen button"
    );

    startButtons.forEach(button => {
        button.addEventListener("click", () => {
            const text =
                button.textContent.toLowerCase();

            if (
                text.includes("start") ||
                text.includes("play") ||
                text.includes("begin")
            ) {
                showScreen("registrationScreen");
            }
        });
    });
}

function setupRegistration() {
    const form =
        document.querySelector(
            "#registrationScreen form"
        );

    if (!form) return;

    form.addEventListener("submit", event => {
        event.preventDefault();

        const nameInput =
            form.querySelector(
                'input[name="name"], #playerName'
            );

        const emailInput =
            form.querySelector(
                'input[name="email"], #playerEmail'
            );

        const nicknameInput =
            form.querySelector(
                'input[name="nickname"], #playerNickname'
            );

        const player = getActivePlayer();

        if (!player) return;

        if (nameInput && nameInput.value.trim()) {
            player.name =
                nameInput.value.trim();
        }

        if (emailInput) {
            player.email =
                emailInput.value.trim();
        }

        if (nicknameInput) {
            player.nickname =
                nicknameInput.value.trim();
        }

        player.lastPlayed =
            new Date().toISOString();

        savePlayer();

        startAssessment();
    });
}

function startAssessment() {
    showScreen("assessmentScreen");

    assessmentQuestions =
        getAssessmentQuestions();

    assessmentAnswers =
        new Array(
            assessmentQuestions.length
        ).fill(null);

    assessmentMarked =
        new Array(
            assessmentQuestions.length
        ).fill(false);

    currentAssessmentIndex = 0;
    assessmentSubmitted = false;

    assessmentStartTime =
        Date.now();

    startAssessmentTimer();
    renderAssessment();
}

function getAssessmentQuestions() {
    if (
        typeof questions !== "undefined" &&
        Array.isArray(questions)
    ) {
        return [...questions]
            .sort(() => Math.random() - 0.5)
            .slice(0, 20);
    }

    return [];
}

function setupAssessment() {
    const previous =
        document.getElementById(
            "prevAssessment"
        );

    const next =
        document.getElementById(
            "nextAssessment"
        );

    const mark =
        document.getElementById(
            "markAssessment"
        );

    const submit =
        document.getElementById(
            "submitAssessment"
        );

    if (previous) {
        previous.addEventListener(
            "click",
            previousAssessmentQuestion
        );
    }

    if (next) {
        next.addEventListener(
            "click",
            nextAssessmentQuestion
        );
    }

    if (mark) {
        mark.addEventListener(
            "click",
            toggleAssessmentMark
        );
    }

    if (submit) {
        submit.addEventListener(
            "click",
            submitAssessment
        );
    }
}

function renderAssessment() {
    if (
        !assessmentQuestions.length
    ) {
        return;
    }

    const question =
        assessmentQuestions[
            currentAssessmentIndex
        ];

    const number =
        document.getElementById(
            "assessmentQuestionNumber"
        );

    const topic =
        document.getElementById(
            "assessmentQuestionTopic"
        );

    const difficulty =
        document.getElementById(
            "assessment