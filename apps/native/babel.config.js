module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', {
        unstable_transformImportMeta: true,
        jsxRuntime: 'automatic'
      }]
    ],
    plugins: [
      'react-native-reanimated/plugin', // SIEMPRE el último
    ],
  };
};
