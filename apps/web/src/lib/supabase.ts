import { createClient } from "@supabase/supabase-js";
import { Env } from "@/env";

export const supabase = createClient(
  Env.NEXT_PUBLIC_SUPABASE_URL,
  Env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  { db: { schema: "onfit" } }
);



