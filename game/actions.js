/* =========================================================
   PNGPD LIFE — ARENA SYSTEM
   ========================================================= */


/* =========================================================
   ARENA MAIN MENU
   ========================================================= */

function openArena() {

    showGeneralPanel(
        "⚔️ PNGPD Arena",
        `
            <div class="panel-card">

                <h3>🏟️ PNGPD Arena</h3>

                <p>
                    Compete against other PNGPD students,
                    earn XP and prove your academic strength.
                </p>

                <div style="
                    display:grid;
                    gap:10px;
                    margin-top:18px;
                ">

                    <button
                        class="btn btn-primary btn-block"
                        onclick="openArenaBattle()"
                    >
                        ⚔️ 1v1 Battle
                    </button>

                    <button
                        class="btn btn-primary btn-block"
                        onclick="openChampionship()"
                    >
                        🏆 Championship
                    </button>

                    <button
                        class="btn btn-primary btn-block"
                        onclick="openArenaLeaderboard()"
                    >
                        📊 Arena Leaderboard
                    </button>

                    <button
                        class="btn btn-primary btn-block"
                        onclick="openArenaRecord()"
                    >
                        👤 My Arena Record
                    </button>

                </div>

            </div>

            <div class="panel-card" style="margin-top:12px;">

                <h3>🔥 Arena Rules</h3>

                <p>⚔️ Challenge another student.</p>
                <p>🧠 Both players answer the same questions.</p>
                <p>⏱️ You have limited time.</p>
                <p>🏆 Highest score wins.</p>
                <p>⭐ Winners earn Arena XP.</p>

            </div>
        `
    );
}


/* =========================================================
   1V1 BATTLE MENU
   ========================================================= */

function openArenaBattle() {

    showGeneralPanel(
        "⚔️ 1v1 Battle",
        `
            <div class="panel-card">

                <h3>⚔️ Challenge a Student</h3>

                <p>
                    Invite another PNGPD student to an
                    academic battle.
                </p>

                <button
                    class="btn btn-primary btn-block"
                    style="margin-top:15px"
                    onclick="createArenaChallenge()"
                >
                    🎯 Create Challenge
                </button>

            </div>

            <div class="panel-card" style="margin-top:12px;">

                <h3>📨 Invitations</h3>

                <p>
                    Check if another student has challenged you.
                </p>

                <button
                    class="btn btn-primary btn-block"
                    style="margin-top:15px"
                    onclick="loadArenaInvitations()"
                >
                    🔄 Check Invitations
                </button>

            </div>

            <div class="panel-card" style="margin-top:12px;">

                <h3>⚔️ My Active Battles</h3>

                <button
                    class="btn btn-primary btn-block"
                    style="margin-top:15px"
                    onclick="loadMyArenaMatches()"
                >
                    🔄 Check Battles
                </button>

            </div>
        `
    );
}


/* =========================================================
   CREATE CHALLENGE
   ========================================================= */

function createArenaChallenge() {

    showGeneralPanel(
        "🎯 Create Challenge",
        `
            <div class="panel-card">

                <h3>Choose Your Battle</h3>

                <p>
                    Select the course you want to battle with.
                </p>

                <div style="
                    display:grid;
                    gap:8px;
                    margin-top:15px;
                ">

                    ${[
                        "PGP 121",
                        "PGP 122",
                        "PGP 123",
                        "PGP 124",
                        "PGP 125",
                        "PGP 126",
                        "PGP 127"
                    ].map(course => `
                        <button
                            class="btn btn-primary btn-block"
                            onclick="sendArenaChallenge('${course}')"
                        >
                            ${course}
                        </button>
                    `).join("")}

                </div>

            </div>
        `
    );
}


/* =========================================================
   SEND CHALLENGE
   ========================================================= */

async function sendArenaChallenge(course) {

    try {

        if (!window.pngpdSupabase) {
            alert("Supabase is not connected.");
            return;
        }

        const {
            data: { user },
            error: userError
        } = await window.pngpdSupabase.auth.getUser();

        if (userError || !user) {
            alert("You must be logged in.");
            return;
        }

        showGeneralPanel(
            "🎯 Choose Opponent",
            `
                <div class="panel-card">

                    <h3>⚔️ ${course} Battle</h3>

                    <p>
                        Enter the username of the student
                        you want to challenge.
                    </p>

                    <input
                        id="arenaOpponentUsername"
                        type="text"
                        placeholder="Enter username"
                        style="
                            width:100%;
                            padding:12px;
                            margin-top:12px;
                            border-radius:8px;
                            border:1px solid rgba(255,255,255,.1);
                            background:#071522;
                            color:white;
                            box-sizing:border-box;
                        "
                    >

                    <button
                        class="btn btn-primary btn-block"
                        style="margin-top:12px"
                        onclick="findArenaOpponent('${course}')"
                    >
                        🔎 Find Player
                    </button>

                </div>
            `
        );

    } catch (error) {

        console.error(error);
        alert("Something went wrong.");
    }
}


