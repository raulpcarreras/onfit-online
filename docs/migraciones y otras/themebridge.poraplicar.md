¡vamos allá! Te dejo un ThemeBridge completo para unificar tema entre web (Next.js + next-themes) y native (React Native) usando el mismo design system. Incluye:
• Proveedor web y native con archivos platform-specific (.web.tsx / .native.tsx)
• Hook useThemeBridge() con API consistente
• Opcional: adaptador para AsyncStorage en RN
• Ejemplos de uso

⸻

📦 Estructura

packages/design-system/
├── tokens.ts # (ya lo tienes)
├── tokens.css # (ya lo tienes)
└── providers/
└── theme/
├── ThemeProvider.web.tsx
├── ThemeProvider.native.tsx
└── index.ts

⸻

🌐 ThemeProvider.web.tsx (Next.js + next-themes)

// packages/design-system/providers/theme/ThemeProvider.web.tsx
import \* as React from "react";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { tokens, ThemeMode } from "../../tokens";

type Mode = ThemeMode | "system";

type ThemeBridgeContextType = {
mode: Mode; // 'light' | 'dark' | 'system'
resolvedMode: ThemeMode; // 'light' | 'dark'
isDark: boolean;
setMode: (m: Mode) => void;
colors: typeof tokens.light.hex; // mapa HEX listo para usar
};

const ThemeBridgeContext = React.createContext<ThemeBridgeContextType | null>(null);

export function ThemeProvider({
children,
defaultMode = "system",
}: {
children: React.ReactNode;
defaultMode?: Mode;
}) {
return (
<NextThemesProvider
attribute="class"
defaultTheme={defaultMode}
enableSystem
// opcionales: disableTransitionOnChange, storageKey, etc. >
<ThemeBridgeInner>{children}</ThemeBridgeInner>
</NextThemesProvider>
);
}

function ThemeBridgeInner({ children }: { children: React.ReactNode }) {
const { theme, resolvedTheme, setTheme } = useTheme();
const resolved = (resolvedTheme as ThemeMode) ?? "light";

const value = React.useMemo(
() => ({
mode: (theme as Mode) ?? "system",
resolvedMode: resolved,
isDark: resolved === "dark",
setMode: (m: Mode) => setTheme(m),
colors: tokens[resolved].hex,
}),
[theme, resolved, setTheme]
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

⸻

📱 ThemeProvider.native.tsx (React Native)

// packages/design-system/providers/theme/ThemeProvider.native.tsx
import \* as React from "react";
import { Appearance } from "react-native";
import { tokens, ThemeMode } from "../../tokens";

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
colors: typeof tokens.light.hex;
};

const STORAGE_KEY = "theme-mode";
const ThemeBridgeContext = React.createContext<ThemeBridgeContextType | null>(null);

export function ThemeProvider({
children,
storage,
defaultMode = "system",
}: {
children: React.ReactNode;
storage?: Storage; // opcional: pásale AsyncStorage adaptado
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
colors: tokens[resolvedMode].hex,
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

⸻

🧭 index.ts (barrel)

// packages/design-system/providers/theme/index.ts
export { ThemeProvider, useThemeBridge } from "./ThemeProvider";
export type { ThemeMode } from "../../tokens";

Gracias a la resolución por plataforma, el import ./ThemeProvider cogerá .web en Next y .native en RN.

⸻

🧪 Ejemplos de uso

Web (Next.js root layout)

// apps/web/app/layout.tsx
import "@repo/design/tokens.css"; // asegúrate de tener las CSS variables
import { ThemeProvider } from "@repo/design/providers/theme";

export default function RootLayout({ children }: { children: React.ReactNode }) {
return (

<html lang="es" suppressHydrationWarning>
<body>
<ThemeProvider defaultMode="system">
{children}
</ThemeProvider>
</body>
</html>
);
}

Web (componente)

import { useThemeBridge } from "@repo/design/providers/theme";

export function ThemeToggle() {
const { mode, resolvedMode, isDark, setMode } = useThemeBridge();
return (
<button onClick={() => setMode(isDark ? "light" : "dark")}>
Tema actual: {resolvedMode} (preferencia: {mode})
</button>
);
}

Native (App.tsx)

// apps/native/App.tsx
import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemeProvider, asyncStorageAdapter, useThemeBridge } from "@repo/design/providers/theme";
import { View, Text, Pressable } from "react-native";

export default function App() {
return (
<ThemeProvider storage={asyncStorageAdapter(AsyncStorage)} defaultMode="system">
<Home />
</ThemeProvider>
);
}

function Home() {
const { resolvedMode, isDark, setMode, colors } = useThemeBridge();

return (
<View style={{ flex: 1, backgroundColor: colors.background, alignItems: "center", justifyContent: "center" }}>
<Text style={{ color: colors.foreground, marginBottom: 12 }}>
Tema: {resolvedMode} ({isDark ? "oscuro" : "claro"})
</Text>
<Pressable
onPress={() => setMode(isDark ? "light" : "dark")}
style={{ backgroundColor: colors.primary, padding: 12, borderRadius: 8 }} >
<Text style={{ color: colors["primary-foreground"] }}>
Cambiar tema
</Text>
</Pressable>
</View>
);
}

⸻

✅ Qué te aporta
• API única en web/native: useThemeBridge()
• Colores sincronizados con tokens.ts / tokens.css
• Persistencia opcional en RN con AsyncStorage
• Compatibilidad total con next-themes en web

Si quieres, también puedo añadir una pequeña utilidad para inyectar inline CSS variables en web (SSR) cuando renderizas fuera del <html class="dark">, pero con Next + next-themes normalmente no hace falta.
