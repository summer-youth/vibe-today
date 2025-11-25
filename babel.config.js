module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
          alias: {
            '@': './src',
            '@features': './src/features',
            '@pages': './src/pages',
            '@ui': './src/ui',
            '@hooks': './src/hooks',
            '@utils': './src/utils',
            '@constants': './src/constants',
            '@services': './src/services',
          },
        },
      ],
    ],
  };
};

