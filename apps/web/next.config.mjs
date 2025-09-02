/**
 * // https://github.com/expo/expo-webpack-integrations/blob/main/packages/next-adapter/src/index.ts
 * @param {import('next').NextConfig} nextConfig
 * @return {import('next').NextConfig}
 */
function withExpo(nextConfig) {
    return {
        ...nextConfig,
        webpack(config, options) {
            // Cache de webpack
            if (config.cache) {
                config.cache = {
                    ...config.cache,
                    type: "filesystem",
                    compression: "gzip",
                    maxMemoryGenerations: 1,
                };
            }

            // Aliases base (RN -> RNW + aliases internos)
            if (!config.resolve) config.resolve = {};
            config.resolve.alias = {
                ...(config.resolve.alias || {}),
                "react-native$": "react-native-web",
                "react-native/Libraries/EventEmitter/RCTDeviceEventEmitter$":
                    "react-native-web/dist/vendor/react-native/NativeEventEmitter/RCTDeviceEventEmitter",
                "react-native/Libraries/vendor/emitter/EventEmitter$":
                    "react-native-web/dist/vendor/react-native/emitter/EventEmitter",
                "react-native/Libraries/EventEmitter/NativeEventEmitter$":
                    "react-native-web/dist/vendor/react-native/NativeEventEmitter",
            };

            // Prioriza variantes .web.*
            config.resolve.extensions = [
                ".web.tsx",
                ".web.ts",
                ".web.jsx",
                ".web.js",
                ...(config.resolve?.extensions ?? []),
            ];

            // Regla fuentes (opcional)
            if (!config.module?.rules) config.module.rules = [];
            config.module.rules.push({
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: "asset/resource",
            });

            // __DEV__ como en Metro
            if (!config.plugins) config.plugins = [];
            config.plugins.push(
                new options.webpack.DefinePlugin({
                    __DEV__: JSON.stringify(process.env.NODE_ENV !== "production"),
                }),
            );

            // Ejecuta la webpack del usuario si existe
            if (typeof nextConfig.webpack === "function") {
                return nextConfig.webpack(config, options);
            }
            return config;
        },
    };
}

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,

    transpilePackages: [
        // RN / Expo básicos
        "react-native",
        "react-native-web",
        "expo",
        "expo-constants",
        "expo-modules-core",
        "@expo/vector-icons",
        // styling / interop
        "nativewind",
        "react-native-css-interop",
        // gestos/animaciones
        "react-native-reanimated",
        "react-native-gesture-handler",
        // otros usados en tu DS
        "@react-native/assets-registry",
        "@rn-primitives/accordion",
        "@rn-primitives/alert-dialog",
        "@rn-primitives/aspect-ratio",
        "@rn-primitives/avatar",
        "@rn-primitives/checkbox",
        "@rn-primitives/collapsible",
        "@rn-primitives/context-menu",
        "@rn-primitives/dialog",
        "@rn-primitives/dropdown-menu",
        "@rn-primitives/hover-card",
        "@rn-primitives/label",
        "@rn-primitives/menubar",
        "@rn-primitives/navigation-menu",
        "@rn-primitives/popover",
        "@rn-primitives/portal",
        "@rn-primitives/progress",
        "@rn-primitives/radio-group",
        "@rn-primitives/select",
        "@rn-primitives/separator",
        "@rn-primitives/slider",
        "@rn-primitives/slot",
        "@rn-primitives/switch",
        "@rn-primitives/table",
        "@rn-primitives/tabs",
        "@rn-primitives/toast",
        "@rn-primitives/toggle",
        "@rn-primitives/toggle-group",
        "@rn-primitives/toolbar",
        "@rn-primitives/tooltip",
        "@rn-primitives/types",
        // tu design system
        "@repo/design-system",
    ],

    experimental: {
        optimizeServerReact: true,
        forceSwcTransforms: true,
        optimizeCss: true,
    },

    images: {
        remotePatterns: [
            { protocol: "https", hostname: "play.google.com" },
            { protocol: "https", hostname: "developer.apple.com" },
        ],
    },

    // Extra: alias y extensiones específicas del proyecto (se mezclarán en withExpo)
    webpack: (config) => {
        config.resolve.alias = {
            ...(config.resolve.alias ?? {}),
            "react-native$": "react-native-web",
        };
        config.resolve.extensions = [
            ".web.tsx",
            ".web.ts",
            ".web.jsx",
            ".web.js",
            ...(config.resolve.extensions ?? []),
        ];
        return config;
    },
};

// ✅ Exporta UNA sola vez
export default withExpo(nextConfig);