/* =========================================================
   FIND OPPONENT
   ========================================================= */

async function findArenaOpponent(course) {

    const input =
        document.getElementById(
            "arenaOpponentUsername"
        );

    if (!input) return;

    const username =
        input.value.trim();

    if (!username) {
        alert("Enter a username first.");
        return;
    }

    try {

        const {
            data: { user },
            error: userError
        } = await window.pngpdSupabase.auth.getUser();

        if (userError || !user) {
            alert("Please log in first.");
            return;
        }

        const {
            data: players,
            error
        } = await window.pngpdSupabase
            .from("arena_profiles")
            .select("user_id, username")
            .ilike("username", username)
            .limit(1);

        if (error) {
            console.error(error);
            alert("Could not search for player.");
            return;
        }

        if (!players || players.length === 0) {
            alert("Player not found.");
            return;
        }

        const opponent =
            players[0];

        if (opponent.user_id === user.id) {
            alert("You cannot challenge yourself.");
            return;
        }

        const {
            data: match,
            error: matchError
        } = await window.pngpdSupabase
            .from("arena_matches")
            .insert({
                challenger_id: user.id,
                opponent_id: opponent.user_id,
                course: course,
                status: "pending"
            })
            .select()
            .single();

        if (matchError) {
            console.error(matchError);
            alert("Could not send challenge.");
            return;
        }

        showGeneralPanel(
            "⚔️ Challenge Sent",
            `
                <div class="panel-card">

                    <h3>🎯 Challenge Sent!</h3>

                    <p>
                        Your ${course} battle invitation
                        has been sent to:
                    </p>

                    <div class="badge"
                         style="margin-top:10px">
                        👤 ${opponent.username}
                    </div>

                    <p style="
                        margin-top:15px;
                        color:#9bb0c2;
                    ">
                        Waiting for the player to accept...
                    </p>

                    <button
                        class="btn btn-primary btn-block"
                        style="margin-top:15px"
                        onclick="loadMyArenaMatches()"
                    >
                        🔄 Check Battle Status
                    </button>

                </div>
            `
        );

    } catch (error) {

        console.error(error);
        alert("Something went wrong.");
    }
}


/* =========================================================
   LOAD INVITATIONS
   ========================================================= */

async function loadArenaInvitations() {

    try {

        const {
            data: { user },
            error: userError
        } = await window.pngpdSupabase.auth.getUser();

        if (userError || !user) {
            alert("Please log in first.");
            return;
        }

        const {
            data: invitations,
            error
        } = await window.pngpdSupabase
            .from("arena_matches")
            .select(`
                id,
                course,
                challenger_id,
                status,
                created_at
            `)
            .eq("opponent_id", user.id)
            .eq("status", "pending")
            .order("created_at", {
                ascending: false
            });

        if (error) {
            console.error(error);
            alert("Could not load invitations.");
            return;
        }

        if (!invitations ||
            invitations.length === 0) {

            showGeneralPanel(
                "📨 Invitations",
                `
                    <div class="panel-card">

                        <h3>📭 No Invitations</h3>

                        <p>
                            You don't have any pending
                            battle invitations.
                        </p>

                    </div>
                `
            );

            return;
        }

        let html = "";

        for (const invitation of invitations) {

            const {
                data: challenger
            } = await window.pngpdSupabase
                .from("arena_profiles")
                .select("username")
                .eq(
                    "user_id",
                    invitation.challenger_id
                )
                .single();

            const username =
                challenger?.username ||
                "Unknown Player";

            html += `
                <div class="panel-card"
                     style="margin-bottom:12px;">

                    <h3>⚔️ Battle Challenge</h3>

                    <p>
                        <strong>${username}</strong>
                        challenged you to a
                        <strong>${invitation.course}</strong>
                        battle.
                    </p>

                    <div style="
                        display:grid;
                        grid-template-columns:1fr 1fr;
                        gap:8px;
                        margin-top:15px;
                    ">

                        <button
                            class="btn btn-primary"
                            onclick="acceptArenaChallenge('${invitation.id}')"
                        >
                            ✅ Accept
                        </button>

                        <button
                            class="btn"
                            onclick="declineArenaChallenge('${invitation.id}')"
                        >
                            ❌ Decline
                        </button>

                    </div>

                </div>
            `;
        }

        showGeneralPanel(
            "📨 Battle Invitations",
            html
        );

    } catch (error) {

        console.error(error);
        alert("Something went wrong.");
    }
}


