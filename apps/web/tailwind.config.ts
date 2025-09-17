// apps/web/tailwind.config.ts
import type { Config } from "tailwindcss";
import preset from "../../packages/design-system/tailwind.preset";

const config: Config = {
    darkMode: ["class"],
    content: [
        "./app/**/*.{ts,tsx}",
        "./src/**/*.{ts,tsx}",

        // Solo el código fuente del design system que tiene clases
        "../../packages/design-system/{components,ui}/**/*.{ts,tsx}",

        // Bloqueos explícitos para evitar entrar en caches/builds
        "!../../packages/**/node_modules/**",
        "!../../packages/**/{dist,build,.next,storybook-static,coverage}/**",
    ],
    presets: [preset],
    theme: {
        container: { center: true, padding: "1rem", screens: { "2xl": "1400px" } },
        extend: {},
    },
};

export default config;
