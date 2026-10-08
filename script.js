// ==========================================
// PGP 122 LIFE
// SEPARATION WARS
// ==========================================


// ==========================================
// PLAYER DATA
// ==========================================

let player = JSON.parse(
    localStorage.getItem("pgp122Player")
) || {

    name: "Patrick",

    money: 5000000,

    xp: 0,

    level: 1,

    streak: 0,

    bestScore: 0,

    totalEarned: 0,

    dailyClaimed: false

};


// ==========================================
// GAME VARIABLES
// ==========================================

let questions = [];

let currentQuestion = 0;

let score = 0;

let lives = 3;

let timer = 60;

let timerInterval;

let answered = false;

let lastMode = "mixed";

let earnedThisGame = 0;

let xpThisGame = 0;


// ==========================================
// QUESTION BANK
// ==========================================

const questionBank = [

    // ==========================
    // FILTRATION
    // ==========================

    {
        topic: "filtration",

        difficulty: "easy",

        reward: 100000,

        question:
        "Filtration is best described as:",

        options: [

            "The removal of solid particles from a fluid using a filtering medium",

            "The evaporation of a liquid",

            "The mixing of two liquids",

            "The heating of a solid"

        ],

        answer: 0,

        explanation:
        "Filtration removes solid particles from a fluid by passing the fluid through a filtering medium."
    },


    {
        topic: "filtration",

        difficulty: "medium",

        reward: 250000,

        question:
        "What is the liquid that passes through a filter medium called?",

        options: [

            "Filter cake",

            "Residue",

            "Filtrate",

            "Slurry"

        ],

        answer: 2,

        explanation:
        "The clarified liquid discharged from the filter is called the filtrate."
    },


    {
        topic: "filtration",

        difficulty: "medium",

        reward: 250000,

        question:
        "In constant-pressure filtration, what generally happens to the filtration rate as filtration proceeds?",

        options: [

            "It increases continuously",

            "It decreases",

            "It becomes infinite",

            "It always remains constant"

        ],

        answer: 1,

        explanation:
        "As cake builds up, resistance to flow increases. At constant pressure, the filtration rate therefore decreases."
    },


    {
        topic: "filtration",

        difficulty: "hard",

        reward: 750000,

        question:
        "Which statement correctly distinguishes constant-rate filtration from constant-pressure filtration?",

        options: [

            "Constant-rate maintains flow rate while pressure drop changes; constant-pressure maintains pressure drop while flow rate changes",

            "Both maintain constant pressure",

            "Both maintain constant flow rate",

            "Constant-rate filtration does not involve pressure"

        ],

        answer: 0,

        explanation:
        "In constant-rate filtration, the flow rate is maintained and pressure changes. In constant-pressure filtration, the pressure drop is maintained and the flow rate changes."
    },


    // ==========================
    // EVAPORATION
    // ==========================

    {
        topic: "evaporation",

        difficulty: "easy",

        reward: 100000,

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
        "A falling-film evaporator is one of the common types of evaporators."
    },


    {
        topic: "evaporation",

        difficulty: "medium",

        reward: 250000,

        question:
        "In single-effect evaporation, what happens to the vapour produced?",

        options: [

            "It is used in every later effect",

            "It is normally condensed and discarded",

            "It becomes filter cake",

            "It becomes the feed"

        ],

        answer: 1,

        explanation:
        "In a single-effect evaporator, the vapour produced is normally condensed and discarded rather than reused in another effect."
    },


    {
        topic: "evaporation",

        difficulty: "hard",

        reward: 750000,

        question:
        "What is the main principle of multiple-effect evaporation?",

        options: [

            "Several filters are operated together",

            "Vapour from one effect supplies heat to another effect",

            "Several membranes are placed in series",

            "The feed is repeatedly frozen"

        ],

        answer: 1,

        explanation:
        "Multiple-effect evaporation improves steam economy by using vapour produced in one effect as the heating medium for another."
    },


    // ==========================
    // MEMBRANE
    // ==========================

    {
        topic: "membrane",

        difficulty: "easy",

        reward: 100000,

        question:
        "Which of the following can act as a driving force for membrane separation?",

        options: [

            "Pressure difference",

            "Cake thickness only",

            "Impeller diameter only",

            "Filter residue"

        ],

        answer: 0,

        explanation:
        "Pressure difference is one of the common driving forces for membrane separation."
    },


    {
        topic: "membrane",

        difficulty: "medium",

        reward: 250000,

        question:
        "What does membrane permeability describe?",

        options: [

            "The ability of a membrane to allow a substance to pass through it",

            "The weight of the membrane",

            "The boiling point of the feed",

            "The size of an impeller"

        ],

        answer: 0,

        explanation:
        "Permeability describes how readily a substance can pass through a membrane."
    },


    // ==========================
    // MIXING
    // ==========================

    {
        topic: "mixing",

        difficulty: "easy",

        reward: 100000,

        question:
        "Mixing is the random distribution of:",

        options: [

            "Two or more initially separate phases",

            "Only gases",

            "Only solids",

            "Only liquids"

        ],

        answer: 0,

        explanation:
        "Mixing involves the random distribution of two or more initially separate phases."
    },


    {
        topic: "mixing",

        difficulty: "medium",

        reward: 250000,

        question:
        "Which three are major components of a typical agitation vessel?",

        options: [

            "Vessel, baffles and impeller",

            "Membrane, cake and solvent",

            "Pump, condenser and filter",

            "Steam, membrane and cake"

        ],

        answer: 0,

        explanation:
        "The major components include the vessel, baffles and impeller."
    },


    {
        topic: "mixing",

        difficulty: "medium",

        reward: 250000,

        question:
        "Which method can be used to prevent swirling in an agitation vessel?",

        options: [

            "Installing baffles",

            "Removing the impeller",

            "Removing the vessel",

            "Increasing filter cake thickness"

        ],

        answer: 0,

        explanation:
        "Baffles interrupt rotational motion and help prevent swirling."
    },


    // ==========================
    // LEACHING
    // ==========================

    {
        topic: "leaching",

        difficulty: "easy",

        reward: 100000,

        question:
        "What is leaching?",

        options: [

            "Preferential dissolution of a constituent of a solid using a liquid solvent",

            "Evaporation of a solvent",

            "Filtration of a gas",

            "Mixing two gases"

        ],

        answer: 0,

        explanation:
        "Leaching is the extraction of a soluble constituent from a solid using a suitable liquid solvent."
    },


    {
        topic: "leaching",

        difficulty: "medium",

        reward: 250000,

        question:
        "In a leaching operation, the overflow is generally:",

        options: [

            "The settled solid",

            "The liquid containing dissolved solute",

            "The fresh solid feed",

            "The filter cake"

        ],

        answer: 1,

        explanation:
        "The overflow is the liquid stream containing dissolved solute."
    },


    // ==========================
    // BOSS QUESTIONS
    // ==========================

    {
        topic: "boss",

        difficulty: "expert",

        reward: 2000000,

        question:
        "PAST-QUESTION STYLE: Which of the following best represents the difference between constant-rate and constant-pressure filtration?",

        options: [

            "Constant-rate keeps flow rate constant while pressure changes; constant-pressure keeps pressure constant while flow rate changes",

            "Both keep pressure constant",

            "Both keep flow rate constant",

            "Neither involves pressure"

        ],

        answer: 0,

        explanation:
        "This distinction is fundamental to filtration analysis."
    },


    {
        topic: "boss",

        difficulty: "expert",

        reward: 2000000,

        question:
        "PAST-QUESTION STYLE: Which set contains three methods of preventing swirling?",

        options: [

            "Off-centre mounting, angular/side mounting and baffles",

            "Heating, cooling and filtration",

            "Cake, residue and filtrate",

            "Evaporation, condensation and boiling"

        ],

        answer: 0,

        explanation:
        "Common methods include off-centre mounting, angular/side mounting and the use of baffles."
    },


    {
        topic: "boss",

        difficulty: "expert",

        reward: 3000000,

        question:
        "PAST-QUESTION STYLE: State the three main components of agitation equipment.",

        options: [

            "Vessel, baffles and impeller",

            "Filter, membrane and solvent",

            "Pump, condenser and cake",

            "Steam, cake and membrane"

        ],

        answer: 0,

        explanation:
        "The three main components are the vessel, baffles and impeller."
    }

];


