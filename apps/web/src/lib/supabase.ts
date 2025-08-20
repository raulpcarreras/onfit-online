import { createClient } from "@supabase/supabase-js";
import { Env } from "@/env";

if (!Env.NEXT_PUBLIC_SUPABASE_URL || !Env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  // Fail-fast en build/SSR para evitar errores crípticos
  throw new Error("Supabase env missing: set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY");
}

export const supabase = createClient(
  Env.NEXT_PUBLIC_SUPABASE_URL,
  Env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  { db: { schema: "onfit" } }
);



