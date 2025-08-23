import * as React from "react";
import { Appearance } from "react-native";

type ThemeMode = "light" | "dark";
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
  colors: Record<string, string>; // mapa de colores para RN
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
      colors: {
        background: resolvedMode === "dark" ? "#1a1a1a" : "#fafafa",
        foreground: resolvedMode === "dark" ? "#f5f5f5" : "#171717",
        card: resolvedMode === "dark" ? "#262626" : "#ffffff",
        "card-foreground": resolvedMode === "dark" ? "#f5f5f5" : "#171717",
        popover: resolvedMode === "dark" ? "#262626" : "#ffffff",
        "popover-foreground": resolvedMode === "dark" ? "#f5f5f5" : "#171717",
        primary: "#f59e0b",
        "primary-foreground": resolvedMode === "dark" ? "#000000" : "#ffffff",
        secondary: resolvedMode === "dark" ? "#404040" : "#f5f5f5",
        "secondary-foreground": resolvedMode === "dark" ? "#f5f5f5" : "#171717",
        muted: resolvedMode === "dark" ? "#404040" : "#f5f5f5",
        "muted-foreground": resolvedMode === "dark" ? "#a3a3a3" : "#737373",
        accent: "#f59e0b",
        "accent-foreground": resolvedMode === "dark" ? "#000000" : "#171717",
        destructive: "#ef4444",
        "destructive-foreground": "#ffffff",
        border: resolvedMode === "dark" ? "#404040" : "#e5e5e5",
        input: resolvedMode === "dark" ? "#404040" : "#e5e5e5",
        ring: "#f59e0b",
      },
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
