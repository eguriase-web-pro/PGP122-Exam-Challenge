// PNGPD LIVE - World & Location System

const WORLD_STORAGE_KEY = "pngpd_live_world_v1";

const DEFAULT_WORLD = {
    currentLocation: "department",
    visitedLocations: [],
    locationHistory: []
};

function loadWorld() {
    try {
        const saved = localStorage.getItem(WORLD_STORAGE_KEY);

        if (!saved) {
            return { ...DEFAULT_WORLD };
        }

        return {
            ...DEFAULT_WORLD,
            ...JSON.parse(saved)
        };
    } catch (error) {
        console.error("World load error:", error);
        return { ...DEFAULT_WORLD };
    }
}

function saveWorld(world) {
    localStorage.setItem(
        WORLD_STORAGE_KEY,
        JSON.stringify(world)
    );
}

function getLocationData(locationId) {
    if (
        typeof locations !== "undefined" &&
        Array.isArray(locations)
    ) {
        return locations.find(
            location => location.id === locationId
        );
    }

    if (
        typeof locations !== "undefined" &&
        typeof locations === "object"
    ) {
        return locations[locationId];
    }

    return null;
}

function enterLocation(locationId) {
    const world = loadWorld();
    const location = getLocationData(locationId);

    if (!location) {
        showPlayerToast("Location not found.");
        return;
    }

    world.currentLocation = locationId;

    if (!world.visitedLocations.includes(locationId)) {
        world.visitedLocations.push(locationId);

        if (
            window.pngpdMissions &&
            typeof window.pngpdMissions.locationVisited === "function"
        ) {
            window.pngpdMissions.locationVisited();
        }
    }

    world.locationHistory.push({
        location: locationId,
        time: new Date().toISOString()
    });

    if (world.locationHistory.length > 100) {
        world.locationHistory.shift();
    }

    saveWorld(world);

    updateLocationNotification(location);
    highlightCurrentLocation(locationId);
    movePlayerToLocation(locationId);
    openLocationAction(locationId);
}

function updateLocationNotification(location) {
    const notification =
        document.getElementById("locationNotification");

    const icon =
        document.getElementById("locationIcon");

    const name =
        document.getElementById("locationName");

    const description =
        document.getElementById("locationDescription");

    if (icon) {
        icon.textContent =
            location