/* =========================================================
   ACCEPT CHALLENGE
   ========================================================= */

async function acceptArenaChallenge(matchId) {

    try {

        const {
            data: { user },
            error: userError
        } = await window.pngpdSupabase.auth.getUser();

        if (userError || !user) {
            alert("Please log in first.");
            return;
        }

        const {
            data: match,
            error: matchError
        } = await window.pngpdSupabase
            .from("arena_matches")
            .update({
                status: "accepted"
            })
            .eq("id", matchId)
            .eq("opponent_id", user.id)
            .eq("status", "pending")
            .select()
            .single();

        if (matchError || !match) {

            console.error(matchError);

            alert(
                "The challenge could not be accepted. " +
                "It may already have been handled."
            );

            return;
        }

        showGeneralPanel(
            "⚔️ Challenge Accepted",
            `
                <div class="panel-card">

                    <h3>✅ Battle Accepted!</h3>

                    <p>
                        ${match.course} battle is ready.
                    </p>

                    <button
                        class="btn btn-primary btn-block"
                        style="margin-top:18px"
                        onclick="startArenaMatch('${match.id}')"
                    >
                        🚀 Enter Battle
                    </button>

                </div>
            `
        );

    } catch (error) {

        console.error(error);
        alert("Something went wrong.");
    }
}


/* =========================================================
   DECLINE CHALLENGE
   ========================================================= */

async function declineArenaChallenge(matchId) {

    try {

        const {
            data: { user },
            error: userError
        } = await window.pngpdSupabase.auth.getUser();

        if (userError || !user) {
            alert("Please log in first.");
            return;
        }

        const {
            error
        } = await window.pngpdSupabase
            .from("arena_matches")
            .update({
                status: "declined"
            })
            .eq("id", matchId)
            .eq("opponent_id", user.id)
            .eq("status", "pending");

        if (error) {

            console.error(error);

            alert(
                "Could not decline challenge."
            );

            return;
        }

        showGeneralPanel(
            "📨 Invitation",
            `
                <div class="panel-card">

                    <h3>❌ Challenge Declined</h3>

                    <p>
                        The battle invitation has been declined.
                    </p>

                </div>
            `
        );

    } catch (error) {

        console.error(error);
        alert("Something went wrong.");
    }
}


/* =========================================================
   MY MATCHES
   ========================================================= */

async function loadMyArenaMatches() {

    try {

        const {
            data: { user },
            error: userError
        } = await window.pngpdSupabase.auth.getUser();

        if (userError || !user) {
            alert("Please log in first.");
            return;
        }

        const {
            data: matches,
            error
        } = await window.pngpdSupabase
            .from("arena_matches")
            .select("*")
            .or(
                `challenger_id.eq.${user.id},opponent_id.eq.${user.id}`
            )
            .in(
                "status",
                ["accepted", "active"]
            )
            .order(
                "created_at",
                { ascending:false }
            );

        if (error) {

            console.error(error);
            alert("Could not load battles.");

            return;
        }

        if (!matches ||
            matches.length === 0) {

            showGeneralPanel(
                "⚔️ My Battles",
                `
                    <div class="panel-card">

                        <h3>📭 No Active Battles</h3>

                        <p>
                            You don't have an accepted
                            or active battle.
                        </p>

                    </div>
                `
            );

            return;
        }

        let html = "";

        for (const match of matches) {

            const opponentId =
                match.challenger_id === user.id
                    ? match.opponent_id
                    : match.challenger_id;

            const {
                data: opponent
            } = await window.pngpdSupabase
                .from("arena_profiles")
                .select("username")
                .eq("user_id", opponentId)
                .single();

            const opponentName =
                opponent?.username ||
                "Opponent";

            html += `
                <div class="panel-card"
                     style="margin-bottom:12px;">

                    <h3>
                        ⚔️ ${match.course}
                    </h3>

                    <p>
                        Opponent:
                        <strong>${opponentName}</strong>
                    </p>

                    <p style="
                        margin-top:8px;
                        color:#9bb0c2;
                    ">
                        Status: ${match.status}
                    </p>

                    <button
                        class="btn btn-primary btn-block"
                        style="margin-top:12px"
                        onclick="startArenaMatch('${match.id}')"
                    >
                        🚀 Enter Battle
                    </button>

                </div>
            `;
        }

        showGeneralPanel(
            "⚔️ My Battles",
            html
        );

    } catch (error) {

        console.error(error);
        alert("Something went wrong.");
    }
}


