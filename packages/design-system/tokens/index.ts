// packages/design-system/tokens/index.ts
// Tokens JS para React Native + TypeScript types

export type ThemeMode = "light" | "dark";

export interface ColorTokens {
  background: string;
  foreground: string;
  card: string;
  "card-foreground": string;
  popover: string;
  "popover-foreground": string;
  primary: string;
  "primary-foreground": string;
  secondary: string;
  "secondary-foreground": string;
  muted: string;
  "muted-foreground": string;
  accent: string;
  "accent-foreground": string;
  destructive: string;
  "destructive-foreground": string;
  border: string;
  input: string;
  ring: string;
}

export interface ThemeTokens {
  light: ColorTokens;
  dark: ColorTokens;
}

// Tokens JS para React Native (valores HEX)
export const tokens: ThemeTokens = {
  light: {
    background: "#ffffff",
    foreground: "#0a0a0a",
    card: "#ffffff",
    "card-foreground": "#0a0a0a",
    popover: "#ffffff",
    "popover-foreground": "#0a0a0a",
    primary: "#f59e0b", // ONFIT brand color
    "primary-foreground": "#ffffff",
    secondary: "#f3f4f6",
    "secondary-foreground": "#374151",
    muted: "#f9fafb",
    "muted-foreground": "#6b7280",
    accent: "#f3f4f6",
    "accent-foreground": "#374151",
    destructive: "#ef4444",
    "destructive-foreground": "#ffffff",
    border: "#e5e7eb",
    input: "#ffffff",
    ring: "#f59e0b",
  },
  dark: {
    background: "#0a0a0a",
    foreground: "#ffffff",
    card: "#111111",
    "card-foreground": "#ffffff",
    popover: "#111111",
    "popover-foreground": "#ffffff",
    primary: "#f59e0b", // ONFIT brand color (mismo en ambos temas)
    "primary-foreground": "#000000",
    secondary: "#171717",
    "secondary-foreground": "#9ca3af",
    muted: "#111111",
    "muted-foreground": "#6b7280",
    accent: "#171717",
    "accent-foreground": "#9ca3af",
    destructive: "#dc2626",
    "destructive-foreground": "#ffffff",
    border: "#262626",
    input: "#171717",
    ring: "#f59e0b",
  },
};

// Helper para obtener colores del tema actual
export function getThemeColors(mode: ThemeMode): ColorTokens {
  return tokens[mode];
}

// Helper para obtener colores del tema del sistema
export function getSystemThemeColors(): ColorTokens {
  // En React Native, esto se resuelve en el ThemeProvider
  // Por defecto retornamos light
  return tokens.light;
}
