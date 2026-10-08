// ==========================================
// PGP 122 EXAM CHALLENGE
// ==========================================

let currentMode = "mixed";
let lastMode = "mixed";

let questions = [];
let currentQuestion = 0;

let score = 0;
let timer = 60;

let timerInterval;
let answered = false;


// ==========================================
// QUESTION BANK
// ==========================================

const questionBank = [

    // ==========================
    // FILTRATION
    // ==========================

    {
        topic: "filtration",

        question:
        "In constant-pressure filtration, what happens as filtration time increases?",

        options: [
            "Pressure increases while flow rate remains constant",
            "Pressure is held constant while flow rate falls",
            "Both pressure and flow rate increase",
            "Both remain constant"
        ],

        answer: 1,

        explanation:
        "In constant-pressure filtration, the pressure drop is held constant while the flow rate decreases with time."
    },

    {
        topic: "filtration",

        question:
        "Which of the following is a type of filter?",

        options: [
            "Cake filter",
            "Steam filter",
            "Evaporator filter",
            "Agitation filter"
        ],

        answer: 0,

        explanation:
        "The handout classifies filters into cake filters, clarifying filters and cross-flow filters."
    },

    {
        topic: "filtration",

        question:
        "What is a filter aid?",

        options: [
            "A heating fluid",
            "A finely divided inert material added to improve filtration",
            "A type of impeller",
            "A membrane"
        ],

        answer: 1,

        explanation:
        "Filter aids improve filtration by increasing the permeability of the filter cake."
    },


    // ==========================
    // EVAPORATION
    // ==========================

    {
        topic: "evaporation",

        question:
        "Which of the following is an evaporator type?",

        options: [
            "Falling-film evaporator",
            "Cake evaporator",
            "Baffle evaporator",
            "Membrane evaporator"
        ],

        answer: 0,

        explanation:
        "Falling-film evaporator is one of the evaporator types in the handout."
    },

    {
        topic: "evaporation",

        question:
        "What happens in single-effect evaporation?",

        options: [
            "The vapour is used in every later effect",
            "The vapour is condensed and discarded",
            "The vapour becomes filter cake",
            "The vapour becomes solvent"
        ],

        answer: 1,

        explanation:
        "In single-effect evaporation, the vapour produced is condensed and discarded."
    },

    {
        topic: "evaporation",

        question:
        "What is multiple-effect evaporation?",

        options: [
            "Using several filters",
            "Using several evaporators where vapour from one effect supplies heat to another",
            "Using several membranes",
            "Using several solvents"
        ],

        answer: 1,

        explanation:
        "Multiple-effect evaporation uses a series of evaporators and reuses vapour heat."
    },


    // ==========================
    // MEMBRANE
    // ==========================

    {
        topic: "membrane",

        question:
        "What does membrane permeability describe?",

        options: [
            "The ability of a membrane to allow diffusion through it",
            "The thickness of a filter cake",
            "The speed of an impeller",
            "The boiling point of a liquid"
        ],

        answer: 0,

        explanation:
        "Permeability describes the ability of a membrane to allow a substance to diffuse through it."
    },

    {
        topic: "membrane",

        question:
        "Which two are common driving forces for membrane separation?",

        options: [
            "Pressure difference and concentration difference",
            "Temperature and gravity",
            "Cake thickness and viscosity",
            "Impeller speed and tank height"
        ],

        answer: 0,

        explanation:
        "The handout identifies pressure difference and concentration difference as common membrane driving forces."
    },


    // ==========================
    // MIXING
    // ==========================

    {
        topic: "mixing",

        question:
        "Which three main elements make up agitation equipment?",

        options: [
            "Vessel, baffles and impeller",
            "Membrane, cake and solvent",
            "Pump, condenser and filter",
            "Steam, vessel and membrane"
        ],

        answer: 0,

        explanation:
        "Agitation equipment consists essentially of the vessel, baffles and impeller."
    },

    {
        topic: "mixing",

        question:
        "Which method can be used to prevent swirling in a large tank with a vertical agitator?",

        options: [
            "Install baffles",
            "Remove the impeller",
            "Increase filter cake",
            "Add more solvent"
        ],

        answer: 0,

        explanation:
        "Baffles reduce rotational flow and are the preferred method for large tanks with vertical agitators."
    },


    // ==========================
    // LEACHING
    // ==========================

    {
        topic: "leaching",

        question:
        "What is leaching?",

        options: [
            "Preferential dissolution of a constituent of a solid using a liquid solvent",
            "Evaporation of a liquid",
            "Filtration of a gas",
            "Mixing two gases"
        ],

        answer: 0,

        explanation:
        "Leaching is the extraction of a soluble constituent from a solid by means of a solvent."
    },

    {
        topic: "leaching",

        question:
        "In leaching, what is the overflow?",

        options: [
            "The settled solid",
            "The liquid containing solute",
            "The fresh solid",
            "The filter cake"
        ],

        answer: 1,

        explanation:
        "The overflow is the liquid containing solute."
    },

    {
        topic: "leaching",

        question:
        "Which is a step involved in leaching?",

        options: [
            "Dissolving the soluble constituent in a selective solvent",
            "Installing baffles",
            "Increasing impeller speed",
            "Condensing steam"
        ],

        answer: 0,

        explanation:
        "Dissolving the soluble constituent in a selective solvent is the first major step in leaching."
    },


    // ==========================
    // BOSS MODE
    // ==========================

    {
        topic: "boss",

        question:
        "PAST-QUESTION STYLE: Differentiate between constant-rate and constant-pressure filtration.",

        options: [
            "Constant-rate keeps flow rate constant while pressure rises; constant-pressure keeps pressure constant while flow falls",
            "They are exactly the same",
            "Both keep pressure constant",
            "Both keep flow rate constant"
        ],

        answer: 0,

        explanation:
        "Constant-rate filtration maintains flow rate while pressure drop increases. Constant-pressure filtration maintains pressure drop while flow rate decreases."
    },

    {
        topic: "boss",

        question:
        "PAST-QUESTION STYLE: State three ways of preventing swirling.",

        options: [
            "Off-centre mounting, angular/side mounting and baffles",
            "Heating, cooling and filtration",
            "Forward feed, backward feed and mixed feed",
            "Cake, clarifying and cross-flow filtration"
        ],

        answer: 0,

        explanation:
        "The handout gives three methods: off-centre mounting, angular/side mounting and installation of baffles."
    },

    {
        topic: "boss",

        question:
        "PAST-QUESTION STYLE: What are the three main elements of agitation equipment?",

        options: [
            "Vessel, baffles and impeller",
            "Membrane, filter and solvent",
            "Pump, condenser and cake",
            "Steam, cake and membrane"
        ],

        answer: 0,

        explanation:
        "The three main elements are the vessel, baffles and impeller."
    }

];


