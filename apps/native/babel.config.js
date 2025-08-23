module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'expo-router/babel',
      // ⚠️ SOLO añade 'nativewind/babel' si tienes el paquete instalado y configurado.
      // 'nativewind/babel',
      ['react-native-reanimated/plugin', { relativeSourceLocation: true }], // siempre el último
    ],
  };
};
