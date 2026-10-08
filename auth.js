/* =========================================================
   PNGPD LIFE — SUPABASE AUTH
   ========================================================= */

const PNGPDAuth = {

    async register(fullName, email, password) {
        const { data, error } =
            await window.pngpdSupabase.auth.signUp({
                email: email.trim(),
                password: password,
                options: {
                    data: {
                        full_name: fullName.trim()
                    }
                }
            });

        if (error) {
            throw error;
        }

        if (data.user) {
            const { error: profileError } =
                await window.pngpdSupabase
                    .from("players")
                    .insert({
                        id: data.user.id,
                        full_name: fullName.trim(),
                        email: email.trim()
                    });

            if (profileError) {
                console.error(profileError);
            }
        }

        return data;
    },

    async login(email, password) {
        const { data, error } =
            await window.pngpdSupabase.auth.signInWithPassword({
                email: email.trim(),
                password: password
            });

        if (error) {
            throw error;
        }

        return data;
    },

    async logout() {
        const { error } =
            await window.pngpdSupabase.auth.signOut();

        if (error) {
            throw error;
        }
    },

    async getUser() {
        const {
            data: { user },
            error
        } = await window.pngpdSupabase.auth.getUser();

        if (error) {
            return null;
        }

        return user;
    },

    async getPlayer() {
        const user = await this.getUser();

        if (!user) {
            return null;
        }

        const { data, error } =
            await window.pngpdSupabase
                .from("players")
                .select("*")
                .eq("id", user.id)
                .single();

        if (error) {
            console.error(error);
            return null;
        }

        return data;
    }
};

window.PNGPDAuth = PNGPDAuth;