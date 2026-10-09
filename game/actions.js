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
                <p>🧠 Answer the same questions.</p>
                <p>⏱️ Beat the clock.</p>
                <p>🏆 Highest score wins.</p>
                <p>⭐ Winners earn XP and improve their ranking.</p>

            </div>
        `
    );
}


/* =========================================================
   ARENA — 1V1 BATTLE
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
                    Incoming battle invitations will appear here.
                </p>

                <button
                    class="btn btn-primary btn-block"
                    style="margin-top:15px"
                    onclick="loadArenaInvitations()"
                >
                    🔄 Check Invitations
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

                    <button
                        class="btn btn-primary btn-block"
                        onclick="sendArenaChallenge('PGP 121')"
                    >
                        PGP 121
                    </button>

                    <button
                        class="btn btn-primary btn-block"
                        onclick="sendArenaChallenge('PGP 122')"
                    >
                        PGP 122
                    </button>

                    <button
                        class="btn btn-primary btn-block"
                        onclick="sendArenaChallenge('PGP 123')"
                    >
                        PGP 123
                    </button>

                    <button
                        class="btn btn-primary btn-block"
                        onclick="sendArenaChallenge('PGP 124')"
                    >
                        PGP 124
                    </button>

                    <button
                        class="btn btn-primary btn-block"
                        onclick="sendArenaChallenge('PGP 125')"
                    >
                        PGP 125
                    </button>

                    <button
                        class="btn btn-primary btn-block"
                        onclick="sendArenaChallenge('PGP 126')"
                    >
                        PGP 126
                    </button>

                    <button
                        class="btn btn-primary btn-block"
                        onclick="sendArenaChallenge('PGP 127')"
                    >
                        PGP 127
                    </button>

                </div>

            </div>
        `
    );
}


/* =========================================================
   PLACEHOLDER — MULTIPLAYER CONNECTION
   ========================================================= */

async function sendArenaChallenge(course) {

    try {

        if (!window.pngpdSupabase) {
            showGeneralPanel(
                "⚠️ Arena",
                `<div class="panel-card">
                    <p>Supabase is not connected.</p>
                </div>`
            );
            return;
        }

        const {
            data: { user },
            error: userError
        } = await window.pngpdSupabase.auth.getUser();

        if (userError || !user) {
            showGeneralPanel(
                "🔐 Login Required",
                `<div class="panel-card">
                    <p>You must be logged in to challenge another student.</p>
                </div>`
            );
            return;
        }

        showGeneralPanel(
            "🎯 Choose Opponent",
            `
                <div class="panel-card">

                    <h3>⚔️ ${course} Battle</h3>

                    <p>
                        Enter the username of the PNGPD student
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
                            border:1px solid var(--border);
                            background:var(--card);
                            color:inherit;
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

        console.error("Arena challenge error:", error);

        showGeneralPanel(
            "⚠️ Arena Error",
            `<div class="panel-card">
                <p>Something went wrong. Please try again.</p>
            </div>`
        );
    }
}
async function findArenaOpponent(course) {

    const input = document.getElementById("arenaOpponentUsername");

    if (!input) return;

    const username = input.value.trim();

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

        const { data: players, error } =
            await window.pngpdSupabase
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

        const opponent = players[0];

        if (opponent.user_id === user.id) {
            alert("You cannot challenge yourself.");
            return;
        }

        const { data: match, error: matchError } =
            await window.pngpdSupabase
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

                    <div class="badge" style="margin-top:10px">
                        👤 ${opponent.username}
                    </div>

                    <p style="
                        margin-top:15px;
                        color:var(--muted);
                    ">
                        Waiting for the player to accept...
                    </p>

                </div>
            `
        );

    } catch (error) {

        console.error("Challenge error:", error);

        alert("Something went wrong.");
    }
}
/* =========================================================
   ARENA — INVITATIONS
   ========================================================= */

async function loadArenaInvitations() {

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
            alert("Please log in first.");
            return;
        }

        const { data: invitations, error } =
            await window.pngpdSupabase
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

        if (!invitations || invitations.length === 0) {

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

            const { data: challenger } =
                await window.pngpdSupabase
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

        console.error(
            "Invitation error:",
            error
        );

        alert("Something went wrong.");
    }
}


