8// PNGPD LIVE - Main Game Controller

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
            "assessmentQuestionDifficulty"
        );

    const text =
        document.getElementById(
            "assessmentQuestion"
        );

    const options =
        document.getElementById(
            "assessmentOptions"
        );

    if (number) {
        number.textContent =
            `Question ${currentAssessmentIndex + 1} of ${assessmentQuestions.length}`;
    }

    if (topic) {
        topic.textContent =
            question.topic || "General";
    }

    if (difficulty) {
        difficulty.textContent =
            question.difficulty || "Normal";
    }

    if (text) {
        text.textContent =
            question.question;
    }

    if (options) {
        options.innerHTML = "";

        question.options.forEach(
            (option, index) => {
                const button =
                    document.createElement(
                        "button"
                    );

                button.className =
                    "assessment-option";

                if (
                    assessmentAnswers[
                        currentAssessmentIndex
                    ] === index
                ) {
                    button.classList.add(
                        "selected"
                    );
                }

                button.textContent =
                    option;

                button.addEventListener(
                    "click",
                    () => {
                        selectAssessmentAnswer(
                            index
                        );
                    }
                );

                options.appendChild(
                    button
                );
            }
        );
    }

    updateAssessmentStats();
    renderAssessmentPalette();
}

function selectAssessmentAnswer(index) {
    assessmentAnswers[
        currentAssessmentIndex
    ] = index;

    renderAssessment();
}

function previousAssessmentQuestion() {
    if (
        currentAssessmentIndex > 0
    ) {
        currentAssessmentIndex--;
        renderAssessment();
    }
}

function nextAssessmentQuestion() {
    if (
        currentAssessmentIndex <
        assessmentQuestions.length - 1
    ) {
        currentAssessmentIndex++;
        renderAssessment();
    }
}

function toggleAssessmentMark() {
    assessmentMarked[
        currentAssessmentIndex
    ] =
        !assessmentMarked[
            currentAssessmentIndex
        ];

    renderAssessment();
}

function updateAssessmentStats() {
    const answered =
        assessmentAnswers.filter(
            answer => answer !== null
        ).length;

    const unanswered =
        assessmentQuestions.length -
        answered;

    const marked =
        assessmentMarked.filter(
            marked => marked
        ).length;

    const answeredElement =
        document.getElementById(
            "assessmentAnsweredCount"
        );

    const unansweredElement =
        document.getElementById(
            "assessmentUnansweredCount"
        );

    const markedElement =
        document.getElementById(
            "assessmentMarkedCount"
        );

    if (answeredElement) {
        answeredElement.textContent =
            answered;
    }

    if (unansweredElement) {
        unansweredElement.textContent =
            unanswered;
    }

    if (markedElement) {
        markedElement.textContent =
            marked;
    }

    const progress =
        assessmentQuestions.length
            ? (answered /
                  assessmentQuestions.length) *
              100
            : 0;

    const progressBar =
        document.getElementById(
            "assessmentProgressBar"
        );

    if (progressBar) {
        progressBar.style.width =
            `${progress}%`;
    }
}

function renderAssessmentPalette() {
    const palette =
        document.getElementById(
            "assessmentPalette"
        );

    if (!palette) return;

    palette.innerHTML = "";

    assessmentQuestions.forEach(
        (_, index) => {
            const button =
                document.createElement(
                    "button"
                );

            button.textContent =
                index + 1;

            if (
                assessmentAnswers[index] !==
                null
            ) {
                button.classList.add(
                    "answered"
                );
            }

            if (
                assessmentMarked[index]
            ) {
                button.classList.add(
                    "marked"
                );
            }

            if (
                index ===
                currentAssessmentIndex
            ) {
                button.classList.add(
                    "current"
                );
            }

            button.addEventListener(
                "click",
                () => {
                    currentAssessmentIndex =
                        index;

                    renderAssessment();
                }
            );

            palette.appendChild(button);
        }
    );
}

function startAssessmentTimer() {
    clearInterval(
        assessmentTimerInterval
    );

    assessmentTimerInterval =
        setInterval(() => {
            if (!assessmentStartTime) {
                return;
            }

            const elapsed =
                Math.floor(
                    (Date.now() -
                        assessmentStartTime) /
                        1000
                );

            const minutes =
                Math.floor(elapsed / 60)
                    .toString()
                    .padStart(2, "0");

            const seconds =
                (elapsed % 60)
                    .toString()
                    .padStart(2, "0");

            const timer =
                document.getElementById(
                    "assessmentTimer"
                );

            if (timer) {
                timer.textContent =
                    `${minutes}:${seconds}`;
            }
        }, 1000);
}

