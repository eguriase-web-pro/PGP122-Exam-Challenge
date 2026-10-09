// PNGPD LIFE 2.0
// Core Game State
// Inspired by the life-simulation structure of Lagos Life,
// but designed specifically for PNGPD/PTI student life.

const defaultGameState = {
  // =========================
  // PLAYER
  // =========================
  player: {
    id: null,
    name: "",
    nickname: "",
    gender: "",
    age: 18,

    // Current position
    location: "PTI Gate",
    x: 400,
    y: 300,

    // Basic needs
    hunger: 80,
    energy: 80,
    hygiene: 80,
    fun: 70,
    social: 60,

    // Character development
    intelligence: 50,
    confidence: 50,
    reputation: 0,

    // Academic
    academicLevel: 1,
    semester: 1,
    attendance: 100,
    gpa: 0,

    // Money
    money: 5000,

    // Status
    health: 100,

    // Inventory
    inventory: [],

    // Skills
    skills: {
      engineering: 0,
      computer: 0,
      communication: 0,
      mathematics: 0,
      practical: 0
    }
  },

  // =========================
  // GAME TIME
  // =========================
  time: {
    day: 1,
    hour: 7,
    minute: 0,
    week: 1,
    semesterWeek: 1
  },

  // =========================
  // PLAYER COURSES
  // =========================
  courses: {
    PGP111: {
      name: "Introduction to Petroleum & Gas Processing",
      score: 0,
      attendance: 100,
      grade: null
    },

    PGP114: {
      name: "Petroleum & Natural Gas Processing",
      score: 0,
      attendance: 100,
      grade: null
    },

    PGP115: {
      name: "Process Principles",
      score: 0,
      attendance: 100,
      grade: null
    },

    PGP122: {
      name: "Engineering Materials",
      score: 0,
      attendance: 100,
      grade: null
    },

    MTH101: {
      name: "Mathematics",
      score: 0,
      attendance: 100,
      grade: null
    },

    ENE101: {
      name: "Engineering Fundamentals",
      score: 0,
      attendance: 100,
      grade: null
    },

    GNS101: {
      name: "General Studies",
      score: 0,
      attendance: 100,
      grade: null
    }
  },

  // =========================
  // PLAYER HOME
  // =========================
  home: {
    type: "hostel",
    room: null,
    roommates: [],
    rentPaid: false
  },

  // =========================
  // RELATIONSHIPS
  // =========================
  relationships: {},

  // =========================
  // NPCs
  // =========================
  npcs: [],

  // =========================
  // JOBS
  // =========================
  job: {
    current: null,
    experience: 0,
    salary: 0
  },

  // =========================
  // WORLD
  // =========================
  world: {
    unlockedLocations: [
      "PTI Gate",
      "Main Campus",
      "Department"
    ],

    discoveredLocations: [],

    weather: "sunny",

    events: []
  },

  // =========================
  // GAME PROGRESS
  // =========================
  progress: {
    tutorialCompleted: false,
    assessmentCompleted: false,
    registered: false,
    firstDayCompleted: false
  }
};


// ======================================
// GAME STATE MANAGER
// ======================================

let gameState = JSON.parse(
  localStorage.getItem("pngpdLifeState")
) || structuredClone(defaultGameState);


// ======================================
// SAVE GAME
// ======================================

function saveGame() {
  localStorage.setItem(
    "pngpdLifeState",
    JSON.stringify(gameState)
  );

  console.log("PNGPD LIFE saved.");
}


// ======================================
// RESET GAME
// ======================================

function resetGame() {
  gameState = structuredClone(defaultGameState);
  saveGame();

  console.log("PNGPD LIFE reset.");
}


// ======================================
// CHANGE PLAYER MONEY
// ======================================

function changeMoney(amount) {
  gameState.player.money += amount;

  if (gameState.player.money < 0) {
    gameState.player.money = 0;
  }

  saveGame();
}


// ======================================
// CHANGE PLAYER NEED
// ======================================

function changeNeed(need, amount) {
  if (
    gameState.player[need] === undefined
  ) {
    console.warn(`Need "${need}" does not exist.`);
    return;
  }

  gameState.player[need] += amount;

  gameState.player[need] = Math.max(
    0,
    Math.min(100, gameState.player[need])
  );

  saveGame();
}


