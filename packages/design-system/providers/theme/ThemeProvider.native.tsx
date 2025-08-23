import * as React from "react";
import { Appearance } from "react-native";
import { tokens, type ThemeMode, type ColorTokens } from "../../tokens/index";

type Mode = ThemeMode | "system";

// interfaz de almacenamiento genérica para no acoplar a AsyncStorage
type Storage = {
  getItem?: (key: string) => Promise<string | null> | string | null;
  setItem?: (key: string, value: string) => Promise<void> | void;
  removeItem?: (key: string) => Promise<void> | void;
};

type ThemeBridgeContextType = {
  mode: Mode;
  resolvedMode: ThemeMode;
  isDark: boolean;
  setMode: (m: Mode) => void;
  colors: ColorTokens; // mapa de colores tipado para RN
};

const STORAGE_KEY = "theme-mode";
const ThemeBridgeContext = React.createContext<ThemeBridgeContextType | null>(null);

export function ThemeProvider({
  children,
  storage,
  defaultMode = "system",
}: {
  children: React.ReactNode;
  storage?: Storage;     // opcional: pásale AsyncStorage adaptado
  defaultMode?: Mode;
}) {
  const [mode, setMode] = React.useState<Mode>(defaultMode);
  const [system, setSystem] = React.useState<ThemeMode>(
    (Appearance.getColorScheme() || "light") as ThemeMode
  );

  // Suscribirse a cambios del sistema
  React.useEffect(() => {
    const sub = Appearance.addChangeListener(({ colorScheme }) => {
      setSystem((colorScheme || "light") as ThemeMode);
    });
    return () => sub.remove();
  }, []);

  // Cargar preferencia persistida
  React.useEffect(() => {
    if (!storage?.getItem) return;
    (async () => {
      try {
        const saved = await storage.getItem!(STORAGE_KEY);
        if (saved === "light" || saved === "dark" || saved === "system") {
          setMode(saved);
        }
      } catch {}
    })();
  }, [storage]);

  const setModeAndPersist = React.useCallback(
    (m: Mode) => {
      setMode(m);
      storage?.setItem?.(STORAGE_KEY, m);
    },
    [storage]
  );

  const resolvedMode: ThemeMode = mode === "system" ? system : mode;

  const value = React.useMemo(
    () => ({
      mode,
      resolvedMode,
      isDark: resolvedMode === "dark",
      setMode: setModeAndPersist,
      colors: tokens[resolvedMode], // Usar tokens JS centralizados
    }),
    [mode, resolvedMode, setModeAndPersist]
  );

  return (
    <ThemeBridgeContext.Provider value={value}>
      {children}
    </ThemeBridgeContext.Provider>
  );
}

export function useThemeBridge() {
  const ctx = React.useContext(ThemeBridgeContext);
  if (!ctx) throw new Error("useThemeBridge must be used within ThemeProvider");
  return ctx;
}

// Adaptador opcional para @react-native-async-storage/async-storage
export function asyncStorageAdapter(AsyncStorage: {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, val: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
}): Storage {
  return {
    getItem: AsyncStorage.getItem,
    setItem: AsyncStorage.setItem,
    removeItem: AsyncStorage.removeItem,
  };
}
