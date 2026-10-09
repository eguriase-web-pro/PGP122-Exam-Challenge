/* =========================================================
   PNGPD LIFE 2.0
   GAME ACTIONS + ACADEMIC ARENA
========================================================= */


/* =========================================================
   PANEL BRIDGE
========================================================= */

function showGeneralPanel(title, content){

    if(
        window.PNGPD &&
        typeof window.PNGPD.openPanel === "function"
    ){

        window.PNGPD.openPanel(
            title,
            content
        );

    }else{

        console.error(
            "PNGPD panel system is not ready."
        );

    }

}

window.showGeneralPanel =
    showGeneralPanel;


/* =========================================================
   SUPABASE HELPER
========================================================= */

function getArenaSupabase(){

    return window.pngpdSupabase || null;

}


/* =========================================================
   CURRENT USER
========================================================= */

async function getCurrentArenaUser(){

    const supabase =
        getArenaSupabase();

    if(!supabase)
        return null;

    const {data,error} =
        await supabase.auth.getUser();

    if(error){

        console.error(error);

        return null;

    }

    return data.user || null;

}


/* =========================================================
   ARENA PROFILE
========================================================= */

async function ensureArenaProfile(){

    const supabase =
        getArenaSupabase();

    const user =
        await getCurrentArenaUser();

    if(!supabase || !user)
        return null;

    const {data,error} =
        await supabase
            .from("arena_profiles")
            .select("*")
            .eq("user_id",user.id)
            .maybeSingle();

    if(error){

        console.error(
            "Arena profile error:",
            error
        );

        return null;

    }

    if(data)
        return data;

    const username =
        user.user_metadata?.username ||
        user.user_metadata?.full_name ||
        user.email?.split("@")[0] ||
        "Player";

    const result =
        await supabase
            .from("arena_profiles")
            .insert({

                user_id:user.id,

                username:username

            })
            .select()
            .single();

    if(result.error){

        console.error(
            "Could not create arena profile:",
            result.error
        );

        return null;

    }

    return result.data;

}


/* =========================================================
   ARENA MAIN MENU
========================================================= */

async function openArena(){

    const profile =
        await ensureArenaProfile();

    if(!profile){

        showGeneralPanel(

            "🏟️ Arena",

            `

            <div class="panel-section">

                <h3>Arena unavailable</h3>

                <p class="muted" style="margin-top:8px;">
                    Please make sure you are logged in.
                </p>

            </div>

            `

        );

        return;

    }

    showGeneralPanel(

        "🏟️ PNGPD Academic Arena",

        `

        <div class="panel-section">

            <h3>
                Welcome, ${escapeArenaHTML(profile.username)}
            </h3>

            <p class="muted" style="margin-top:8px;">
                Challenge other PNGPD students,
                earn Arena XP and compete for championships.
            </p>

        </div>

        <button
            class="btn primary full"
            onclick="openArenaBattle()"
        >
            ⚔️ 1v1 BATTLE
        </button>

        <button
            class="btn primary full"
            onclick="openChampionship()"
        >
            🏆 CHAMPIONSHIP
        </button>

        <button
            class="btn secondary full"
            onclick="openArenaLeaderboard()"
        >
            📊 ARENA LEADERBOARD
        </button>

        <button
            class="btn secondary full"
            onclick="openArenaRecord()"
        >
            👤 MY ARENA RECORD
        </button>

        `

    );

}

window.openArena =
    openArena;


/* =========================================================
   1V1 MENU
========================================================= */

async function openArenaBattle(){

    const profile =
        await ensureArenaProfile();

    if(!profile)
        return;

    showGeneralPanel(

        "⚔️ 1v1 Battle",

        `

        <div class="arena-card">

            <h3>Create Challenge</h3>

            <p class="muted" style="margin-top:7px;">
                Challenge another student.
            </p>

            <button
                class="btn primary full"
                onclick="createArenaChallenge()"
            >
                ⚔️ CREATE CHALLENGE
            </button>

        </div>

        <div class="arena-card">

            <h3>Find Player</h3>

            <p class="muted" style="margin-top:7px;">
                Search for a student's Arena username.
            </p>

            <input
                id="arenaOpponentUsername"
                class="input"
                placeholder="Arena username"
            >

            <button
                class="btn primary full"
                onclick="findArenaOpponent()"
            >
                🔎 FIND PLAYER
            </button>

        </div>

        <div class="arena-card">

            <h3>Invitations</h3>

            <button
                class="btn secondary full"
                onclick="loadArenaInvitations()"
            >
                📩 CHECK INVITATIONS
            </button>

        </div>

        <div class="arena-card">

            <h3>My Battles</h3>

            <button
                class="btn secondary full"
                onclick="loadMyArenaMatches()"
            >
                ⚔️ MY ACTIVE BATTLES
            </button>

        </div>

        `

    );

}

