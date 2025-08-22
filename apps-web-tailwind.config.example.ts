// apps/web/tailwind.config.ts (EJEMPLO - reemplaza el tuyo con este patrón)
import type { Config } from "tailwindcss";
import preset from "../../packages/design-system/tailwind.preset";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "../../packages/design-system/**/*.{ts,tsx}",
  ],
  presets: [preset],
  theme: {
    container: { center: true, padding: "1rem", screens: { "2xl": "1400px" } },
    extend: {},
  },
};
export default config;
