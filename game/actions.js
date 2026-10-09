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

function sendArenaChallenge(course) {

    showGeneralPanel(
        "⚔️ Challenge Ready",
        `
            <div class="panel-card">

                <h3>🎯 ${course} Battle</h3>

                <p>
                    Your challenge has been prepared.
                </p>

                <p>
                    The multiplayer invitation system will
                    connect you with another PNGPD student.
                </p>

                <span class="badge">
                    🧠 ${course}
                </span>

            </div>
        `
    );
}


function loadArenaInvitations() {

    showGeneralPanel(
        "📨 Battle Invitations",
        `
            <div class="panel-card">

                <h3>No Invitations Yet</h3>

                <p>
                    When another student challenges you,
                    their invitation will appear here.
                </p>

            </div>
        `
    );
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