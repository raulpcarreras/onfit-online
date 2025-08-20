// Design tokens compartidos para web y nativo
export const tokens = {
  light: {
    bg: "0 0% 98%",           // #fafafa
    card: "0 0% 100%",        // #ffffff
    text: "222.2 47.4% 11.2%", // #0b0b0c aprox
    muted: "215 16% 47%",     // #64748b
    border: "220 13% 91%",    // #e2e8f0
    accent: "38 92% 50%",     // amber-500
    accentFg: "0 0% 10%",     // #1a1a1a
    primary: "38 92% 50%",    // amber-500
    primaryFg: "0 0% 100%",   // #ffffff
    secondary: "210 40% 96%", // #f1f5f9
    secondaryFg: "222.2 47.4% 11.2%", // #0b0b0c
    destructive: "0 84% 60%", // #ef4444
    destructiveFg: "0 0% 100%", // #ffffff
    ring: "38 92% 50%",       // amber-500
    input: "220 13% 91%",     // #e2e8f0
    popover: "0 0% 100%",     // #ffffff
    popoverFg: "222.2 47.4% 11.2%", // #0b0b0c
    chart: {
      stroke: "222.2 47.4% 11.2%", // #0b0b0c
      tooltip: {
        bg: "#ffffff",
        border: "rgba(226,232,240,0.7)",
        text: "#334155",
        value: "#f59e0b"
      }
    }
  },
  dark: {
    bg: "0 0% 5%",            // #0a0a0a
    card: "0 0% 9%",          // #171717
    text: "0 0% 90%",         // #e5e5e5
    muted: "0 0% 62%",        // #9e9e9e
    border: "0 0% 15%",       // #262626
    accent: "38 92% 50%",     // amber-500
    accentFg: "0 0% 5%",      // #0a0a0a
    primary: "38 92% 50%",    // amber-500
    primaryFg: "0 0% 5%",     // #0a0a0a
    secondary: "0 0% 9%",     // #171717
    secondaryFg: "0 0% 90%",  // #e5e5e5
    destructive: "0 84% 60%", // #ef4444
    destructiveFg: "0 0% 100%", // #ffffff
    ring: "38 92% 50%",       // amber-500
    input: "0 0% 15%",        // #262626
    popover: "0 0% 9%",       // #171717
    popoverFg: "0 0% 90%",    // #e5e5e5
    chart: {
      stroke: "38 92% 50%",   // amber-500
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
