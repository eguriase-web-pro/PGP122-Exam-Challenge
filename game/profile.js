const PNGPDProfile = {

    openPhotoPicker() {

        if (!window.PNGPD || !PNGPD.player) {
            alert("Please log in first.");
            return;
        }

        const input = document.createElement("input");

        input.type = "file";
        input.accept = "image/*";
        input.style.display = "none";

        document.body.appendChild(input);

        input.addEventListener("change", async () => {

            const file = input.files[0];

            if (file) {
                await this.uploadPhoto(file);
            }

            input.remove();

        });

        input.click();
    },


    async uploadPhoto(file) {

        if (!window.pngpdSupabase) {
            alert("Supabase is not connected.");
            return;
        }

        if (!PNGPD.player) {
            alert("Please log in first.");
            return;
        }

        if (!file.type.startsWith("image/")) {
            alert("Please select an image.");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert("Photo must be less than 5MB.");
            return;
        }


        const userId = PNGPD.player.id;

        const extension =
            file.name.split(".").pop().toLowerCase();

        const filePath =
            userId + "/profile." + extension;


        const { error: uploadError } =
            await pngpdSupabase
                .storage
                .from("avatars")
                .upload(
                    filePath,
                    file,
                    {
                        upsert: true,
                        contentType: file.type
                    }
                );


        if (uploadError) {

            console.error(uploadError);

            alert(
                "Photo upload failed:\n" +
                uploadError.message
            );

            return;
        }


        const { data } =
            pngpdSupabase
                .storage
                .from("avatars")
                .getPublicUrl(filePath);


        const avatarURL =
            data.publicUrl +
            "?t=" +
            Date.now();


        const { error: updateError } =
            await pngpdSupabase
                .from("players")
                .update({
                    avatar_url: avatarURL
                })
                .eq(
                    "id",
                    userId
                );


        if (updateError) {

            console.error(updateError);

            alert(
                "Photo uploaded, but profile could not be updated."
            );

            return;
        }


        PNGPD.player.avatar_url =
            avatarURL;


        PNGPD.updateHUD();


        alert(
            "Profile photo updated successfully!"
        );

    }

};


window.PNGPDProfile =
    PNGPDProfile;