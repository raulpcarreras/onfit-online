import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
    framework: "@storybook/react-vite",
    stories: [
        // Stories del propio package
        "../stories/**/*.stories.@(ts|tsx)",
    ],
    addons: [
        "@storybook/addon-essentials",
        "@storybook/addon-interactions",
        "@storybook/addon-a11y",
    ],
    docs: {
        autodocs: "tag",
    },
    core: {
        disableTelemetry: true,
    },
    viteFinal: async (config) => {
        // Ajustes útiles en monorepos
        config.optimizeDeps = config.optimizeDeps || {};
        config.optimizeDeps.include = [
            ...(config.optimizeDeps.include || []),
            "react",
            "react-dom",
            "clsx",
            "tailwind-merge",
        ];

        // Asegura resolución TS en pnpm workspaces
        config.resolve = config.resolve || {};
        config.resolve.dedupe = ["react", "react-dom"];

        // Alias para evitar que Storybook cargue RN/Expo en web
        config.resolve.alias = {
            ...(config.resolve.alias || {}),
            "react-native": require.resolve("./stubs/react-native.stub.ts"),
            expo: require.resolve("./stubs/empty.stub.ts"),
            "react-native-reanimated": require.resolve("./stubs/empty.stub.ts"),
            "react-native-gesture-handler": require.resolve("./stubs/empty.stub.ts"),
        };

        return config;
    },
};
export default config;