// ==========================================
// START GAME
// ==========================================

function startGame(mode) {

    currentMode = mode;
    lastMode = mode;

    score = 0;
    currentQuestion = 0;

    let pool;

    if (mode === "mixed") {

        pool = questionBank.filter(
            q => q.topic !== "boss"
        );

    } else if (mode === "boss") {

        pool = questionBank.filter(
            q => q.topic === "boss"
        );

    } else {

        pool = questionBank.filter(
            q => q.topic === mode
        );
    }

    questions = shuffle(pool);

    // Maximum 10 questions per round
    questions = questions.slice(0, 10);

    document
        .getElementById("home")
        .classList.add("hidden");

    document
        .getElementById("result")
        .classList.add("hidden");

    document
        .getElementById("game")
        .classList.remove("hidden");

    showQuestion();
}


// ==========================================
// SHOW QUESTION
// ==========================================

function showQuestion() {

    answered = false;

    let q = questions[currentQuestion];

    document.getElementById("score")
        .textContent = score;

    document.getElementById("questionNumber")
        .textContent =
        `Question ${currentQuestion + 1} of ${questions.length}`;

    document.getElementById("question")
        .textContent = q.question;


    // Progress bar

    let progress =
        (currentQuestion / questions.length) * 100;

    document.getElementById("progressBar")
        .style.width = progress + "%";


    // Clear old answers

    let answers =
        document.getElementById("answers");

    answers.innerHTML = "";


    // Create answer buttons

    q.options.forEach((option, index) => {

        let button =
            document.createElement("button");

        button.className = "answer";

        button.textContent =
            `${String.fromCharCode(65 + index)}. ${option}`;

        button.onclick =
            () => checkAnswer(index);

        answers.appendChild(button);
    });


    document
        .getElementById("feedback")
        .textContent = "";


    document
        .getElementById("nextButton")
        .classList.add("hidden");


    startTimer();
}


