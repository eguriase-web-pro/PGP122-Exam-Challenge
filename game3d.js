// ==========================================
// PNGPD LIFE 3D
// Core 3D World
// ==========================================

let scene;
let camera;
let renderer;
let player;

let keys = {};

let playerSpeed = 0.12;

let worldObjects = [];


// ==========================================
// START 3D GAME
// ==========================================

function startPNGPDLife3D() {

    // SCENE
    scene = new THREE.Scene();

    scene.background = new THREE.Color(0x87ceeb);


    // CAMERA
    camera = new THREE.PerspectiveCamera(
        70,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );

    camera.position.set(0, 5, 8);


    // RENDERER
    renderer = new THREE.WebGLRenderer({
        antialias: true
    });

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );

    renderer.setPixelRatio(
        Math.min(window.devicePixelRatio, 2)
    );

    document.body.appendChild(
        renderer.domElement
    );


    // LIGHTING
    const sunlight =
        new THREE.DirectionalLight(
            0xffffff,
            1.5
        );

    sunlight.position.set(
        20,
        30,
        10
    );

    scene.add(sunlight);


    const ambient =
        new THREE.AmbientLight(
            0xffffff,
            0.6
        );

    scene.add(ambient);


    // GROUND
    createGround();


    // CAMPUS
    createCampus();


    // PLAYER
    createPlayer();


    // CONTROLS
    setupControls();


    // RESIZE
    window.addEventListener(
        "resize",
        resizeGame
    );


    // START LOOP
    animate();
}


// ==========================================
// GROUND
// ==========================================

function createGround() {

    const groundGeometry =
        new THREE.PlaneGeometry(
            200,
            200
        );

    const groundMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x3f8f45
        });

    const ground =
        new THREE.Mesh(
            groundGeometry,
            groundMaterial
        );

    ground.rotation.x =
        -Math.PI / 2;

    ground.position.y = 0;

    scene.add(ground);
}


// ==========================================
// ROAD
// ==========================================

function createRoad(
    x,
    z,
    width,
    depth
) {

    const geometry =
        new THREE.BoxGeometry(
            width,
            0.05,
            depth
        );

    const material =
        new THREE.MeshStandardMaterial({
            color: 0x444444
        });

    const road =
        new THREE.Mesh(
            geometry,
            material
        );

    road.position.set(
        x,
        0.03,
        z
    );

    scene.add(road);
}


// ==========================================
// BUILDING
// ==========================================

function createBuilding(
    name,
    x,
    z,
    width,
    height,
    depth,
    color
) {

    const geometry =
        new THREE.BoxGeometry(
            width,
            height,
            depth
        );

    const material =
        new THREE.MeshStandardMaterial({
            color: color
        });

    const building =
        new THREE.Mesh(
            geometry,
            material
        );

    building.position.set(
        x,
        height / 2,
        z
    );

    building.userData.name =
        name;

    scene.add(building);

    worldObjects.push(
        building
    );
}


// ==========================================
// CAMPUS
// ==========================================

function createCampus() {

    // MAIN ROAD
    createRoad(
        0,
        0,
        200,
        8
    );

    createRoad(
        0,
        0,
        8,
        200
    );


    // PTI GATE AREA
    createBuilding(
        "PTI Gate",
        0,
        -30,
        14,
        7,
        5,
        0xe63946
    );


    // PNGPD DEPARTMENT
    createBuilding(
        "PNGPD Department",
        -25,
        15,
        16,
        9,
        12,
        0xffb703
    );


    // LIBRARY
    createBuilding(
        "Library",
        25,
        15,
        18,
        8,
        14,
        0x219ebc
    );


    // HOSTEL
    createBuilding(
        "Hostel",
        -25,
        40,
        20,
        10,
        16,
        0x8338ec
    );


    // CAFETERIA
    createBuilding(
        "Cafeteria",
        25,
        40,
        15,
        7,
        12,
        0xfb8500
    );


    // LABORATORY
    createBuilding(
        "Laboratory",
        -45,
        -15,
        18,
        8,
        14,
        0x06d6a0
    );


    // LECTURE HALL
    createBuilding(
        "Lecture Hall",
        45,
        -15,
        20,
        8,
        15,
        0xef476f
    );


    // FOOTBALL FIELD
    createFootballField(
        0,
        55
    );
}


// ==========================================
// FOOTBALL FIELD
// ==========================================

function createFootballField(
    x,
    z
) {

    const geometry =
        new THREE.BoxGeometry(
            45,
            0.08,
            25
        );

    const material =
        new THREE.MeshStandardMaterial({
            color: 0x2a9d45
        });

    const field =
        new THREE.Mesh(
            geometry,
            material
        );

    field.position.set(
        x,
        0.06,
        z
    );

    scene.add(field);
}


// ==========================================
// PLAYER
// ==========================================

function createPlayer() {

    const geometry =
        new THREE.CapsuleGeometry(
            0.45,
            1.2,
            4,
            8
        );

    const material =
        new THREE.MeshStandardMaterial({
            color: 0xff3333
        });

    player =
        new THREE.Mesh(
            geometry,
            material
        );

    player.position.set(
        0,
        1,
        -10
    );

    scene.add(player);

    camera.position.set(
        player.position.x,
        player.position.y + 4,
        player.position.z + 7
    );
}


// ==========================================
// KEYBOARD CONTROLS
// ==========================================

function setupControls() {

    window.addEventListener(
        "keydown",
        function(event) {

            keys[event.key.toLowerCase()] =
                true;

        }
    );


    window.addEventListener(
        "keyup",
        function(event) {

            keys[event.key.toLowerCase()] =
                false;

        }
    );
}


// ==========================================
// PLAYER MOVEMENT
// ==========================================

function updatePlayer() {

    if (!player) return;


    if (
        keys["w"] ||
        keys["arrowup"]
    ) {

        player.position.z -=
            playerSpeed;
    }


    if (
        keys["s"] ||
        keys["arrowdown"]
    ) {

        player.position.z +=
            playerSpeed;
    }


    if (
        keys["a"] ||
        keys["arrowleft"]
    ) {

        player.position.x -=
            playerSpeed;
    }


    if (
        keys["d"] ||
        keys["arrowright"]
    ) {

        player.position.x +=
            playerSpeed;
    }


    // CAMERA FOLLOWS PLAYER

    camera.position.x =
        player.position.x;

    camera.position.z =
        player.position.z + 7;

    camera.lookAt(
        player.position.x,
        player.position.y,
        player.position.z
    );


    // CONNECT TO GAME STATE

    if (
        window.PNGPDGame &&
        window.PNGPDGame.gameState
    ) {

        window.PNGPDGame.gameState.player.x =
            player.position.x;

        window.PNGPDGame.gameState.player.y =
            player.position.z;
    }
}


// ==========================================
// GAME LOOP
// ==========================================

function animate() {

    requestAnimationFrame(
        animate
    );

    updatePlayer();

    renderer.render(
        scene,
        camera
    );
}


// ==========================================
// RESIZE
// ==========================================

function resizeGame() {

    camera.aspect =
        window.innerWidth /
        window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );
}