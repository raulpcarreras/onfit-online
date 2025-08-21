import { createClient } from "@supabase/supabase-js";

// Usar variables de entorno directamente para evitar problemas de validación
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // Fail-fast en build/SSR para evitar errores crípticos
  throw new Error("Supabase env missing: set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY");
}

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  { db: { schema: "public" } }
);



