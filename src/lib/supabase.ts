import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://caetfnftrbgbhxjpufvv.supabase.co";
const supabasePublishableKey = "sb_publishable_iLZ8trGrwfNZqUfp7PUurg_tL67gNdJ";

export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