/* =========================================================
   START ARENA MATCH
   ========================================================= */

async function startArenaMatch(matchId) {

    try {

        const {
            data: { user },
            error: userError
        } = await window.pngpdSupabase.auth.getUser();

        if (userError || !user) {
            alert("Please log in first.");
            return;
        }

        const {
            data: match,
            error: matchError
        } = await window.pngpdSupabase
            .from("arena_matches")
            .select("*")
            .eq("id", matchId)
            .single();

        if (matchError || !match) {

            console.error(matchError);

            alert(
                "Battle could not be found."
            );

            return;
        }

        if (
            match.challenger_id !== user.id &&
            match.opponent_id !== user.id
        ) {

            alert(
                "You are not part of this battle."
            );

            return;
        }

        if (
            match.status !== "accepted" &&
            match.status !== "active"
        ) {

            alert(
                "This battle is not ready yet."
            );

            return;
        }

        await prepareArenaQuestions(match);

        await window.pngpdSupabase
            .from("arena_matches")
            .update({
                status:"active"
            })
            .eq("id", matchId);

        loadArenaQuestions(matchId);

    } catch (error) {

        console.error(
            "Start arena match error:",
            error
        );

        alert(
            "Could not start the battle."
        );
    }
}


/* =========================================================
   PREPARE SAME QUESTIONS FOR BOTH PLAYERS
   ========================================================= */

async function prepareArenaQuestions(match) {

    const {
        data: existing,
        error: existingError
    } = await window.pngpdSupabase
        .from("arena_match_questions")
        .select("id")
        .eq("match_id", match.id);

    if (existingError) {

        console.error(existingError);

        throw existingError;
    }

    if (existing &&
        existing.length > 0) {

        return;
    }

    const bank =
        window.PNGPD_QUESTIONS ||
        window.questions ||
        [];

    const normalizeCourse = value =>
        String(value || "")
            .toUpperCase()
            .replace(
                /[^A-Z0-9]/g,
                ""
            );

    const questions =
        bank.filter(q =>
            normalizeCourse(
                q.course ||
                q.subject ||
                q.courseCode
            ) ===
            normalizeCourse(match.course)
        );

    if (questions.length === 0) {

        throw new Error(
            `No questions found for ${match.course}.`
        );
    }

    const shuffled =
        [...questions];

    for (
        let i = shuffled.length - 1;
        i > 0;
        i--
    ) {

        const j =
            Math.floor(
                Math.random() * (i + 1)
            );

        [
            shuffled[i],
            shuffled[j]
        ] = [
            shuffled[j],
            shuffled[i]
        ];
    }

    const selected =
        shuffled.slice(
            0,
            Math.min(10, shuffled.length)
        );

    const rows =
        selected.map(
            (q, index) => ({
                match_id: match.id,
                question_number: index + 1,
                question_text: q.question,
                option_a: q.options[0],
                option_b: q.options[1],
                option_c: q.options[2],
                option_d: q.options[3],
                correct_answer: q.answer
            })
        );

    const {
        error: insertError
    } = await window.pngpdSupabase
        .from("arena_match_questions")
        .insert(rows);

    if (insertError) {

        console.error(
            "Question creation error:",
            insertError
        );

        throw insertError;
    }
}


/* =========================================================
   LOAD BATTLE QUESTIONS
   ========================================================= */