window.openArenaBattle =
    openArenaBattle;


/* =========================================================
   CREATE CHALLENGE
========================================================= */

function createArenaChallenge(){

    showGeneralPanel(

        "⚔️ Create Challenge",

        `

        <div class="arena-card">

            <h3>Select Course</h3>

            <p class="muted" style="margin-top:8px;">
                Both players will answer questions
                from the selected course.
            </p>

            <button
                class="btn primary full"
                onclick="sendArenaChallenge('PGP 121')"
            >
                PGP 121
            </button>

            <button
                class="btn primary full"
                onclick="sendArenaChallenge('PGP 122')"
            >
                PGP 122
            </button>

            <button
                class="btn primary full"
                onclick="sendArenaChallenge('PGP 123')"
            >
                PGP 123
            </button>

            <button
                class="btn primary full"
                onclick="sendArenaChallenge('PGP 124')"
            >
                PGP 124
            </button>

            <button
                class="btn primary full"
                onclick="sendArenaChallenge('PGP 125')"
            >
                PGP 125
            </button>

            <button
                class="btn primary full"
                onclick="sendArenaChallenge('PGP 126')"
            >
                PGP 126
            </button>

            <button
                class="btn primary full"
                onclick="sendArenaChallenge('PGP 127')"
            >
                PGP 127
            </button>

            <button
                class="btn secondary full"
                onclick="sendArenaChallenge('MTH 101')"
            >
                MTH 101
            </button>

            <button
                class="btn secondary full"
                onclick="sendArenaChallenge('MTH 112')"
            >
                MTH 112
            </button>

            <button
                class="btn secondary full"
                onclick="sendArenaChallenge('GNS 101')"
            >
                GNS 101
            </button>

            <button
                class="btn secondary full"
                onclick="sendArenaChallenge('GNS 111')"
            >
                GNS 111
            </button>

        </div>

        `

    );

}

window.createArenaChallenge =
    createArenaChallenge;


/* =========================================================
   SEND CHALLENGE
========================================================= */

async function sendArenaChallenge(course){

    const supabase =
        getArenaSupabase();

    const user =
        await getCurrentArenaUser();

    if(!supabase || !user)
        return;

    const usernameInput =
        document.getElementById(
            "arenaOpponentUsername"
        );

    const username =
        usernameInput?.value.trim();

    if(!username){

        showGeneralPanel(

            "⚠️ Player Required",

            `

            <div class="arena-card">

                <p>
                    Go back and enter the opponent's
                    Arena username first.
                </p>

            </div>

            `

        );

        return;

    }

    const {data:opponent,error:findError} =
        await supabase
            .from("arena_profiles")
            .select("*")
            .ilike("username",username)
            .maybeSingle();

    if(findError){

        console.error(findError);

        showGeneralPanel(
            "Error",
            `<p>${escapeArenaHTML(findError.message)}</p>`
        );

        return;

    }

    if(!opponent){

        showGeneralPanel(

            "Player Not Found",

            `

            <div class="arena-card">

                <p>
                    No Arena player was found with
                    username:
                    <b>${escapeArenaHTML(username)}</b>
                </p>

            </div>

            `

        );

        return;

    }

    if(opponent.user_id === user.id){

        showGeneralPanel(

            "Invalid Challenge",

            `<p>You cannot challenge yourself.</p>`

        );

        return;

    }

    const {data,error} =
        await supabase
            .from("arena_matches")
            .insert({

                challenger_id:user.id,

                opponent_id:opponent.user_id,

                course:course,

                status:"pending"

            })
            .select()
            .single();

    if(error){

        console.error(error);

        showGeneralPanel(

            "Challenge Failed",

            `

            <div class="arena-card">

                <p>
                    ${escapeArenaHTML(error.message)}
                </p>

            </div>

            `

        );

        return;

    }

    showGeneralPanel(

        "✅ Challenge Sent",

        `

        <div class="arena-card">

            <h3>Challenge sent!</h3>

            <p style="margin-top:8px;">
                Opponent:
                <b>${escapeArenaHTML(opponent.username)}</b>
            </p>

            <p>
                Course:
                <b>${escapeArenaHTML(course)}</b>
            </p>

            <p class="muted" style="margin-top:8px;">
                Waiting for the opponent to accept.
            </p>

        </div>

        `

    );

}

