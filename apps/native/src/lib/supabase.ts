import { createClient } from "@supabase/supabase-js";
import { Env } from "@/env";

export const supabase = createClient(Env.SUPABASE_URL, Env.SUPABASE_ANON_KEY, {
  db: { schema: "onfit" },
});



