import React from "react";
import { supabase } from "./supabase";

type Session = any;
type User = any;
type Role = "user" | "trainer" | "admin" | null;
type Ctx = { user: User | null; role: Role; loading: boolean };

export const UserContext = React.createContext<Ctx>({
  user: null,
  role: null,
  loading: true,
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = React.useState<Session | null>(null);
  const [user, setUser] = React.useState<User | null>(null);
  const [role, setRole] = React.useState<Role>(null);
  const [hydrated, setHydrated] = React.useState(false);

  // Suscripción UNA sola vez (evita getSession + onAuthStateChange duplicados)
  React.useEffect(() => {
    let mounted = true;

    const { data: sub } = supabase.auth.onAuthStateChange((_e: any, s: any) => {
      if (!mounted) return;
      setSession(s ?? null);
      setHydrated(true); // primera vez que recibimos algo ya consideramos hidratado
    });

    // fallback por si en algunos entornos no llega INITIAL_SESSION
    supabase.auth.getSession().then(({ data }: any) => {
      if (!mounted) return;
      setSession((prev: any) => prev ?? data.session ?? null);
      setHydrated(true);
    });

    return () => {
      mounted = false;
      sub?.subscription?.unsubscribe?.();
    };
  }, []); // ← importante: SIN dependencias

  // Derivar user SOLO cuando cambia el id (evita sets redundantes)
  React.useEffect(() => {
    const next = session?.user ?? null;
    setUser((prev: any) => (prev?.id === next?.id ? prev : next));
  }, [session?.user?.id]);

  // Cargar rol cuando hay user id (y no refetch si no cambia)
  React.useEffect(() => {
    let active = true;
    if (!user?.id) {
      setRole(null);
      return;
    }
    supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()
      .then(({ data }: any) => {
        if (active) setRole((data?.role as Role) ?? null);
      });
    return () => {
      active = false;
    };
  }, [user?.id]);

  const value = React.useMemo<Ctx>(
    () => ({ user, role, loading: !hydrated }),
    [user, role, hydrated],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export const useUser = () => React.useContext(UserContext);