window.sendArenaChallenge =
    sendArenaChallenge;


/* =========================================================
   FIND PLAYER
========================================================= */

async function findArenaOpponent(){

    const supabase =
        getArenaSupabase();

    const user =
        await getCurrentArenaUser();

    const input =
        document.getElementById(
            "arenaOpponentUsername"
        );

    const username =
        input?.value.trim();

    if(!supabase || !user)
        return;

    if(!username){

        PNGPD.toast(
            "Enter a username."
        );

        return;

    }

    const {data,error} =
        await supabase
            .from("arena_profiles")
            .select("*")
            .ilike("username",username)
            .maybeSingle();

    if(error){

        console.error(error);

        PNGPD.toast(
            error.message
        );

        return;

    }

    if(!data){

        showGeneralPanel(

            "🔎 Player Search",

            `

            <div class="arena-card">

                <h3>Player not found</h3>

                <p class="muted" style="margin-top:8px;">
                    Check the Arena username and try again.
                </p>

            </div>

            `

        );

        return;

    }

    showGeneralPanel(

        "👤 Player Found",

        `

        <div class="arena-card">

            <h3>
                ${escapeArenaHTML(data.username)}
            </h3>

            <p style="margin-top:8px;">
                ⚔️ Battles:
                ${data.battles_played || 0}
            </p>

            <p>
                🏆 Wins:
                ${data.wins || 0}
            </p>

            <p>
                ❌ Losses:
                ${data.losses || 0}
            </p>

            <p>
                ⭐ Arena XP:
                ${data.arena_xp || 0}
            </p>

        </div>

        <button
            class="btn primary full"
            onclick="createArenaChallenge()"
        >
            CHOOSE COURSE
        </button>

        `

    );

}

window.findArenaOpponent =
    findArenaOpponent;


/* =========================================================
   INVITATIONS
========================================================= */

async function loadArenaInvitations(){

    const supabase =
        getArenaSupabase();

    const user =
        await getCurrentArenaUser();

    if(!supabase || !user)
        return;

    const {data,error} =
        await supabase
            .from("arena_matches")
            .select("*")
            .eq("opponent_id",user.id)
            .eq("status","pending")
            .order("created_at",{ascending:false});

    if(error){

        console.error(error);

        showGeneralPanel(
            "Invitations",
            `<p>${escapeArenaHTML(error.message)}</p>`
        );

        return;

    }

    if(!data?.length){

        showGeneralPanel(

            "📩 Invitations",

            `

            <div class="arena-card">

                <h3>No pending invitations</h3>

                <p class="muted" style="margin-top:8px;">
                    You have no new Arena challenges.
                </p>

            </div>

            `

        );

        return;

    }

    let html = "";

    for(const match of data){

        html += `

        <div class="arena-card">

            <h3>
                ⚔️ ${escapeArenaHTML(match.course)}
            </h3>

            <p class="muted" style="margin-top:7px;">
                Challenge received.
            </p>

            <button
                class="btn primary"
                onclick="acceptArenaChallenge('${match.id}')"
            >
                ACCEPT
            </button>

            <button
                class="btn danger"
                onclick="declineArenaChallenge('${match.id}')"
            >
                DECLINE
            </button>

        </div>

        `;

    }

    showGeneralPanel(
        "📩 Arena Invitations",
        html
    );

}

window.loadArenaInvitations =
    loadArenaInvitations;


/* =========================================================
   ACCEPT CHALLENGE
========================================================= */

async function acceptArenaChallenge(matchId){

    const supabase =
        getArenaSupabase();

    const user =
        await getCurrentArenaUser();

    if(!supabase || !user)
        return;

    const {data,error} =
        await supabase
            .from("arena_matches")
            .update({
                status:"accepted"
            })
            .eq("id",matchId)
            .eq("opponent_id",user.id)
            .eq("status","pending")
            .select()
            .single();

    if(error){

        console.error(error);

        PNGPD.toast(
            error.message
        );

        return;

    }

    await prepareArenaQuestions(
        data
    );

    showGeneralPanel(

        "⚔️ Challenge Accepted",

        `

        <div class="arena-card">

            <h3>Ready for battle!</h3>

            <p style="margin-top:8px;">
                Course:
                <b>${escapeArenaHTML(data.course)}</b>
            </p>

            <button
                class="btn primary full"
                onclick="startArenaMatch('${data.id}')"
            >
                START BATTLE
            </button>

        </div>

        `

    );

}

