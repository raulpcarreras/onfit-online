import type { Config } from "tailwindcss";
import { tokens } from "@repo/design/tokens";
import nativewindPreset from "nativewind/preset";

const config: Config = {
    content: [
        "./app/**/*.tsx",
        "./src/**/*.tsx",
        "./features/**/*.tsx",
        // Design system: apunta SOLO a código fuente (excluye node_modules)
        "../../packages/design-system/src/**/*.{ts,tsx}",
        "../../packages/design-system/components/**/*.{ts,tsx}",
        "../../packages/design-system/ui/**/*.{ts,tsx}",
        "../../packages/design-system/hooks/**/*.{ts,tsx}",
        "../../packages/design-system/lib/**/*.{ts,tsx}",
    ],
    darkMode: "class",
    presets: [nativewindPreset],
    theme: {
        extend: {
            colors: {
                // Usar valores directos de los tokens para React Native
                background: tokens.light.background,
                foreground: tokens.light.foreground,
                card: tokens.light.card,
                "card-foreground": tokens.light["card-foreground"],
                popover: tokens.light.popover,
                "popover-foreground": tokens.light["popover-foreground"],
                primary: {
                    DEFAULT: tokens.light.primary,
                    foreground: tokens.light["primary-foreground"],
                },
                secondary: {
                    DEFAULT: tokens.light.secondary,
                    foreground: tokens.light["secondary-foreground"],
                },
                muted: {
                    DEFAULT: tokens.light.muted,
                    foreground: tokens.light["muted-foreground"],
                },
                accent: {
                    DEFAULT: tokens.light.accent,
                    foreground: tokens.light["accent-foreground"],
                },
                destructive: {
                    DEFAULT: tokens.light.destructive,
                    foreground: tokens.light["destructive-foreground"],
                },
                border: tokens.light.border,
                input: tokens.light.input,
                ring: tokens.light.ring,
                success: {
                    DEFAULT: tokens.light.success,
                    foreground: tokens.light["success-foreground"],
                },
                warning: {
                    DEFAULT: tokens.light.warning,
                    foreground: tokens.light["warning-foreground"],
                },
            },
        },
    },
};

export default config;