// ======================================
// ADVANCE GAME TIME
// ======================================

function advanceTime(minutes) {
  gameState.time.minute += minutes;

  while (gameState.time.minute >= 60) {
    gameState.time.minute -= 60;
    gameState.time.hour++;
  }

  while (gameState.time.hour >= 24) {
    gameState.time.hour -= 24;
    gameState.time.day++;
    gameState.time.semesterWeek =
      Math.ceil(gameState.time.day / 7);
  }

  saveGame();
}


// ======================================
// CHANGE LOCATION
// ======================================

function changeLocation(location) {
  if (
    !gameState.world.unlockedLocations.includes(location)
  ) {
    console.log(
      `${location} is not unlocked yet.`
    );
    return false;
  }

  gameState.player.location = location;

  if (
    !gameState.world.discoveredLocations.includes(location)
  ) {
    gameState.world.discoveredLocations.push(location);
  }

  saveGame();

  return true;
}


// ======================================
// ADD ITEM
// ======================================

function addItem(item) {
  gameState.player.inventory.push(item);
  saveGame();
}


// ======================================
// REMOVE ITEM
// ======================================

function removeItem(item) {
  const index =
    gameState.player.inventory.indexOf(item);

  if (index !== -1) {
    gameState.player.inventory.splice(index, 1);
    saveGame();
  }
}


// ======================================
// ADD RELATIONSHIP
// ======================================

function updateRelationship(
  npcId,
  amount
) {
  if (
    gameState.relationships[npcId] === undefined
  ) {
    gameState.relationships[npcId] = 0;
  }

  gameState.relationships[npcId] += amount;

  gameState.relationships[npcId] =
    Math.max(
      -100,
      Math.min(
        100,
        gameState.relationships[npcId]
      )
    );

  saveGame();
}


// ======================================
// IMPROVE SKILL
// ======================================

function improveSkill(
  skill,
  amount
) {
  if (
    gameState.player.skills[skill] === undefined
  ) {
    console.warn(
      `Skill "${skill}" does not exist.`
    );
    return;
  }

  gameState.player.skills[skill] += amount;

  saveGame();
}


// ======================================
// ATTEND CLASS
// ======================================

function attendClass(courseCode) {
  const course =
    gameState.courses[courseCode];

  if (!course) {
    console.warn(
      `Course ${courseCode} does not exist.`
    );
    return;
  }

  course.attendance += 1;

  if (course.attendance > 100) {
    course.attendance = 100;
  }

  gameState.player.attendance += 1;

  if (gameState.player.attendance > 100) {
    gameState.player.attendance = 100;
  }

  course.score += 2;

  advanceTime(120);

  changeNeed("energy", -10);
  changeNeed("fun", -5);

  improveSkill("engineering", 1);

  saveGame();
}


// ======================================
// STUDY
// ======================================

function study(courseCode) {
  const course =
    gameState.courses[courseCode];

  if (!course) {
    console.warn(
      `Course ${courseCode} does not exist.`
    );
    return;
  }

  course.score += 5;

  gameState.player.intelligence += 1;

  advanceTime(120);

  changeNeed("energy", -15);
  changeNeed("hunger", -5);

  saveGame();
}


// ======================================
// SLEEP
// ======================================

function sleep(hours = 8) {
  advanceTime(hours * 60);

  changeNeed(
    "energy",
    hours * 10
  );

  changeNeed(
    "hygiene",
    -10
  );

  changeNeed(
    "hunger",
    -10
  );

  saveGame();
}


// ======================================
// WORK
// ======================================

function work(hours = 4) {
  if (!gameState.job.current) {
    console.log(
      "You don't currently have a job."
    );
    return;
  }

  const earnings =
    gameState.job.salary * hours;

  changeMoney(earnings);

  gameState.job.experience += hours;

  advanceTime(hours * 60);

  changeNeed(
    "energy",
    -20
  );

  changeNeed(
    "hunger",
    -10
  );

  saveGame();
}


// ======================================
// EXPORT
// ======================================

window.PNGPDGame = {
  gameState,

  saveGame,
  resetGame,

  changeMoney,
  changeNeed,

  advanceTime,
  changeLocation,

  addItem,
  removeItem,

  updateRelationship,
  improveSkill,

  attendClass,
  study,
  sleep,
  work
};