window.acceptArenaChallenge =
    acceptArenaChallenge;


/* =========================================================
   DECLINE CHALLENGE
========================================================= */

async function declineArenaChallenge(matchId){

    const supabase =
        getArenaSupabase();

    const user =
        await getCurrentArenaUser();

    if(!supabase || !user)
        return;

    const {error} =
        await supabase
            .from("arena_matches")
            .update({
                status:"declined"
            })
            .eq("id",matchId)
            .eq("opponent_id",user.id)
            .eq("status","pending");

    if(error){

        console.error(error);

        PNGPD.toast(
            error.message
        );

        return;

    }

    PNGPD.toast(
        "Challenge declined."
    );

    await loadArenaInvitations();

}

window.declineArenaChallenge =
    declineArenaChallenge;


/* =========================================================
   MY MATCHES
========================================================= */

async function loadMyArenaMatches(){

    const supabase =
        getArenaSupabase();

    const user =
        await getCurrentArenaUser();

    if(!supabase || !user)
        return;

    const {data,error} =
        await supabase
            .from("arena_matches")
            .select("*")
            .or(
                `challenger_id.eq.${user.id},opponent_id.eq.${user.id}`
            )
            .in(
                "status",
                ["accepted","active"]
            )
            .order(
                "created_at",
                {ascending:false}
            );

    if(error){

        console.error(error);

        showGeneralPanel(
            "My Battles",
            `<p>${escapeArenaHTML(error.message)}</p>`
        );

        return;

    }

    if(!data?.length){

        showGeneralPanel(

            "⚔️ My Battles",

            `

            <div class="arena-card">

                <h3>No active battles</h3>

                <p class="muted" style="margin-top:8px;">
                    Create or accept a challenge to begin.
                </p>

            </div>

            `

        );

        return;

    }

    let html = "";

    for(const match of data){

        const opponent =
            match.challenger_id === user.id
            ? "Opponent"
            : "Challenger";

        html += `

        <div class="arena-card">

            <div class="match-row">

                <div>

                    <b>
                        ${escapeArenaHTML(match.course)}
                    </b>

                    <div class="muted">
                        ${escapeArenaHTML(match.status)}
                    </div>

                </div>

                <button
                    class="btn primary"
                    onclick="startArenaMatch('${match.id}')"
                >
                    ENTER
                </button>

            </div>

        </div>

        `;

    }

    showGeneralPanel(
        "⚔️ My Active Battles",
        html
    );

}

window.loadMyArenaMatches =
    loadMyArenaMatches;


/* =========================================================
   PREPARE QUESTIONS
========================================================= */

async function prepareArenaQuestions(match){

    const supabase =
        getArenaSupabase();

    if(!supabase || !match)
        return false;

    const {data:existing,error:readError} =
        await supabase
            .from("arena_match_questions")
            .select("id")
            .eq("match_id",match.id)
            .limit(1);

    if(readError){

        console.error(
            "Question read error:",
            readError
        );

    }

    if(existing?.length){

        return true;

    }

    let bank =
        window.PNGPD_QUESTIONS;

    let questions = [];

    if(Array.isArray(bank)){

        questions =
            bank.filter(q => {

                const course =
                    q.course ||
                    q.subject ||
                    q.code;

                return normalizeCourse(course)
                    ===
                    normalizeCourse(match.course);

            });

    }else if(
        bank &&
        typeof bank === "object"
    ){

        questions =
            bank[match.course] ||
            bank[match.course.replace(" ","")] ||
            [];

    }

    if(!questions.length){

        console.error(
            "No question bank found for",
            match.course
        );

        return false;

    }

    questions =
        [...questions]
        .sort(()=>Math.random()-.5)
        .slice(0,10);

    const rows =
        questions.map((q,index)=>({

            match_id:match.id,

            question_number:index+1,

            question_text:
                q.question ||
                q.question_text ||
                q.text ||
                "",

            option_a:
                q.option_a ??
                q.a ??
                q.options?.[0] ??
                "",

            option_b:
                q.option_b ??
                q.b ??
                q.options?.[1] ??
                "",

            option_c:
                q.option_c ??
                q.c ??
                q.options?.[2] ??
                "",

            option_d:
                q.option_d ??
                q.d ??
                q.options?.[3] ??
                "",

            correct_answer:
                q.correct_answer ??
                q.answer ??
                q.correctAnswer ??
                ""

        }));

    const {error} =
        await supabase
            .from("arena_match_questions")
            .insert(rows);

    if(error){

        /*
         * Another player may have created the
         * questions at the same time.
         * We simply re-check before failing.
         */

        const {data:check} =
            await supabase
                .from("arena_match_questions")
                .select("id")
                .eq("match_id",match.id)
                .limit(1);

        if(check?.length){

            return true;

        }

        console.error(
            "Question insertion failed:",
            error
        );

        return false;

    }

    return true;

}

