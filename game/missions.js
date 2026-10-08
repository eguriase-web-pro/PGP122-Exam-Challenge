const MISSIONS = [

    {
        id: "study1",
        title: "First Study Session",
        description: "Answer 3 academic questions.",
        target: 3,
        reward: 500000,
        xp: 300
    },

    {
        id: "study2",
        title: "Academic Grinder",
        description: "Answer 10 academic questions.",
        target: 10,
        reward: 1500000,
        xp: 1000
    },

    {
        id: "correct1",
        title: "Sharp Brain",
        description: "Answer 5 questions correctly.",
        target: 5,
        reward: 1000000,
        xp: 700
    },

    {
        id: "level2",
        title: "Rising PNGPD Star",
        description: "Reach Level 2.",
        target: 2,
        reward: 2000000,
        xp: 500
    }

];

function getMissionProgress(mission) {

    if (mission.id === "study1" ||
        mission.id === "study2") {

        return player.questionsAnswered;
    }

    if (mission.id === "correct1") {

        return player.correctAnswers;
    }

    if (mission.id === "level2") {

        return player.level;
    }

    return 0;
}

function isMissionComplete(mission) {

    return getMissionProgress(mission) >= mission.target;
}

function claimMission(missionId) {

    const mission =
        MISSIONS.find(m => m.id === missionId);

    if (!mission) return;

    if (isMissionComplete(mission) === false) {
        showToast("Mission not completed yet.");
        return;
    }

    const key = `mission_${mission.id}`;

    if (localStorage.getItem(key)) {
        showToast("Mission reward already claimed.");
        return;
    }

    localStorage.setItem(key, "true");

    addMoney(mission.reward);
    addXP(mission.xp);

    player.missionsCompleted++;

    savePlayer();

    showToast(
        `🎯 Mission complete! +${formatMoney(mission.reward)}`
    );
}