async function loadArenaQuestions(matchId) {

    try {

        const {
            data: { user },
            error: userError
        } = await window.pngpdSupabase.auth.getUser();

        if (userError || !user) {
            alert("Please log in first.");
            return;
        }

        const {
            data: questions,
            error
        } = await window.pngpdSupabase
            .from("arena_match_questions")
            .select("*")
            .eq("match_id", matchId)
            .order(
                "question_number",
                { ascending:true }
            );

        if (error) {

            console.error(error);

            alert(
                "Could not load battle questions."
            );

            return;
        }

        if (!questions ||
            questions.length === 0) {

            alert(
                "Battle questions are not ready yet."
            );

            return;
        }

        startArenaQuiz(
            matchId,
            questions,
            user.id
        );

    } catch (error) {

        console.error(error);

        alert(
            "Could not load Arena questions."
        );
    }
}


/* =========================================================
   ARENA QUIZ
   ========================================================= */

function startArenaQuiz(
    matchId,
    questions,
    playerId
) {

    let current = 0;
    let score = 0;
    let startTime = Date.now();
    let timer = null;
    let answered = false;

    const totalTime =
        questions.length * 20;

    let remaining =
        totalTime;

    function render() {

        const q =
            questions[current];

        answered = false;

        const options = [
            q.option_a,
            q.option_b,
            q.option_c,
            q.option_d
        ];

        showGeneralPanel(
            "⚔️ Arena Battle",
            `
                <div class="panel-card">

                    <div style="
                        display:flex;
                        justify-content:space-between;
                        gap:10px;
                    ">

                        <strong>
                            Question
                            ${current + 1}/${questions.length}
                        </strong>

                        <strong>
                            ⭐ ${score}
                        </strong>

                    </div>

                    <div style="
                        margin-top:10px;
                        padding:8px;
                        background:#152536;
                        border-radius:8px;
                        text-align:center;
                    ">

                        ⏱️
                        <span id="arenaTimer">
                            ${remaining}
                        </span>s

                    </div>

                    <div style="
                        margin-top:18px;
                        padding:16px;
                        background:#152536;
                        border-radius:12px;
                    ">

                        <small style="
                            color:#9bb0c2;
                        ">
                            ${q.question_number}
                        </small>

                        <h3 style="
                            margin-top:10px;
                            line-height:1.6;
                        ">
                            ${q.question_text}
                        </h3>

                    </div>

                    <div
                        id="arenaOptions"
                        style="
                            margin-top:15px;
                            display:grid;
                            gap:9px;
                        "
                    >

                        ${options.map(
                            (option,index) => `
                                <button
                                    class="option"
                                    onclick="submitArenaAnswer(
                                        '${matchId}',
                                        '${q.id}',
                                        ${index},
                                        ${q.correct_answer},
                                        ${current},
                                        ${questions.length}
                                    )"
                                >
                                    ${String.fromCharCode(65 + index)}.
                                    ${option}
                                </button>
                            `
                        ).join("")}

                    </div>

                </div>
            `
        );

        clearInterval(timer);

        timer =
            setInterval(
                () => {

                    remaining--;

                    const timerElement =
                        document.getElementById(
                            "arenaTimer"
                        );

                    if (timerElement) {
                        timerElement.textContent =
                            remaining;
                    }

                    if (remaining <= 0) {

                        clearInterval(timer);

                        finishArenaQuiz(
                            matchId,
                            playerId,
                            score,
                            questions.length
                        );
                    }

                },
                1000
            );
    }

    window._arenaQuizState = {
        matchId,
        questions,
        playerId,
        getCurrent: () => current,
        advance: () => {
            current++;
        },
        getScore: () => score,
        addScore: () => {
            score++;
        },
        getStartTime: () => startTime
    };

    render();
}


/* =========================================================
   SUBMIT ARENA ANSWER
   ========================================================= */

async function submitArenaAnswer(
    matchId,
    questionId,
    selectedAnswer,
    correctAnswer,
    questionIndex,
    totalQuestions
) {

    const state =
        window._arenaQuizState;

    if (!state) return;

    if (
        state.matchId !== matchId
    ) {
        return;
    }

    const buttons =
        document.querySelectorAll(
            "#arenaOptions button"
        );

    buttons.forEach(
        button => {
            button.disabled = true;
        }
    );

    const isCorrect =
        Number(selectedAnswer) ===
        Number(correctAnswer);

    const answerTime =
        Date.now() -
        state.getStartTime();

    await window.pngpdSupabase
        .from("arena_answers")
        .insert({
            match_id: matchId,
            question_id: questionId,
            player_id: state.playerId,
            answer: selectedAnswer,
            is_correct: isCorrect,
            answer_time_ms: answerTime
        });

    if (isCorrect) {

        state.addScore();

    }

    const isLast =
        questionIndex >=
        totalQuestions - 1;

    if (isLast) {

        finishArenaQuiz(
            matchId,
            state.playerId,
            state.getScore(),
            totalQuestions
        );

        return;
    }

    state.advance();

    setTimeout(
        () => {

            const next =
                state.questions[
                    state.getCurrent()
                ];

            renderArenaQuestionAgain(
                matchId,
                state,
                next
            );

        },
        350
    );
}