window.prepareArenaQuestions =
    prepareArenaQuestions;


/* =========================================================
   LOAD QUESTIONS
========================================================= */

async function loadArenaQuestions(matchId){

    const supabase =
        getArenaSupabase();

    if(!supabase)
        return [];

    const {data,error} =
        await supabase
            .from("arena_match_questions")
            .select("*")
            .eq("match_id",matchId)
            .order(
                "question_number",
                {ascending:true}
            );

    if(error){

        console.error(error);

        return [];

    }

    return data || [];

}

window.loadArenaQuestions =
    loadArenaQuestions;


/* =========================================================
   START MATCH
========================================================= */

async function startArenaMatch(matchId){

    const supabase =
        getArenaSupabase();

    const user =
        await getCurrentArenaUser();

    if(!supabase || !user)
        return;

    const {data:match,error} =
        await supabase
            .from("arena_matches")
            .select("*")
            .eq("id",matchId)
            .maybeSingle();

    if(error){

        console.error(error);

        PNGPD.toast(
            error.message
        );

        return;

    }

    if(!match){

        PNGPD.toast(
            "Match not found."
        );

        return;

    }

    if(
        match.challenger_id !== user.id &&
        match.opponent_id !== user.id
    ){

        PNGPD.toast(
            "You are not part of this match."
        );

        return;

    }

    if(match.status === "accepted"){

        await supabase
            .from("arena_matches")
            .update({
                status:"active"
            })
            .eq("id",match.id)
            .eq("status","accepted");

    }

    const ready =
        await prepareArenaQuestions(
            match
        );

    if(!ready){

        showGeneralPanel(

            "⚠️ Arena Error",

            `

            <div class="arena-card">

                <h3>Questions could not be prepared.</h3>

                <p class="muted" style="margin-top:8px;">
                    Check that the course question bank
                    is loaded.
                </p>

            </div>

            `

        );

        return;

    }

    const questions =
        await loadArenaQuestions(
            match.id
        );

    if(!questions.length){

        PNGPD.toast(
            "No Arena questions found."
        );

        return;

    }

    startArenaQuiz(
        match,
        questions
    );

}

window.startArenaMatch =
    startArenaMatch;


/* =========================================================
   ARENA QUIZ
========================================================= */

function startArenaQuiz(match,questions){

    window._arenaQuiz = {

        match,

        questions,

        index:0,

        score:0,

        startedAt:Date.now(),

        answered:false

    };

    renderArenaQuestion();

}

window.startArenaQuiz =
    startArenaQuiz;


/* =========================================================
   RENDER QUESTION
========================================================= */

function renderArenaQuestion(){

    const quiz =
        window._arenaQuiz;

    if(!quiz)
        return;

    if(
        quiz.index >=
        quiz.questions.length
    ){

        finishArenaQuiz();

        return;

    }

    quiz.answered = false;

    const q =
        quiz.questions[quiz.index];

    const options = [

        q.option_a,

        q.option_b,

        q.option_c,

        q.option_d

    ];

    showGeneralPanel(

        `⚔️ ${quiz.match.course}`,

        `

        <div class="arena-card">

            <div class="match-row">

                <span>
                    Question ${quiz.index+1}/${quiz.questions.length}
                </span>

                <span class="badge">
                    Score: ${quiz.score}
                </span>

            </div>

            <h3 style="margin-top:15px;">
                ${escapeArenaHTML(q.question_text)}
            </h3>

        </div>

        <div>

            ${options.map((option,index)=>`

                <button
                    id="arenaOption${index}"
                    class="quiz-option"
                    onclick="submitArenaAnswer(${index})"
                >

                    <b>
                        ${String.fromCharCode(65+index)}.
                    </b>

                    ${escapeArenaHTML(option)}

                </button>

            `).join("")}

        </div>

        `

    );

}

