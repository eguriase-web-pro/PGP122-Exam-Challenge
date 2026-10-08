// ============================================
// PNGPD LIVE - MISSIONS SYSTEM
// game/missions.js
// ============================================

const MISSIONS_STORAGE_KEY = "pngpd_live_missions_v1";

const DEFAULT_MISSIONS = [
    {
        id: "daily-study",
        title: "Daily Study",
        description: "Answer 5 academic questions.",
        target: 5,
        progress: 0,
        rewardXP: 250,
        rewardMoney: 100000,
        completed: false
    },

    {
        id: "perfect-answer",
        title: "Sharp Student",
        description: "Answer 3 questions correctly.",
        target: 3,
        progress: 0,
        rewardXP: 300,
        rewardMoney: 150000,
        completed: false
    },

    {
        id: "streak-master",
        title: "Streak Master",
        description: "Reach a 5-question answer streak.",
        target: 5,
        progress: 0,
        rewardXP: 500,
        rewardMoney: 250000,
        completed: false
    },

    {
        id: "campus-explorer",
        title: "Campus Explorer",
        description: "Visit different locations around campus.",
        target: 3,
        progress: 0,
        rewardXP: 200,
        rewardMoney: 100000,
        completed: false
    }
];


// ============================================
// LOAD MISSIONS
// ============================================

function loadMissions() {

    try {

        const saved =
            localStorage.getItem(
                MISSIONS_STORAGE_KEY
            );

        if (!saved) {

            const missions =
                DEFAULT_MISSIONS.map(mission => ({
                    ...mission
                }));

            saveMissions(missions);

            return missions;
        }

        const parsed = JSON.parse(saved);

        if (!Array.isArray(parsed)) {
            return DEFAULT_MISSIONS.map(mission => ({
                ...mission
            }));
        }

        return parsed;

    } catch (error) {

        console.error(
            "Could not load missions:",
            error
        );

        return DEFAULT_MISSIONS.map(mission => ({
            ...mission
        }));
    }
}


// ============================================
// SAVE MISSIONS
// ============================================

function saveMissions(missions) {

    try {

        localStorage.setItem(
            MISSIONS_STORAGE_KEY,
            JSON.stringify(missions)
        );

        return true;

    } catch (error) {

        console.error(
            "Could not save missions:",
            error
        );

        return false;
    }
}


// ============================================
// GET MISSION
// ============================================

function getMission(missionId) {

    const missions =
        loadMissions();

    return missions.find(
        mission =>
            mission.id === missionId
    );
}


// ============================================
// UPDATE MISSION PROGRESS
// ============================================

function updateMissionProgress(
    missionId,
    amount = 1
) {

    const missions =
        loadMissions();

    const mission =
        missions.find(
            item =>
                item.id === missionId
        );

    if (!mission || mission.completed) {
        return false;
    }

    mission.progress =
        Math.min(
            mission.target,
            Number(mission.progress || 0)
            + Number(amount || 0)
        );

    if (
        mission.progress >=
        mission.target
    ) {

        completeMission(
            missionId
        );

    } else {

        saveMissions(missions);

        renderMissions();
    }

    return true;
}


// ============================================
// COMPLETE MISSION
// ============================================

function completeMission(missionId) {

    const missions =
        loadMissions();

    const mission =
        missions.find(
            item =>
                item.id === missionId
        );

    if (!mission || mission.completed) {
        return false;
    }

    mission.progress =
        mission.target;

    mission.completed = true;

    saveMissions(missions);

    if (typeof addXP === "function") {

        addXP(
            mission.rewardXP || 0
        );
    }

    if (typeof addMoney === "function") {

        addMoney(
            mission.rewardMoney || 0
        );
    }

    const currentPlayer =
        getActivePlayer();

    if (currentPlayer) {

        currentPlayer.missionsCompleted =
            Number(
                currentPlayer.missionsCompleted || 0
            ) + 1;

        currentPlayer.stats =
            currentPlayer.stats || {};

        currentPlayer.stats.studySessions =
            Number(
                currentPlayer.stats.studySessions || 0
            ) + 1;

        savePlayer(currentPlayer);
    }

    showPlayerToast(
        `🎯 Mission Complete: ${mission.title}!`
    );

    renderMissions();

    return true;
}


// ============================================
// RESET MISSIONS
// ============================================

function resetMissions() {

    const missions =
        DEFAULT_MISSIONS.map(mission => ({
            ...mission
        }));

    saveMissions(missions);

    renderMissions();

    return missions;
}


// ============================================
// RENDER MISSIONS
// ============================================

function renderMissions() {

    const container =
        document.getElementById(
            "missionsList"
        );

    if (!container) {
        return;
    }

    const missions =
        loadMissions();

    container.innerHTML =
        missions.map(mission => {

            const progress =
                Number(
                    mission.progress || 0
                );

            const target =
                Number(
                    mission.target || 1
                );

            const percentage =
                Math.min(
                    100,
                    (progress / target) * 100
                );

            return `

                <div class="mission-card
                    ${mission.completed
                        ? "completed"
                        : ""}">

                    <div class="mission-icon">
                        ${
                            mission.completed
                                ? "✅"
                                : "🎯"
                        }
                    </div>

                    <div class="mission-content">

                        <h3>
                            ${mission.title}
                        </h3>

                        <p>
                            ${mission.description}
                        </p>

                        <div class="mission-progress">

                            <div
                                class="mission-progress-fill"
                                style="width:${percentage}%"
                            ></div>

                        </div>

                        <small>
                            ${progress}/${target}
                        </small>

                    </div>

                    <div class="mission-reward">

                        <strong>
                            +${mission.rewardXP} XP
                        </strong>

                        <span>
                            ₦${Number(
                                mission.rewardMoney || 0
                            ).toLocaleString("en-NG")}
                        </span>

                    </div>

                </div>

            `;

        }).join("");
}


// ============================================
// QUESTION MISSION HOOK
// ============================================

function missionQuestionAnswered(correct) {

    updateMissionProgress(
        "daily-study",
        1
    );

    if (correct) {

        updateMissionProgress(
            "perfect-answer",
            1
        );
    }

    const player =
        getActivePlayer();

    if (
        player &&
        Number(player.streak || 0) >= 5
    ) {

        const mission =
            getMission(
                "streak-master"
            );

        if (
            mission &&
            !mission.completed
        ) {

            mission.progress = 5;

            saveMissions(
                loadMissions()
            );

            completeMission(
                "streak-master"
            );
        }
    }
}


// ============================================
// LOCATION MISSION HOOK
// ============================================

function missionLocationVisited() {

    updateMissionProgress(
        "campus-explorer",
        1
    );
}


// ============================================
// GLOBAL MISSIONS API
// ============================================

window.pngpdMissions = {

    loadMissions,
    saveMissions,

    getMission,

    updateMissionProgress,
    completeMission,

    resetMissions,

    renderMissions,

    missionQuestionAnswered,
    missionLocationVisited
};


// ============================================
// INITIALISE
// ============================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        setTimeout(() => {

            renderMissions();

        }, 200);

    }
);