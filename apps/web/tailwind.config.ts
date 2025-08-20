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
        // Colores canónicos de shadcn
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
        
        // Tooltip colors (mantenemos estos como estaban)
        tooltip: {
          bg: "var(--tooltip-bg)",
          border: "var(--tooltip-border)",
          text: "var(--tooltip-text)",
          value: "var(--tooltip-value)",
        },
      },
      borderRadius: {
        lg: "12px",
        md: "10px",
        sm: "8px",
      },
    },
  },
  plugins: [],
};

export default config;