window.renderArenaQuestion =
    renderArenaQuestion;


/* =========================================================
   SUBMIT ANSWER
========================================================= */

async function submitArenaAnswer(index){

    const quiz =
        window._arenaQuiz;

    if(!quiz || quiz.answered)
        return;

    quiz.answered = true;

    const supabase =
        getArenaSupabase();

    const user =
        await getCurrentArenaUser();

    const q =
        quiz.questions[quiz.index];

    const selected =
        String.fromCharCode(
            65 + index
        );

    const correct =
        String(
            q.correct_answer || ""
        )
        .trim()
        .toUpperCase();

    const isCorrect =
        selected === correct ||
        String(index) === correct;

    if(isCorrect){

        quiz.score++;

    }

    if(supabase && user){

        const answerTime =
            Date.now() -
            (quiz.startedAt || Date.now());

        const {error} =
            await supabase
                .from("arena_answers")
                .insert({

                    match_id:quiz.match.id,

                    question_id:q.id,

                    player_id:user.id,

                    answer:selected,

                    is_correct:isCorrect,

                    answer_time_ms:answerTime

                });

        if(error){

            console.error(
                "Arena answer error:",
                error
            );

        }

    }

    const selectedButton =
        document.getElementById(
            `arenaOption${index}`
        );

    if(selectedButton){

        selectedButton.classList.add(
            isCorrect
            ? "selected"
            : "wrong"
        );

    }

    setTimeout(()=>{

        quiz.index++;

        quiz.startedAt =
            Date.now();

        renderArenaQuestion();

    },500);

}

window.submitArenaAnswer =
    submitArenaAnswer;


/* =========================================================
   OLD COMPATIBILITY FUNCTION
========================================================= */

function renderArenaQuestionAgain(){

    renderArenaQuestion();

}

window.renderArenaQuestionAgain =
    renderArenaQuestionAgain;


/* =========================================================
   FINISH QUIZ
========================================================= */

async function finishArenaQuiz(){

    const quiz =
        window._arenaQuiz;

    if(!quiz)
        return;

    const score =
        quiz.score;

    const total =
        quiz.questions.length;

    const supabase =
        getArenaSupabase();

    const user =
        await getCurrentArenaUser();

    if(
        supabase &&
        user
    ){

        const {error} =
            await supabase
                .from("arena_matches")
                .update(
                    user.id ===
                    quiz.match.challenger_id
                    ? {
                        challenger_score:score
                    }
                    : {
                        opponent_score:score
                    }
                )
                .eq(
                    "id",
                    quiz.match.id
                );

        if(error){

            console.error(
                "Score update error:",
                error
            );

        }

    }

    PNGPD.addXP(
        score * 10
    );

    showGeneralPanel(

        "🏁 Battle Finished",

        `

        <div class="arena-card">

            <h2>
                ${score}/${total}
            </h2>

            <p class="muted" style="margin-top:8px;">
                Your score
            </p>

            <p style="margin-top:10px;">
                ⭐ +${score*10} XP
            </p>

        </div>

        <button
            class="btn primary full"
            onclick="checkArenaResult('${quiz.match.id}')"
        >
            CHECK RESULT
        </button>

        `

    );

    window._arenaQuiz = null;

}

window.finishArenaQuiz =
    finishArenaQuiz;


/* =========================================================
   CHECK RESULT
========================================================= */

