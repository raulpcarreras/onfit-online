"use client";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

type UserContextValue = {
  user: import("@supabase/supabase-js").User | null;
  role: "user" | "trainer" | "admin" | null;
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
      console.log(`🔄 UserProvider - Reintento ${attempt + 1}/${maxRetries} en ${delay}ms`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<import("@supabase/supabase-js").User | null>(null);
  const [role, setRole] = useState<UserContextValue["role"]>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();

  // Función robusta para obtener el rol del usuario
  const getUserRole = async (userId: string, userEmail: string | undefined): Promise<"user" | "trainer" | "admin" | null> => {
    try {
      console.log(`🔍 UserProvider - Consultando rol para usuario ${userId}`);
      
      const { data: profile, error: queryError } = await retryWithBackoff(async () => {
        return supabase
          .from("profiles")
          .select("role", { head: false })
          .eq("id", userId)
          .single();
      });

      if (queryError) {
        console.warn(`⚠️ UserProvider - Error en consulta a profiles:`, queryError);
        
        // Si es error 500/503, intentar crear el perfil
        if (queryError.code === '500' || queryError.code === '503' || queryError.message.includes('500') || queryError.message.includes('503')) {
          console.log(`🔄 UserProvider - Error 500/503, intentando crear perfil...`);
          try {
            await supabase
              .from("profiles")
              .upsert({ id: userId, email: userEmail }, { onConflict: "id" });
            
            // Reintentar la consulta después de crear el perfil
            const { data: retryProfile } = await supabase
              .from("profiles")
              .select("role", { head: false })
              .eq("id", userId)
              .single();
            
                         if (retryProfile?.role) {
               console.log(`✅ UserProvider - Perfil creado y rol obtenido: ${retryProfile.role}`);
               return retryProfile.role;
             }
          } catch (upsertError) {
            console.error(`❌ UserProvider - Error al crear perfil:`, upsertError);
          }
        }
        
                 // Si no hay perfil o hay error, usar fallback temporal
         if (!profile) {
           console.log(`🔄 UserProvider - Sin perfil encontrado, usando fallback temporal: 'user'`);
           return 'user';
         }
      }

      if (profile?.role) {
        console.log(`✅ UserProvider - Rol obtenido: ${profile.role}`);
        return profile.role;
      }

      // Fallback final: si no hay rol, usar 'user'
      console.log(`🔄 UserProvider - Sin rol definido, usando fallback: 'user'`);
      return 'user';
      
    } catch (error) {
      console.error(`❌ UserProvider - Error crítico al obtener rol:`, error);
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
        
        console.log(`🚀 UserProvider - Inicializando...`);
        
        // Verificar sesión inicial de forma segura
        const { data: { session }, error: authError } = await supabase.auth.getSession();
        
        if (authError) {
          console.warn(`⚠️ UserProvider - Error al obtener sesión inicial:`, authError);
          // No es crítico, continuar sin sesión
        }

        const currentUser = session?.user ?? null;
        if (!mounted) return;
        
        setUser(currentUser);
        
        if (currentUser) {
          console.log(`👤 UserProvider - Usuario autenticado: ${currentUser.email}`);
          
          const userRole = await getUserRole(currentUser.id, currentUser.email);
          if (!mounted) return;
          
          setRole(userRole);
          console.log(`🎭 UserProvider - Rol establecido: ${userRole}`);
        } else {
          console.log(`👤 UserProvider - Sin usuario autenticado (estado inicial)`);
          setRole(null);
        }
        
      } catch (error) {
        console.error(`❌ UserProvider - Error en inicialización:`, error);
        // En caso de error, continuar sin sesión (no es crítico)
        setError(error instanceof Error ? error.message : 'Error desconocido');
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    const { data: sub } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log(`🔄 UserProvider - Cambio de estado de auth: ${event}`);
      
      try {
        // Para eventos de logout, limpiar inmediatamente sin hacer llamadas
        if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED' && !session) {
          console.log(`👤 UserProvider - Usuario desconectado (evento: ${event})`);
          if (mounted) {
            setUser(null);
            setRole(null);
          }
          return;
        }

        // Solo consultar getUser si hay sesión activa
        if (session?.user) {
          const u = session.user;
          console.log(`👤 UserProvider - Usuario en cambio de estado: ${u.email}`);
          
          if (!mounted) return;
          setUser(u);
          
          const userRole = await getUserRole(u.id, u.email);
          if (!mounted) return;
          setRole(userRole);
          console.log(`🎭 UserProvider - Rol actualizado: ${userRole}`);
        } else {
          console.log(`👤 UserProvider - Sin sesión activa`);
          if (mounted) {
            setUser(null);
            setRole(null);
          }
        }
      } catch (error) {
        console.error(`❌ UserProvider - Error en cambio de estado:`, error);
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


