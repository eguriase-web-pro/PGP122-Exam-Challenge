/* =========================================================
   PNGPD LIFE — SESSION MANAGEMENT
   ========================================================= */

async function checkPNGPDSession() {

    const user = await window.PNGPDAuth.getUser();

    if (!user) {
        return null;
    }

    const player = await window.PNGPDAuth.getPlayer();

    if (player) {
        window.pngpdPlayer = player;
    }

    return {
        user,
        player
    };
}


window.addEventListener("load", async () => {

    try {

        const session = await checkPNGPDSession();

        if (session) {
            console.log("PNGPD LIFE player logged in:", session.player);
        } else {
            console.log("No PNGPD LIFE player session.");
        }

    } catch (error) {

        console.error(
            "PNGPD session check failed:",
            error
        );

    }

});