const SUPABASE_URL = "https://xlylxyxjsvhvrnjrcvrf.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_UNIyxQ_8WvQzR2t2fCjKtQ_MNcIJ7T9";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

window.pngpdSupabase = supabaseClient;