// ==========================================
// SAVE PLAYER
// ==========================================

function savePlayer() {

    localStorage.setItem(
        "pgp122Player",
        JSON.stringify(player)
    );

}


// ==========================================
// UPDATE UI
// ==========================================

function updateUI() {

    document.getElementById("money")
        .textContent =
        formatMoney(player.money);

    document.getElementById("level")
        .textContent =
        player.level;

    document.getElementById("xp")
        .textContent =
        player.xp;

    document.getElementById("streak")
        .textContent =
        player.streak;

    document.getElementById("bestScore")
        .textContent =
        player.bestScore;

    document.getElementById("totalEarned")
        .textContent =
        formatMoney(player.totalEarned);


    let xpNeeded =
        player.level * 1000;

    let xpProgress =
        (player.xp % xpNeeded) /
        xpNeeded *
        100;

    document.getElementById("xpBar")
        .style.width =
        xpProgress + "%";


    document.getElementById("gameMoney")
        .textContent =
        formatMoney(player.money);

    document.getElementById("gameXP")
        .textContent =
        player.xp;


    updateLeaderboard();

}


// ==========================================
// FORMAT MONEY
// ==========================================

function formatMoney(amount) {

    return "₦" +
        amount.toLocaleString();

}


// ==========================================
// START GAME
// ==========================================

