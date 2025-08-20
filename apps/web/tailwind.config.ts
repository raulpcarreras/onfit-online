import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "../../packages/design-system/**/*.tsx",
    "!../../packages/design-system/**/node_modules/**",
  ],
  theme: {
    extend: {
      colors: {
        // Nuestros tokens personalizados
        bg: "hsl(var(--bg))",
        card: "hsl(var(--card))",
        text: "hsl(var(--text))",
        muted: "hsl(var(--muted))",
        border: "hsl(var(--border))",
        accent: "hsl(var(--accent))",
        accentFg: "hsl(var(--accent-fg))",
        primary: "hsl(var(--primary))",
        primaryFg: "hsl(var(--primary-fg))",
        secondary: "hsl(var(--secondary))",
        secondaryFg: "hsl(var(--secondary-fg))",
        destructive: "hsl(var(--destructive))",
        destructiveFg: "hsl(var(--destructive-fg))",
        ring: "hsl(var(--ring))",
        input: "hsl(var(--input))",
        popover: "hsl(var(--popover))",
        popoverFg: "hsl(var(--popover-fg))",
        chartStroke: "hsl(var(--chart-stroke))",
        
        tooltip: {
          bg: "var(--tooltip-bg)",
          border: "var(--tooltip-border)",
          text: "var(--tooltip-text)",
          value: "var(--tooltip-value)",
        },
      },
    },
  },
  plugins: [],
};

export default config;