// ==========================================
// CHECK ANSWER
// ==========================================

function checkAnswer(selected) {

    if (answered) return;

    answered = true;

    clearInterval(timerInterval);

    let q = questions[currentQuestion];

    let buttons =
        document.querySelectorAll(".answer");


    buttons.forEach(
        (button, index) => {

            button.disabled = true;

            if (index === q.answer) {

                button.classList.add("correct");
            }

            if (
                index === selected &&
                selected !== q.answer
            ) {

                button.classList.add("wrong");
            }
        }
    );


    let feedback =
        document.getElementById("feedback");


    if (selected === q.answer) {

        score += 10;

        feedback.innerHTML =
            `✅ <strong>Correct!</strong><br>${q.explanation}`;

    } else {

        feedback.innerHTML =
            `❌ <strong>Wrong.</strong><br>${q.explanation}`;
    }


    document.getElementById("score")
        .textContent = score;


    document
        .getElementById("nextButton")
        .classList.remove("hidden");
}


// ==========================================
// NEXT QUESTION
// ==========================================

function nextQuestion() {

    currentQuestion++;

    if (
        currentQuestion >= questions.length
    ) {

        showResults();

    } else {

        showQuestion();
    }
}


// ==========================================
// TIMER
// ==========================================

function startTimer() {

    clearInterval(timerInterval);

    timer = 60;

    document.getElementById("timer")
        .textContent = timer;


    timerInterval = setInterval(() => {

        timer--;

        document.getElementById("timer")
            .textContent = timer;


        if (timer <= 0) {

            clearInterval(timerInterval);

            if (!answered) {

                answered = true;

                let q =
                    questions[currentQuestion];

                document.getElementById("feedback")
                    .innerHTML =
                    `⏰ <strong>Time's up!</strong><br>${q.explanation}`;


                let buttons =
                    document.querySelectorAll(".answer");

                buttons.forEach(
                    (button, index) => {

                        button.disabled = true;

                        if (
                            index === q.answer
                        ) {

                            button.classList.add(
                                "correct"
                            );
                        }
                    }
                );


                document
                    .getElementById("nextButton")
                    .classList.remove("hidden");
            }
        }

    }, 1000);
}


// ==========================================
// RESULTS
// ==========================================

function showResults() {

    clearInterval(timerInterval);

    document
        .getElementById("game")
        .classList.add("hidden");

    document
        .getElementById("result")
        .classList.remove("hidden");


    let maximum =
        questions.length * 10;

    let percentage =
        Math.round((score / maximum) * 100);


    document.getElementById("finalScore")
        .textContent =
        `${score}/${maximum} — ${percentage}%`;


    let message;

    if (percentage >= 80) {

        message =
            "🔥 Excellent! You're becoming dangerous.";

    } else if (percentage >= 60) {

        message =
            "💪 Good work. Keep drilling the weak areas.";

    } else {

        message =
            "📚 Don't worry. Study the explanations and try again.";
    }


    document.getElementById("resultMessage")
        .textContent = message;
}


// ==========================================
// RETURN HOME
// ==========================================

function goHome() {

    clearInterval(timerInterval);

    document
        .getElementById("game")
        .classList.add("hidden");

    document
        .getElementById("result")
        .classList.add("hidden");

    document
        .getElementById("home")
        .classList.remove("hidden");
}


// ==========================================
// SHUFFLE
// ==========================================

function shuffle(array) {

    return array.sort(
        () => Math.random() - 0.5
    );
}