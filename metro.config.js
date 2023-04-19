/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 */

const { getDefaultConfig, mergeConfig } = require('metro-config');

module.exports = (async () => {
  const {
    resolver: { sourceExts, assetExts },
  } = await getDefaultConfig();

  /**
   * react-native-quick-crypto setup, almost as described here:
   * https://github.com/margelo/react-native-quick-crypto
   */
  let quickCryptoConfig = {
    resolver: {
      extraNodeModules: {
        crypto: require.resolve('react-native-quick-crypto'),
        stream: require.resolve('stream-browserify'),
        buffer: require.resolve('@craftzdog/react-native-buffer'),
      },
    },
  };

  /**
   * react-native-svg-transformer setup, as described here:
   * https://github.com/kristerkari/react-native-svg-transformer
   */
  let svgTransformerConfig = {
    transformer: {
      babelTransformerPath: require.resolve('react-native-svg-transformer'),
    },
    resolver: {
      assetExts: assetExts.filter(ext => ext !== 'svg'),
      sourceExts: [...sourceExts, 'svg'],
    },
  };

  let defaultConfig = {
    transformer: {
      getTransformOptions: async () => ({
        transform: {
          experimentalImportSupport: false,
          inlineRequires: true,
        },
      }),
    },
    resolver: {
      resolverMainFields: ['sbmodern', 'react-native', 'browser', 'main'],
    },
  };

  return mergeConfig(quickCryptoConfig, svgTransformerConfig, defaultConfig);
})();
