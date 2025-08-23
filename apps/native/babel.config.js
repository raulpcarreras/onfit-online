module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // tus plugins si los hay…
      'react-native-reanimated/plugin', // SIEMPRE el último
    ],
  };
};