function startGame(mode) {

    lastMode = mode;

    currentQuestion = 0;

    score = 0;

    lives = 3;

    earnedThisGame = 0;

    xpThisGame = 0;


    let pool;


    if (mode === "mixed") {

        pool =
            questionBank.filter(
                q => q.topic !== "boss"
            );

    }

    else if (mode === "boss") {

        pool =
            questionBank.filter(
                q => q.topic === "boss"
            );

    }

    else {

        pool =
            questionBank.filter(
                q => q.topic === mode ||
                     q.topic === "boss"
            );

    }


    questions =
        shuffle([...pool]);


    // Number of questions

    if (mode === "boss") {

        questions =
            questions.slice(0, 10);

    }

    else {

        questions =
            questions.slice(0, 10);

    }


    document
        .getElementById("home")
        .classList.add("hidden");


    document
        .getElementById("result")
        .classList.add("hidden");


    document
        .getElementById("game")
        .classList.remove("hidden");


    let names = {

        mixed: "⚡ QUICK PLAY",

        survival: "❤️ SURVIVAL",

        coin: "💰 COIN RUSH",

        boss: "👑 BOSS MODE"

    };


    document.getElementById("modeName")
        .textContent =
        names[mode];


    showQuestion();

}


// ==========================================
// SHOW QUESTION
// ==========================================

function showQuestion() {

    answered = false;

    let q =
        questions[currentQuestion];


    document.getElementById("questionNumber")
        .textContent =
        `Question ${currentQuestion + 1} / ${questions.length}`;


    document.getElementById("question")
        .textContent =
        q.question;


    document.getElementById("difficulty")
        .textContent =
        q.difficulty.toUpperCase();


    document.getElementById("lives")
        .textContent =
        lives;


    let progress =
        currentQuestion /
        questions.length *
        100;


    document.getElementById("progressBar")
        .style.width =
        progress + "%";


    let answers =
        document.getElementById("answers");


    answers.innerHTML = "";


    q.options.forEach(
        (option, index) => {

            let button =
                document.createElement("button");


            button.className =
                "answer";


            button.textContent =
                `${String.fromCharCode(65 + index)}. ${option}`;


            button.onclick =
                () => checkAnswer(index);


            answers.appendChild(button);

        }
    );


    document
        .getElementById("feedback")
        .classList.add("hidden");


    document
        .getElementById("nextButton")
        .classList.add("hidden");


    startTimer();

}