function submitAssessment() {
    if (assessmentSubmitted) {
        return;
    }

    const unanswered =
        assessmentAnswers.filter(
            answer => answer === null
        ).length;

    if (unanswered > 0) {
        const proceed =
            confirm(
                `You have ${unanswered} unanswered question(s). Submit anyway?`
            );

        if (!proceed) {
            return;
        }
    }

    assessmentSubmitted = true;

    clearInterval(
        assessmentTimerInterval
    );

    let correct = 0;

    assessmentQuestions.forEach(
        (question, index) => {
            const correctAnswer =
                question.answer !== undefined
                    ? question.answer
                    : question.correctAnswer;

            if (
                assessmentAnswers[index] ===
                Number(correctAnswer)
            ) {
                correct++;
            }
        }
    );

    const total =
        assessmentQuestions.length;

    const percentage =
        total
            ? Math.round(
                  (correct / total) * 100
              )
            : 0;

    const player =
        getActivePlayer();

    if (player) {
        player.assessmentScore =
            percentage;

        player.questionsAnswered +=
            total;

        player.correctAnswers +=
            correct;

        updatePlayerRating(
            percentage
        );

        const earnedXP =
            correct * 100;

        const earnedMoney =
            correct * 50000;

        addXP(earnedXP);
        addMoney(earnedMoney);

        player.lastPlayed =
            new Date().toISOString();

        savePlayer();
    }

    showAssessmentResult(
        correct,
        total,
        percentage
    );
}

function showAssessmentResult(
    correct,
    total,
    percentage
) {
    showScreen(
        "assessmentResultScreen"
    );

    const score =
        document.getElementById(
            "assessmentResultScore"
        );

    const percentageElement =
        document.getElementById(
            "assessmentResultPercentage"
        );

    const rating =
        document.getElementById(
            "assessmentResultRating"
        );

    const capital =
        document.getElementById(
            "assessmentResultCapital"
        );

    const time =
        document.getElementById(
            "assessmentTimeUsed"
        );

    const player =
        getActivePlayer();

    if (score) {
        score.textContent =
            `${correct}/${total}`;
    }

    if (percentageElement) {
        percentageElement.textContent =
            `${percentage}%`;
    }

    if (rating && player) {
        rating.textContent =
            player.rating;
    }

    if (capital && player) {
        capital.textContent =
            formatMoney(
                player.coins
            );
    }

    if (time) {
        const elapsed =
            Math.floor(
                (Date.now() -
                    assessmentStartTime) /
                    1000
            );

        const minutes =
            Math.floor(elapsed / 60);

        const seconds =
            elapsed % 60;

        time.textContent =
            `${minutes}m ${seconds}s`;
    }
}

function setupNavigation() {
    document
        .querySelectorAll(
            "[data-panel]"
        )
        .forEach(button => {
            button.addEventListener(
                "click",
                () => {
                    const panel =
                        button.dataset.panel;

                    if (
                        window.pngpdWorld &&
                        typeof window
                            .pngpdWorld
                            .openPanel ===
                            "function"
                    ) {
                        window.pngpdWorld.openPanel(
                            panel
                        );
                    }
                }
            );
        });
}

function setupModals() {
    const closeModal =
        document.getElementById(
            "closeModal"
        );

    if (closeModal) {
        closeModal.addEventListener(
            "click",
            closeGeneralModal
        );
    }

    const overlay =
        document.getElementById(
            "modalOverlay"
        );

    if (overlay) {
        overlay.addEventListener(
            "click",
            event => {
                if (
                    event.target === overlay
                ) {
                    closeGeneralModal();
                }
            }
        );
    }

    const closeQuestion =
        document.getElementById(
            "closeQuestionModal"
        );

    if (closeQuestion) {
        closeQuestion.addEventListener(
            "click",
            closeQuestionModal
        );
    }
}

function openGeneralModal(
    title,
    content
) {
    const overlay =
        document.getElementById(
            "modalOverlay"
        );

    const modal =
        document.getElementById(
            "generalModal"
        );

    const modalContent =
        document.getElementById(
            "modalContent"
        );

    if (modalContent) {
        modalContent.innerHTML =
            `
                <h2>${title}</h2>
                ${content}
            `;
    }

    if (overlay) {
        overlay.classList.add("active");
    }

    if (modal) {
        modal.classList.add("active");
    }
}

