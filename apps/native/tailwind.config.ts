import type { Config } from "tailwindcss";
import sharedConfig from "@repo/design/tailwind/tailwind.config";

const config: Pick<Config, "content" | "darkMode"> = {
    content: [
        "./app/**/*.tsx",
        "./src/**/*.tsx",
        // Design system: apunta SOLO a código fuente (excluye node_modules)
        "../../packages/design-system/src/**/*.{ts,tsx}",
        "../../packages/design-system/components/**/*.{ts,tsx}",
        "../../packages/design-system/ui/**/*.{ts,tsx}",
        "../../packages/design-system/hooks/**/*.{ts,tsx}",
        "../../packages/design-system/lib/**/*.{ts,tsx}",
    ],
    darkMode: "class",
    ...sharedConfig,
};

export default config;