// ==========================================
// CHECK ANSWER
// ==========================================

function checkAnswer(selected) {

    if (answered)
        return;


    answered = true;


    clearInterval(timerInterval);


    let q =
        questions[currentQuestion];


    let buttons =
        document.querySelectorAll(".answer");


    buttons.forEach(
        (button, index) => {

            button.disabled = true;


            if (index === q.answer) {

                button.classList.add(
                    "correct"
                );

            }


            if (
                index === selected &&
                selected !== q.answer
            ) {

                button.classList.add(
                    "wrong"
                );

            }

        }
    );


    let feedback =
        document.getElementById("feedback");


    feedback.classList.remove(
        "hidden"
    );


    if (selected === q.answer) {

        score += 10;


        player.streak++;


        let reward =
            q.reward;


        // Streak bonus

        if (player.streak >= 3) {

            reward += 100000;

        }


        if (player.streak >= 5) {

            reward += 250000;

        }


        player.money += reward;

        player.totalEarned += reward;


        let gainedXP = 100;


        if (q.difficulty === "medium")
            gainedXP = 150;


        if (q.difficulty === "hard")
            gainedXP = 250;


        if (q.difficulty === "expert")
            gainedXP = 500;


        player.xp += gainedXP;


        earnedThisGame += reward;

        xpThisGame += gainedXP;


        checkLevelUp();


        feedback.innerHTML =

            `✅ <strong>CORRECT!</strong><br><br>

            💰 +${formatMoney(reward)}<br>

            ⭐ +${gainedXP} XP<br><br>

            📚 ${q.explanation}`;

    }

    else {

        player.streak = 0;


        if (lastMode === "survival") {

            lives--;

        }


        feedback.innerHTML =

            `❌ <strong>WRONG!</strong><br><br>

            <strong>Correct answer:</strong>
            ${q.options[q.answer]}<br><br>

            📚 ${q.explanation}`;


        if (lastMode === "survival") {

            document.getElementById("lives")
                .textContent =
                lives;

        }

    }


    savePlayer();

    updateUI();


    document
        .getElementById("nextButton")
        .classList.remove("hidden");

}


// ==========================================
// LEVEL UP
// ==========================================

function checkLevelUp() {

    let needed =
        player.level * 1000;


    while (player.xp >= needed) {

        player.xp -= needed;

        player.level++;

        player.money += 1000000;

        player.totalEarned += 1000000;


        alert(
            `🎉 LEVEL UP!\n\nYou are now Level ${player.level}!\n\n💰 Level-up reward: ₦1,000,000`
        );


        needed =
            player.level * 1000;

    }

}


// ==========================================
// NEXT QUESTION
// ==========================================