async function acceptArenaChallenge(matchId) {

    try {

        const { error } =
            await window.pngpdSupabase
                .from("arena_matches")
                .update({
                    status: "accepted"
                })
                .eq("id", matchId)
                .eq("status", "pending");

        if (error) {
            console.error(error);
            alert("Could not accept challenge.");
            return;
        }

        showGeneralPanel(
            "⚔️ Challenge Accepted",
            `
                <div class="panel-card">

                    <h3>✅ Battle Accepted!</h3>

                    <p>
                        Your opponent has been notified.
                    </p>

                    <p>
                        The battle system will start next.
                    </p>

                </div>
            `
        );

    } catch (error) {

        console.error(error);
        alert("Something went wrong.");
    }
}


async function declineArenaChallenge(matchId) {

    try {

        const { error } =
            await window.pngpdSupabase
                .from("arena_matches")
                .update({
                    status: "declined"
                })
                .eq("id", matchId)
                .eq("status", "pending");

        if (error) {
            console.error(error);
            alert("Could not decline challenge.");
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
async function startArenaMatch(matchId) {

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
            alert("Please log in first.");
            return;
        }

        const { data: match, error: matchError } =
            await window.pngpdSupabase
                .from("arena_matches")
                .select("*")
                .eq("id", matchId)
                .single();

        if (matchError || !match) {
            console.error(matchError);
            alert("Battle could not be found.");
            return;
        }

        if (
            match.challenger_id !== user.id &&
            match.opponent_id !== user.id
        ) {
            alert("You are not part of this battle.");
            return;
        }

        if (match.status !== "accepted" &&
            match.status !== "active") {

            alert("This battle is not ready yet.");
            return;
        }

        await window.pngpdSupabase
            .from("arena_matches")
            .update({
                status: "active"
            })
            .eq("id", matchId);

        showGeneralPanel(
            "⚔️ Arena Battle",
            `
                <div class="panel-card">

                    <h3>⚔️ ${match.course}</h3>

                    <p>
                        Your opponent has accepted the challenge.
                    </p>

                    <p>
                        Both players will receive the same
                        questions.
                    </p>

                    <button
                        class="btn btn-primary btn-block"
                        style="margin-top:18px"
                        onclick="loadArenaQuestions('${matchId}')"
                    >
                        🚀 Start Battle
                    </button>

                </div>
            `
        );

    } catch (error) {

        console.error(
            "Start arena match error:",
            error
        );

        alert("Could not start the battle.");
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

                <h3>🏆 Become the PNGPD Champion</h3>

                <p>
                    Compete through multiple rounds and
                    become the top academic player in your class.
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
                    Championship registration will connect
                    players into the tournament bracket.
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
   ARENA LEADERBOARD
   ========================================================= */

function openArenaLeaderboard() {

    showGeneralPanel(
        "📊 Arena Leaderboard",
        `
            <div class="panel-card">

                <h3>🏆 Top PNGPD Players</h3>

                <div style="
                    margin-top:15px;
                    display:grid;
                    gap:8px;
                ">

                    <div class="badge">
                        🥇 Champion — Awaiting Players
                    </div>

                    <div class="badge">
                        🥈 2nd Place — —
                    </div>

                    <div class="badge">
                        🥉 3rd Place — —
                    </div>

                </div>

                <p style="
                    margin-top:15px;
                    color:var(--muted);
                ">
                    Rankings will update automatically as
                    students compete.
                </p>

            </div>
        `
    );
}


/* =========================================================
   PLAYER ARENA RECORD
   ========================================================= */

function openArenaRecord() {

    showGeneralPanel(
        "👤 My Arena Record",
        `
            <div class="panel-card">

                <h3>⚔️ Your Record</h3>

                <div style="
                    display:grid;
                    gap:8px;
                    margin-top:15px;
                ">

                    <span class="badge">
                        ⚔️ Battles: 0
                    </span>

                    <span class="badge">
                        ✅ Wins: 0
                    </span>

                    <span class="badge">
                        ❌ Losses: 0
                    </span>

                    <span class="badge">
                        🏆 Championships: 0
                    </span>

                </div>

            </div>
        `
    );
}
window.sendArenaChallenge = sendArenaChallenge;
window.findArenaOpponent = findArenaOpponent;
window.loadArenaInvitations = loadArenaInvitations;
window.acceptArenaChallenge = acceptArenaChallenge;
window.declineArenaChallenge = declineArenaChallenge;;