/* =========================================================
   RENDER NEXT ARENA QUESTION
   ========================================================= */

function renderArenaQuestionAgain(
    matchId,
    state,
    q
) {

    const current =
        state.getCurrent();

    const options = [
        q.option_a,
        q.option_b,
        q.option_c,
        q.option_d
    ];

    showGeneralPanel(
        "⚔️ Arena Battle",
        `
            <div class="panel-card">

                <div style="
                    display:flex;
                    justify-content:space-between;
                ">

                    <strong>
                        Question
                        ${current + 1}/${state.questions.length}
                    </strong>

                    <strong>
                        ⭐ ${state.getScore()}
                    </strong>

                </div>

                <div style="
                    margin-top:18px;
                    padding:16px;
                    background:#152536;
                    border-radius:12px;
                ">

                    <h3 style="
                        line-height:1.6;
                    ">
                        ${q.question_text}
                    </h3>

                </div>

                <div
                    id="arenaOptions"
                    style="
                        margin-top:15px;
                        display:grid;
                        gap:9px;
                    "
                >

                    ${options.map(
                        (option,index) => `
                            <button
                                class="option"
                                onclick="submitArenaAnswer(
                                    '${matchId}',
                                    '${q.id}',
                                    ${index},
                                    ${q.correct_answer},
                                    ${current},
                                    ${state.questions.length}
                                )"
                            >
                                ${String.fromCharCode(65 + index)}.
                                ${option}
                            </button>
                        `
                    ).join("")}

                </div>

            </div>
        `
    );
}


/* =========================================================
   FINISH ARENA QUIZ
   ========================================================= */

async function finishArenaQuiz(
    matchId,
    playerId,
    score,
    total
) {

    if (
        window._arenaFinishedMatch ===
        matchId
    ) {
        return;
    }

    window._arenaFinishedMatch =
        matchId;

    const {
        data: match,
        error
    } = await window.pngpdSupabase
        .from("arena_matches")
        .select("*")
        .eq("id", matchId)
        .single();

    if (error || !match) {

        alert(
            "Could not finish battle."
        );

        return;
    }

    const isChallenger =
        match.challenger_id ===
        playerId;

    const updateData =
        isChallenger
            ? {
                challenger_score: score
            }
            : {
                opponent_score: score
            };

    const {
        error:updateError
    } = await window.pngpdSupabase
        .from("arena_matches")
        .update(updateData)
        .eq("id", matchId);

    if (updateError) {
        console.error(updateError);
    }

    showGeneralPanel(
        "🏁 Battle Finished",
        `
            <div class="panel-card">

                <h3>🏁 Your Battle Is Complete</h3>

                <h1 style="
                    text-align:center;
                    margin:20px 0;
                    color:#00d49b;
                ">
                    ${score}/${total}
                </h1>

                <p>
                    Waiting for your opponent to finish.
                </p>

                <button
                    class="btn btn-primary btn-block"
                    style="margin-top:18px"
                    onclick="checkArenaResult('${matchId}')"
                >
                    🔄 Check Result
                </button>

            </div>
        `
    );
}


/* =========================================================
   CHECK RESULT
   ========================================================= */