function nextQuestion() {

    if (
        lastMode === "survival" &&
        lives <= 0
    ) {

        showResults();

        return;

    }


    currentQuestion++;


    if (
        currentQuestion >=
        questions.length
    ) {

        showResults();

    }

    else {

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
        .textContent =
        timer;


    timerInterval =
        setInterval(() => {

            timer--;


            document.getElementById("timer")
                .textContent =
                timer;


            if (timer <= 0) {

                clearInterval(
                    timerInterval
                );


                if (!answered) {

                    answered = true;


                    let q =
                        questions[currentQuestion];


                    player.streak = 0;


                    if (
                        lastMode === "survival"
                    ) {

                        lives--;

                    }


                    let buttons =
                        document.querySelectorAll(
                            ".answer"
                        );


                    buttons.forEach(
                        (button, index) => {

                            button.disabled =
                                true;


                            if (
                                index === q.answer
                            ) {

                                button.classList.add(
                                    "correct"
                                );

                            }

                        }
                    );


                    let feedback =
                        document.getElementById(
                            "feedback"
                        );


                    feedback.classList.remove(
                        "hidden"
                    );


                    feedback.innerHTML =

                        `⏰ <strong>TIME'S UP!</strong><br><br>

                        Correct answer:
                        ${q.options[q.answer]}<br><br>

                        📚 ${q.explanation}`;


                    document
                        .getElementById(
                            "nextButton"
                        )
                        .classList.remove(
                            "hidden"
                        );


                    savePlayer();

                    updateUI();

                }

            }

        }, 1000);

}


// ==========================================
// RESULTS
// ==========================================

function showResults() {

    clearInterval(timerInterval);


    if (
        score >
        player.bestScore
    ) {

        player.bestScore =
            score;

    }


    savePlayer();

    updateUI();


    document
        .getElementById("game")
        .classList.add("hidden");


    document
        .getElementById("result")
        .classList.remove("hidden");


    let maximum =
        questions.length * 10;


    let percentage =
        Math.round(
            score /
            maximum *
            100
        );


    document.getElementById("finalScore")
        .textContent =
        `${score} / ${maximum} — ${percentage}%`;


    document.getElementById("earnedMoney")
        .textContent =
        formatMoney(
            earnedThisGame
        );


    document.getElementById("earnedXP")
        .textContent =
        xpThisGame;


    let message;


    if (percentage >= 80) {

        message =
            "🔥 Excellent! You're becoming a PGP 122 monster.";

    }

    else if (percentage >= 60) {

        message =
            "💪 Good job. Keep drilling your weak areas.";

    }

    else {

        message =
            "📚 Don't worry. Study the explanations and try again.";

    }


    document.getElementById("resultMessage")
        .textContent =
        message;

}


// ==========================================
// DAILY REWARD
// ==========================================

function claimDailyReward() {

    if (player.dailyClaimed) {

        alert(
            "🎁 You already collected today's reward!"
        );

        return;

    }


    let reward =
        500000;


    player.money += reward;

    player.totalEarned += reward;


    player.dailyClaimed =
        true;


    savePlayer();

    updateUI();


    alert(
        `🎁 DAILY REWARD!\n\nYou received ₦${reward.toLocaleString()}!`
    );

}


// ==========================================
// HOME
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


    updateUI();

}


// ==========================================
// LEADERBOARD
// ==========================================

function updateLeaderboard() {

    let players = [

        {
            name: "Sammy",
            xp: 12840
        },

        {
            name: "Favour",
            xp: 9750
        },

        {
            name: "Daniel",
            xp: 8430
        },

        {
            name: "Praise",
            xp: 7890
        },

        {
            name: player.name,
            xp: player.xp
        }

    ];


    players.sort(
        (a, b) =>
            b.xp - a.xp
    );


    let list =
        document.getElementById(
            "leaderboardList"
        );


    list.innerHTML = "";


    players
        .slice(0, 5)
        .forEach(
            (p, index) => {

                let row =
                    document.createElement(
                        "div"
                    );


                row.className =
                    "leader-row";


                let medals = [
                    "🥇",
                    "🥈",
                    "🥉",
                    "4️⃣",
                    "5️⃣"
                ];


                row.innerHTML =

                    `<span class="rank">
                        ${medals[index]}
                        ${p.name}
                    </span>

                    <strong>
                        ⭐ ${p.xp.toLocaleString()} XP
                    </strong>`;


                list.appendChild(row);

            }
        );

}


// ==========================================
// SHUFFLE
// ==========================================

function shuffle(array) {

    for (
        let i = array.length - 1;
        i > 0;
        i--
    ) {

        let j =
            Math.floor(
                Math.random() *
                (i + 1)
            );


        [
            array[i],
            array[j]
        ] = [
            array[j],
            array[i]
        ];

    }


    return array;

}


// ==========================================
// INITIALIZE
// ==========================================

updateUI();