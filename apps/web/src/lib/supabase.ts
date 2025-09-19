import { createBrowserClient } from "@supabase/ssr";

export const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

// codigo temporal para probar la autenticacion
if (typeof window !== "undefined") {
    console.log("[supabase env]", {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL,
        anon_len: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length,
        anon_key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    });
}