async function checkArenaResult(matchId) {

    try {

        const {
            data: { user }
        } = await window.pngpdSupabase.auth.getUser();

        const {
            data: match,
            error
        } = await window.pngpdSupabase
            .from("arena_matches")
            .select("*")
            .eq("id", matchId)
            .single();

        if (error || !match) {

            alert(
                "Could not load battle result."
            );

            return;
        }

        const challengerFinished =
            match.challenger_score !== null;

        const opponentFinished =
            match.opponent_score !== null;

        if (
            !challengerFinished ||
            !opponentFinished
        ) {

            showGeneralPanel(
                "⏳ Waiting",
                `
                    <div class="panel-card">

                        <h3>⏳ Opponent Still Playing</h3>

                        <p>
                            Your opponent has not
                            finished yet.
                        </p>

                        <button
                            class="btn btn-primary btn-block"
                            style="margin-top:15px"
                            onclick="checkArenaResult('${matchId}')"
                        >
                            🔄 Check Again
                        </button>

                    </div>
                `
            );

            return;
        }

        let winnerId = null;

        if (
            match.challenger_score >
            match.opponent_score
        ) {

            winnerId =
                match.challenger_id;

        } else if (
            match.opponent_score >
            match.challenger_score
        ) {

            winnerId =
                match.opponent_id;

        }

        await window.pngpdSupabase
            .from("arena_matches")
            .update({
                status:"completed",
                winner_id: winnerId
            })
            .eq("id", matchId);

        await updateArenaProfiles(
            match,
            winnerId
        );

        const draw =
            winnerId === null;

        const won =
            winnerId === user.id;

        showGeneralPanel(
            "🏆 Arena Result",
            `
                <div class="panel-card"
                     style="text-align:center;">

                    <h2>
                        ${draw
                            ? "🤝 DRAW"
                            : won
                                ? "🏆 YOU WON!"
                                : "❌ YOU LOST"}
                    </h2>

                    <div style="
                        margin:20px 0;
                        font-size:24px;
                    ">

                        ${match.challenger_score}
                        -
                        ${match.opponent_score}

                    </div>

                    <p>
                        ${draw
                            ? "Both players finished with the same score."
                            : won
                                ? "Excellent! You earned Arena XP."
                                : "Keep practising and challenge again."}
                    </p>

                </div>
            `
        );

    } catch (error) {

        console.error(error);

        alert(
            "Could not calculate result."
        );
    }
}


/* =========================================================
   UPDATE ARENA PROFILES
   ========================================================= */

async function updateArenaProfiles(
    match,
    winnerId
) {

    const players = [
        match.challenger_id,
        match.opponent_id
    ];

    for (const playerId of players) {

        const {
            data: profile
        } = await window.pngpdSupabase
            .from("arena_profiles")
            .select("*")
            .eq("user_id", playerId)
            .single();

        if (!profile) continue;

        const isWinner =
            winnerId === playerId;

        const isDraw =
            winnerId === null;

        await window.pngpdSupabase
            .from("arena_profiles")
            .update({

                battles_played:
                    (profile.battles_played || 0) + 1,

                wins:
                    (profile.wins || 0) +
                    (isWinner ? 1 : 0),

                losses:
                    (profile.losses || 0) +
                    (!isWinner && !isDraw ? 1 : 0),

                arena_xp:
                    (profile.arena_xp || 0) +
                    (
                        isWinner
                            ? 100
                            : isDraw
                                ? 40
                                : 20
                    )

            })
            .eq(
                "user_id",
                playerId
            );
    }
}


/* =========================================================
   ARENA LEADERBOARD
   ========================================================= */

async function openArenaLeaderboard() {

    try {

        const {
            data: players,
            error
        } = await window.pngpdSupabase
            .from("arena_profiles")
            .select(`
                username,
                battles_played,
                wins,
                losses,
                arena_xp
            `)
            .order(
                "arena_xp",
                { ascending:false }
            )
            .limit(10);

        if (error) {

            console.error(error);

            alert(
                "Could not load leaderboard."
            );

            return;
        }

        if (!players ||
            players.length === 0) {

            showGeneralPanel(
                "📊 Arena Leaderboard",
                `
                    <div class="panel-card">
                        <h3>🏆 No Rankings Yet</h3>
                        <p>
                            Be the first PNGPD Arena champion!
                        </p>
                    </div>
                `
            );

            return;
        }

        const medals = [
            "🥇",
            "🥈",
            "🥉"
        ];

        const html =
            players.map(
                (player,index) => `
                    <div class="panel-card"
                         style="
                            margin-bottom:8px;
                            display:flex;
                            justify-content:space-between;
                            gap:10px;
                         ">

                        <div>
                            <strong>
                                ${medals[index] || `${index + 1}.`}
                                ${player.username}
                            </strong>

                            <div style="
                                margin-top:4px;
                                color:#9bb0c2;
                                font-size:12px;
                            ">
                                ${player.wins}W /
                                ${player.losses}L
                            </div>
                        </div>

                        <strong>
                            ⭐ ${player.arena_xp}
                        </strong>

                    </div>
                `
            ).join("");

        showGeneralPanel(
            "📊 Arena Leaderboard",
            html
        );

    } catch (error) {

        console.error(error);
        alert("Something went wrong.");
    }
}


