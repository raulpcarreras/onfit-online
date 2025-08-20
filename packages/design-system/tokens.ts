// Design tokens canónicos de shadcn para web y nativo
export const tokens = {
  light: {
    background: "0 0% 98%",           // #fafafa
    foreground: "222.2 47.4% 11.2%", // #0b0b0c aprox
    card: "0 0% 100%",               // #ffffff
    "card-foreground": "222.2 47.4% 11.2%", // #0b0b0c
    popover: "0 0% 100%",            // #ffffff
    "popover-foreground": "222.2 47.4% 11.2%", // #0b0b0c
    primary: "38 92% 50%",           // amber-500
    "primary-foreground": "24 10% 8%", // #0a0a0a
    secondary: "240 5% 96%",         // #f8fafc
    "secondary-foreground": "222.2 47.4% 11.2%", // #0b0b0c
    muted: "240 4.8% 95.9%",        // #f1f5f9
    "muted-foreground": "215.4 16.3% 46.9%", // #64748b
    accent: "38 92% 50%",            // amber-500
    "accent-foreground": "24 10% 8%", // #0a0a0a
    destructive: "0 84.2% 60.2%",    // #ef4444
    "destructive-foreground": "210 40% 98%", // #fafafa
    border: "240 5.9% 90%",          // #e2e8f0
    input: "240 5.9% 90%",           // #e2e8f0
    ring: "38 92% 50%",              // amber-500
    chart: {
      stroke: "222.2 47.4% 11.2%",   // #0b0b0c
      tooltip: {
        bg: "#ffffff",
        border: "rgba(226,232,240,0.7)",
        text: "#334155",
        value: "#f59e0b"
      }
    }
  },
  dark: {
    background: "240 7% 8%",         // #0a0a0a
    foreground: "0 0% 96%",          // #f5f5f5
    card: "240 6% 10%",              // #171717
    "card-foreground": "0 0% 96%",   // #f5f5f5
    popover: "240 6% 10%",           // #171717
    "popover-foreground": "0 0% 96%", // #f5f5f5
    primary: "38 92% 50%",           // amber-500
    "primary-foreground": "0 0% 5%", // #0a0a0a
    secondary: "240 6% 15%",         // #262626
    "secondary-foreground": "0 0% 96%", // #f5f5f5
    muted: "240 5% 20%",             // #333333
    "muted-foreground": "0 0% 70%",  // #b3b3b3
    accent: "38 92% 50%",            // amber-500
    "accent-foreground": "0 0% 5%",  // #0a0a0a
    destructive: "0 70% 45%",        // #dc2626
    "destructive-foreground": "0 0% 98%", // #fafafa
    border: "240 5% 20%",            // #333333
    input: "240 5% 20%",             // #333333
    ring: "38 92% 50%",              // amber-500
    chart: {
      stroke: "38 92% 50%",          // amber-500
      tooltip: {
        bg: "#171717",
        border: "rgba(38,38,38,0.7)",
        text: "#e5e5e5",
        value: "#f59e0b"
      }
    }
  },
} as const;

export type TokenScheme = keyof typeof tokens;
export type TokenValue = typeof tokens[TokenScheme];
