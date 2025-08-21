import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

type Role = "user" | "trainer" | "admin" | null;

type UserContextValue = {
  user: import("@supabase/supabase-js").User | null;
  role: Role;
  loading: boolean;
  error?: string;
};

const UserContext = createContext<UserContextValue>({ user: null, role: null, loading: true });

// Función de reintento con backoff exponencial
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: any;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (attempt === maxRetries) break;
      
      const delay = baseDelay * Math.pow(2, attempt);
      console.log(`🔄 UserProvider Native - Reintento ${attempt + 1}/${maxRetries} en ${delay}ms`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<import("@supabase/supabase-js").User | null>(null);
  const [role, setRole] = useState<Role>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();

  // Función robusta para obtener el rol del usuario
  const getUserRole = async (userId: string): Promise<Role> => {
    try {
      console.log(`🔍 UserProvider Native - Consultando rol para usuario ${userId}`);
      
      const { data: profile, error: queryError } = await retryWithBackoff(async () => {
        return supabase
          .from("profiles")
          .select("role")
          .eq("id", userId)
          .maybeSingle();
      });

      if (queryError) {
        console.warn(`⚠️ UserProvider Native - Error en consulta a profiles:`, queryError);
        
        // Si es error 500/503, usar fallback temporal
        if (queryError.code === '500' || queryError.code === '503' || queryError.message.includes('500') || queryError.message.includes('503')) {
          console.log(`🔄 UserProvider Native - Error 500/503, usando fallback temporal: 'user'`);
          return 'user';
        }
        
        // Si no hay perfil o hay error, usar fallback temporal
        if (!profile) {
          console.log(`🔄 UserProvider Native - Sin perfil encontrado, usando fallback temporal: 'user'`);
          return 'user';
        }
      }

      if (profile?.role) {
        // El rol ya viene correcto de la DB
        console.log(`✅ UserProvider Native - Rol obtenido: ${profile.role}`);
        return profile.role as Role;
      }

      // Fallback final: si no hay rol, usar 'user'
      console.log(`🔄 UserProvider Native - Sin rol definido, usando fallback: 'user'`);
      return 'user';
      
    } catch (error) {
      console.error(`❌ UserProvider Native - Error crítico al obtener rol:`, error);
      // En caso de error crítico, usar fallback temporal
      return 'user';
    }
  };

  useEffect(() => {
    let mounted = true;
    
    (async () => {
      try {
        setLoading(true);
        setError(undefined);
        
        console.log(`🚀 UserProvider Native - Inicializando...`);
        
        // Verificar sesión inicial de forma segura
        const { data: { session }, error: authError } = await supabase.auth.getSession();
        
        if (authError) {
          console.warn(`⚠️ UserProvider Native - Error al obtener sesión inicial:`, authError);
          // No es crítico, continuar sin sesión
        }

        const currentUser = session?.user ?? null;
        
        if (!mounted) return;
        setUser(currentUser);
        
        if (currentUser) {
          console.log(`👤 UserProvider Native - Usuario autenticado: ${currentUser.email}`);
          
          const userRole = await getUserRole(currentUser.id);
          if (!mounted) return;
          
          setRole(userRole);
          console.log(`🎭 UserProvider Native - Rol establecido: ${userRole}`);
        } else {
          console.log(`👤 UserProvider Native - Sin usuario autenticado`);
          setRole(null);
        }
        
      } catch (error) {
        console.error(`❌ UserProvider Native - Error en inicialización:`, error);
        setError(error instanceof Error ? error.message : 'Error desconocido');
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    const { data: sub } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log(`🔄 UserProvider Native - Cambio de estado de auth: ${event}`);
      
      try {
        // Para eventos de logout, limpiar inmediatamente sin hacer llamadas
        if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED' && !session) {
          console.log(`👤 UserProvider Native - Usuario desconectado (evento: ${event})`);
          if (mounted) {
            setUser(null);
            setRole(null);
          }
          return;
        }

        // Solo consultar si hay sesión activa
        if (session?.user) {
          const u = session.user;
          console.log(`👤 UserProvider Native - Usuario en cambio de estado: ${u.email}`);
          
          if (!mounted) return;
          setUser(u);
          
          const userRole = await getUserRole(u.id);
          if (!mounted) return;
          setRole(userRole);
          console.log(`🎭 UserProvider Native - Rol actualizado: ${userRole}`);
        } else {
          console.log(`👤 UserProvider Native - Sin sesión activa`);
          if (mounted) {
            setUser(null);
            setRole(null);
          }
        }
      } catch (error) {
        console.error(`❌ UserProvider Native - Error en cambio de estado:`, error);
        // En caso de error, limpiar estado para evitar inconsistencias
        if (mounted) {
          setUser(null);
          setRole(null);
        }
      }
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo(() => ({ user, role, loading, error }), [user, role, loading, error]);
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export const useUser = () => useContext(UserContext);


