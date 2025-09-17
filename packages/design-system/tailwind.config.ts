import type { Config } from "tailwindcss";
import preset from "./tailwind.preset";

export default {
    presets: [preset],
    content: [
        "./{components,ui,stories}/**/*.{ts,tsx}",
        "./.storybook/**/*.{ts,tsx,css}",
    ],
    darkMode: ["class", '[data-theme="dark"]'],
} satisfies Config;
