// apps/web/tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
        // App web
        "./app/**/*.{ts,tsx}",
        "./src/**/*.{ts,tsx}",

        // Design system: apunta SOLO a código fuente (excluye node_modules)
        "../../packages/design-system/src/**/*.{ts,tsx}",
        "../../packages/design-system/components/**/*.{ts,tsx}",
        "../../packages/design-system/ui/**/*.{ts,tsx}",
        "../../packages/design-system/hooks/**/*.{ts,tsx}",
        "../../packages/design-system/lib/**/*.{ts,tsx}",
    ],
    theme: {
        container: {
            center: true,
            padding: "1rem",
            screens: { "2xl": "1400px" },
        },
        extend: {
            borderRadius: {
                lg: "0.5rem",
                xl: "0.75rem",
                "2xl": "1rem",
            },
            colors: {
                // ✅ Nombres CANÓNICOS (coinciden con globals.css)
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
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
};

export default config;
