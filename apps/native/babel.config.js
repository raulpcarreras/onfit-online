/** @type {import('@babel/core').TransformOptions} */
module.exports = (api) => {
    api.cache(true);
    return {
        presets: [
            [
                "babel-preset-expo",
                { unstable_transformImportMeta: true },
            ],
        ],

        /** NOTE: This must be last in the plugins @see https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/installation/#babel-plugin */
        plugins: ["nativewind/babel", "react-native-reanimated/plugin"],
    };
};