/* =========================================================
   PLAYER ARENA RECORD
   ========================================================= */

async function openArenaRecord() {

    try {

        const {
            data: { user },
            error: userError
        } = await window.pngpdSupabase.auth.getUser();

        if (userError || !user) {

            alert(
                "Please log in first."
            );

            return;
        }

        const {
            data: profile,
            error
        } = await window.pngpdSupabase
            .from("arena_profiles")
            .select("*")
            .eq("user_id", user.id)
            .single();

        if (error ||
            !profile) {

            showGeneralPanel(
                "👤 My Arena Record",
                `
                    <div class="panel-card">

                        <h3>
                            ⚔️ Arena Profile Not Found
                        </h3>

                        <p>
                            Your Arena profile will be
                            created when you enter your
                            first battle.
                        </p>

                    </div>
                `
            );

            return;
        }

        showGeneralPanel(
            "👤 My Arena Record",
            `
                <div class="panel-card">

                    <h3>⚔️ ${profile.username}</h3>

                    <div style="
                        display:grid;
                        gap:8px;
                        margin-top:15px;
                    ">

                        <span class="badge">
                            ⚔️ Battles:
                            ${profile.battles_played}
                        </span>

                        <span class="badge">
                            ✅ Wins:
                            ${profile.wins}
                        </span>

                        <span class="badge">
                            ❌ Losses:
                            ${profile.losses}
                        </span>

                        <span class="badge">
                            ⭐ Arena XP:
                            ${profile.arena_xp}
                        </span>

                        <span class="badge">
                            🏆 Championships:
                            ${profile.championship_wins}
                        </span>

                    </div>

                </div>
            `
        );

    } catch (error) {

        console.error(error);
        alert("Could not load Arena record.");
    }
}


/* =========================================================
   CHAMPIONSHIP MODE
   ========================================================= */

function openChampionship() {

    showGeneralPanel(
        "🏆 PNGPD Championship",
        `
            <div class="panel-card">

                <h3>
                    🏆 Become the PNGPD Champion
                </h3>

                <p>
                    Compete through multiple rounds
                    and become the top academic player.
                </p>

                <div style="
                    margin-top:15px;
                    display:grid;
                    gap:8px;
                ">

                    <div class="badge">
                        1️⃣ Qualifiers
                    </div>

                    <div class="badge">
                        2️⃣ Quarter-Finals
                    </div>

                    <div class="badge">
                        3️⃣ Semi-Finals
                    </div>

                    <div class="badge">
                        4️⃣ Grand Final
                    </div>

                </div>

                <button
                    class="btn btn-primary btn-block"
                    style="margin-top:18px"
                    onclick="joinChampionship()"
                >
                    🏆 Join Championship
                </button>

            </div>
        `
    );
}


function joinChampionship() {

    showGeneralPanel(
        "🏆 Championship",
        `
            <div class="panel-card">

                <h3>Registration</h3>

                <p>
                    Championship tournament registration
                    will be connected to the Arena system.
                </p>

                <button
                    class="btn btn-primary btn-block"
                    style="margin-top:15px"
                    onclick="closeModal()"
                >
                    Continue
                </button>

            </div>
        `
    );
}


/* =========================================================
   GLOBAL EXPORTS
   ========================================================= */

window.openArena =
    openArena;

window.openArenaBattle =
    openArenaBattle;

window.createArenaChallenge =
    createArenaChallenge;

window.sendArenaChallenge =
    sendArenaChallenge;

window.findArenaOpponent =
    findArenaOpponent;

window.loadArenaInvitations =
    loadArenaInvitations;

window.acceptArenaChallenge =
    acceptArenaChallenge;

window.declineArenaChallenge =
    declineArenaChallenge;

window.loadMyArenaMatches =
    loadMyArenaMatches;

window.startArenaMatch =
    startArenaMatch;

window.prepareArenaQuestions =
    prepareArenaQuestions;

window.loadArenaQuestions =
    loadArenaQuestions;

window.submitArenaAnswer =
    submitArenaAnswer;

window.checkArenaResult =
    checkArenaResult;

window.openArenaLeaderboard =
    openArenaLeaderboard;

window.openArenaRecord =
    openArenaRecord;

window.openChampionship =
    openChampionship;

window.joinChampionship =
    joinChampionship;