async function checkArenaResult(matchId){

    const supabase =
        getArenaSupabase();

    const user =
        await getCurrentArenaUser();

    if(!supabase || !user)
        return;

    const {data:match,error} =
        await supabase
            .from("arena_matches")
            .select("*")
            .eq("id",matchId)
            .single();

    if(error){

        console.error(error);

        return;

    }

    /*
     * Do not rely on the score columns being NULL.
     * Count submitted answers instead.
     */

    const {data:answers} =
        await supabase
            .from("arena_answers")
            .select("player_id")
            .eq("match_id",matchId);

    const challengerAnswers =
        (answers || [])
        .filter(
            a =>
                a.player_id ===
                match.challenger_id
        )
        .length;

    const opponentAnswers =
        (answers || [])
        .filter(
            a =>
                a.player_id ===
                match.opponent_id
        )
        .length;

    const finished =
        challengerAnswers >= 10 &&
        opponentAnswers >= 10;

    if(!finished){

        showGeneralPanel(

            "⏳ Waiting",

            `

            <div class="arena-card">

                <h3>Battle not finished yet.</h3>

                <p class="muted" style="margin-top:8px;">
                    Both players must complete the questions.
                </p>

                <p style="margin-top:10px;">
                    Your opponent has not finished yet.
                </p>

            </div>

            `

        );

        return;

    }

    let winnerId = null;

    if(
        match.challenger_score >
        match.opponent_score
    ){

        winnerId =
            match.challenger_id;

    }else if(
        match.opponent_score >
        match.challenger_score
    ){

        winnerId =
            match.opponent_id;

    }

    const {error:updateError} =
        await supabase
            .from("arena_matches")
            .update({

                status:"completed",

                winner_id:winnerId

            })
            .eq(
                "id",
                matchId
            );

    if(updateError){

        console.error(updateError);

    }

    await updateArenaProfiles(
        match,
        winnerId
    );

    const youWon =
        winnerId === user.id;

    const draw =
        winnerId === null;

    showGeneralPanel(

        draw
        ? "🤝 DRAW"
        : youWon
        ? "🏆 YOU WON!"
        : "😔 YOU LOST",

        `

        <div class="arena-card">

            <h2>
                ${match.challenger_score}
                -
                ${match.opponent_score}
            </h2>

            <p class="muted" style="margin-top:8px;">
                Final Score
            </p>

        </div>

        `

    );

}

window.checkArenaResult =
    checkArenaResult;


/* =========================================================
   UPDATE ARENA PROFILES
========================================================= */

async function updateArenaProfiles(
    match,
    winnerId
){

    const supabase =
        getArenaSupabase();

    if(!supabase)
        return;

    const ids = [

        match.challenger_id,

        match.opponent_id

    ];

    for(const id of ids){

        const isWinner =
            winnerId === id;

        const isDraw =
            winnerId === null;

        const {data:profile} =
            await supabase
                .from("arena_profiles")
                .select("*")
                .eq("user_id",id)
                .maybeSingle();

        if(!profile)
            continue;

        await supabase
            .from("arena_profiles")
            .update({

                battles_played:
                    Number(
                        profile.battles_played || 0
                    ) + 1,

                wins:
                    Number(
                        profile.wins || 0
                    ) +
                    (
                        isWinner
                        ? 1
                        : 0
                    ),

                losses:
                    Number(
                        profile.losses || 0
                    ) +
                    (
                        !isWinner && !isDraw
                        ? 1
                        : 0
                    ),

                arena_xp:
                    Number(
                        profile.arena_xp || 0
                    ) +
                    (
                        isWinner
                        ? 50
                        : isDraw
                        ? 20
                        : 10
                    )

            })
            .eq(
                "user_id",
                id
            );

    }

}

window.updateArenaProfiles =
    updateArenaProfiles;


/* =========================================================
   LEADERBOARD
========================================================= */

async function openArenaLeaderboard(){

    const supabase =
        getArenaSupabase();

    if(!supabase)
        return;

    const {data,error} =
        await supabase
            .from("arena_profiles")
            .select("*")
            .order(
                "arena_xp",
                {ascending:false}
            )
            .limit(50);

    if(error){

        console.error(error);

        showGeneralPanel(
            "Leaderboard",
            `<p>${escapeArenaHTML(error.message)}</p>`
        );

        return;

    }

    let html = "";

    if(!data?.length){

        html = `

        <div class="arena-card">

            <h3>No players yet.</h3>

        </div>

        `;

    }else{

        data.forEach((player,index)=>{

            html += `

            <div class="match-row">

                <div>

                    <b>
                        #${index+1}
                        ${escapeArenaHTML(player.username)}
                    </b>

                    <div class="muted">
                        ${player.wins || 0}
                        wins
                    </div>

                </div>

                <span class="badge">
                    ⭐ ${player.arena_xp || 0}
                </span>

            </div>

            `;

        });

    }

    showGeneralPanel(

        "📊 Arena Leaderboard",

        `

        <div class="arena-card">

            ${html}

        </div>

        `

    );

}

window.openArenaLeaderboard =
    openArenaLeaderboard;


/* =========================================================
   MY RECORD
========================================================= */

