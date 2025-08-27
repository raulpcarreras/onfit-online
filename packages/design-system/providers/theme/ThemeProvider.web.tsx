"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";

type ThemeMode = "light" | "dark";
type Mode = ThemeMode | "system";

type ThemeBridgeContextType = {
  mode: Mode;                  // 'light' | 'dark' | 'system'
  resolvedMode: ThemeMode;     // 'light' | 'dark'
  isDark: boolean;
  setMode: (m: Mode) => void;
  colors: Record<string, string>; // mapa de colores CSS variables
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
      disableTransitionOnChange
    >
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
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: "hsl(var(--card))",
        "card-foreground": "hsl(var(--card-foreground))",
        popover: "hsl(var(--popover))",
        "popover-foreground": "hsl(var(--popover-foreground))",
        primary: "hsl(var(--primary))",
        "primary-foreground": "hsl(var(--primary-foreground))",
        secondary: "hsl(var(--secondary))",
        "secondary-foreground": "hsl(var(--secondary-foreground))",
        muted: "hsl(var(--muted))",
        "muted-foreground": "hsl(var(--muted-foreground))",
        accent: "hsl(var(--accent))",
        "accent-foreground": "hsl(var(--accent-foreground))",
        destructive: "hsl(var(--destructive))",
        "destructive-foreground": "hsl(var(--destructive-foreground))",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        // Variantes extra para paridad web/native
        onfit: "hsl(var(--onfit))",
        "onfit-foreground": "hsl(var(--onfit-foreground))",
        "premium-from": "hsl(var(--premium-from))",
        "premium-to": "hsl(var(--premium-to))",
        "premium-foreground": "hsl(var(--premium-foreground))",
        success: "hsl(var(--success))",
        "success-foreground": "hsl(var(--success-foreground))",
        warning: "hsl(var(--warning))",
        "warning-foreground": "hsl(var(--warning-foreground))",
        info: "hsl(var(--info))",
        "info-foreground": "hsl(var(--info-foreground))",
      },
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