function closeGeneralModal() {
    const overlay =
        document.getElementById(
            "modalOverlay"
        );

    const modal =
        document.getElementById(
            "generalModal"
        );

    if (overlay) {
        overlay.classList.remove(
            "active"
        );
    }

    if (modal) {
        modal.classList.remove(
            "active"
        );
    }
}

function closeQuestionModal() {
    const modal =
        document.getElementById(
            "questionModal"
        );

    if (modal) {
        modal.classList.remove(
            "active"
        );
    }
}

function setupMenu() {
    document
        .querySelectorAll(
            "[data-menu]"
        )
        .forEach(button => {
            button.addEventListener(
                "click",
                () => {
                    const menu =
                        button.dataset.menu;

                    if (
                        window.pngpdWorld
                    ) {
                        window.pngpdWorld.openPanel(
                            menu
                        );
                    }
                }
            );
        });
}

function setupResetButton() {
    const reset =
        document.getElementById(
            "resetPlayerBtn"
        );

    if (!reset) return;

    reset.addEventListener(
        "click",
        () => {
            const confirmed =
                confirm(
                    "Reset all PNGPD LIVE player progress?"
                );

            if (!confirmed) {
                return;
            }

            if (
                typeof resetPlayer ===
                "function"
            ) {
                resetPlayer();
            }

            if (
                window.pngpdWorld
            ) {
                window.pngpdWorld.resetWorld();
            }
        }
    );
}

function showScreen(screenId) {
    document
        .querySelectorAll(
            ".screen"
        )
        .forEach(screen => {
            screen.classList.remove(
                "active"
            );
        });

    const screen =
        document.getElementById(
            screenId
        );

    if (screen) {
        screen.classList.add(
            "active"
        );
    }
}

function updateMainUI() {
    if (
        typeof updateHUD ===
        "function"
    ) {
        updateHUD();
    }
}

function showToast(message) {
    if (
        typeof showPlayerToast ===
        "function"
    ) {
        showPlayerToast(message);
        return;
    }

    const container =
        document.getElementById(
            "toastContainer"
        );

    if (!container) return;

    const toast =
        document.createElement(
            "div"
        );

    toast.className = "toast";
    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

window.pngpdGame = {
    showScreen,
    startAssessment,
    submitAssessment,
    openGeneralModal,
    closeGeneralModal,
    closeQuestionModal,
    updateMainUI
};
/* =========================================================
   PNGPD LIFE — SUPABASE AUTH CONNECTION
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const registerBtn =
        document.querySelector("#registerBtn") ||
        document.querySelector('[data-action="register"]');

    const loginBtn =
        document.querySelector("#loginBtn") ||
        document.querySelector('[data-action="login"]');

    if (registerBtn) {
        registerBtn.addEventListener("click", async () => {

            const fullName =
                document.querySelector("#fullName")?.value.trim();

            const email =
                document.querySelector("#email")?.value.trim();

            const password =
                document.querySelector("#password")?.value;

            if (!fullName || !email || !password) {
                alert("Please fill in your full name, email and password.");
                return;
            }

            try {

                registerBtn.disabled = true;
                registerBtn.textContent = "Creating account...";

                await window.PNGPDAuth.register(
                    fullName,
                    email,
                    password
                );

                alert(
                    "Account created successfully! Check your email if verification is required."
                );

            } catch (error) {

                console.error(error);

                alert(
                    error.message || "Registration failed."
                );

            } finally {

                registerBtn.disabled = false;
                registerBtn.textContent = "Register";

            }
        });
    }


    if (loginBtn) {
        loginBtn.addEventListener("click", async () => {

            const email =
                document.querySelector("#loginEmail")?.value.trim() ||
                document.querySelector("#email")?.value.trim();

            const password =
                document.querySelector("#loginPassword")?.value ||
                document.querySelector("#password")?.value;

            if (!email || !password) {
                alert("Enter your email and password.");
                return;
            }

            try {

                loginBtn.disabled = true;
                loginBtn.textContent = "Logging in...";

                await window.PNGPDAuth.login(
                    email,
                    password
                );

                alert("Login successful!");

                location.reload();

            } catch (error) {

                console.error(error);

                alert(
                    error.message || "Login failed."
                );

            } finally {

                loginBtn.disabled = false;
                loginBtn.textContent = "Login";

            }
        });
    }

});