async function openArenaRecord(){

    const profile =
        await ensureArenaProfile();

    if(!profile)
        return;

    const winRate =
        profile.battles_played
        ? Math.round(
            profile.wins /
            profile.battles_played *
            100
        )
        : 0;

    showGeneralPanel(

        "👤 My Arena Record",

        `

        <div class="arena-card">

            <h2>
                ${escapeArenaHTML(profile.username)}
            </h2>

            <p style="margin-top:12px;">
                ⚔️ Battles:
                ${profile.battles_played || 0}
            </p>

            <p>
                🏆 Wins:
                ${profile.wins || 0}
            </p>

            <p>
                ❌ Losses:
                ${profile.losses || 0}
            </p>

            <p>
                📈 Win Rate:
                ${winRate}%
            </p>

            <p>
                ⭐ Arena XP:
                ${profile.arena_xp || 0}
            </p>

            <p>
                🏆 Championships:
                ${profile.championship_wins || 0}
            </p>

        </div>

        `

    );

}

window.openArenaRecord =
    openArenaRecord;


/* =========================================================
   CHAMPIONSHIP
========================================================= */

async function openChampionship(){

    const supabase =
        getArenaSupabase();

    const user =
        await getCurrentArenaUser();

    if(!supabase || !user)
        return;

    const {data,error} =
        await supabase
            .from("arena_championships")
            .select("*")
            .order(
                "created_at",
                {ascending:false}
            );

    if(error){

        console.error(error);

        showGeneralPanel(
            "Championship",
            `<p>${escapeArenaHTML(error.message)}</p>`
        );

        return;

    }

    let html = "";

    if(!data?.length){

        html = `

        <div class="arena-card">

            <h3>No championship available.</h3>

            <p class="muted" style="margin-top:8px;">
                New competitions will appear here.
            </p>

        </div>

        `;

    }else{

        data.forEach(champ=>{

            html += `

            <div class="arena-card">

                <h3>
                    🏆
                    ${escapeArenaHTML(
                        champ.name ||
                        "PNGPD Championship"
                    )}
                </h3>

                <p class="muted" style="margin-top:8px;">
                    ${escapeArenaHTML(
                        champ.status || "open"
                    )}
                </p>

                <button
                    class="btn primary"
                    onclick="joinChampionship('${champ.id}')"
                >
                    JOIN
                </button>

            </div>

            `;

        });

    }

    showGeneralPanel(
        "🏆 Championship",
        html
    );

}

window.openChampionship =
    openChampionship;


/* =========================================================
   JOIN CHAMPIONSHIP
========================================================= */

async function joinChampionship(championshipId){

    const supabase =
        getArenaSupabase();

    const user =
        await getCurrentArenaUser();

    if(!supabase || !user)
        return;

    const {error} =
        await supabase
            .from("arena_championship_players")
            .insert({

                championship_id:
                    championshipId,

                player_id:
                    user.id

            });

    if(error){

        if(
            String(error.message)
            .toLowerCase()
            .includes("duplicate")
        ){

            PNGPD.toast(
                "You are already registered."
            );

            return;

        }

        console.error(error);

        showGeneralPanel(

            "Championship Error",

            `<p>${escapeArenaHTML(error.message)}</p>`

        );

        return;

    }

    showGeneralPanel(

        "🏆 Championship",

        `

        <div class="arena-card">

            <h3>Registration successful!</h3>

            <p class="muted" style="margin-top:8px;">
                You are now registered for the championship.
            </p>

        </div>

        `

    );

}

window.joinChampionship =
    joinChampionship;


/* =========================================================
   HELPERS
========================================================= */

function normalizeCourse(value){

    return String(value || "")
        .toLowerCase()
        .replace(/[^a-z0-9]/g,"");

}


function escapeArenaHTML(value){

    return String(value ?? "")
        .replace(/&/g,"&amp;")
        .replace(/</g,"&lt;")
        .replace(/>/g,"&gt;")
        .replace(/"/g,"&quot;")
        .replace(/'/g,"&#039;");

}


/* =========================================================
   GLOBAL COMPATIBILITY
========================================================= */

window.PNGPD_ARENA = {

    openArena,

    openArenaBattle,

    createArenaChallenge,

    sendArenaChallenge,

    findArenaOpponent,

    loadArenaInvitations,

    acceptArenaChallenge,

    declineArenaChallenge,

    loadMyArenaMatches,

    startArenaMatch,

    prepareArenaQuestions,

    loadArenaQuestions,

    startArenaQuiz,

    submitArenaAnswer,

    renderArenaQuestionAgain,

    finishArenaQuiz,

    checkArenaResult,

    updateArenaProfiles,

    openArenaLeaderboard,

    openArenaRecord,

    openChampionship,

    joinChampionship

};

console.log(
    "PNGPD LIFE Arena system loaded."
);