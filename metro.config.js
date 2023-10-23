const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const exclusionList = require('metro-config/src/defaults/exclusionList');
const defaultConfig = getDefaultConfig(__dirname);
const { assetExts, sourceExts } = defaultConfig.resolver;

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
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

/**
 * react-native-quick-crypto setup, almost as described here:
 * https://github.com/margelo/react-native-quick-crypto
 */
const quickCryptoConfig = {
  resolver: {
    extraNodeModules: {
      crypto: require.resolve('react-native-quick-crypto/src/index.ts'),
      stream: require.resolve('stream-browserify'),
      buffer: require.resolve('@craftzdog/react-native-buffer'),
    },
  },
};

/**
 * react-native-svg-transformer setup, as described here:
 * https://github.com/kristerkari/react-native-svg-transformer
 */
const svgAndInjectedCodeTransformerConfig = {
  transformer: {
    babelTransformerPath: require.resolve('./injected-code-transformer.js'),
  },
  resolver: {
    assetExts: assetExts.filter(ext => ext !== 'svg'),
    sourceExts: [...sourceExts, 'svg'],
    blacklistRE: exclusionList([/webview-injected-code\/src\/.*/]),
  },
};

module.exports = mergeConfig(defaultConfig, quickCryptoConfig, svgAndInjectedCodeTransformerConfig, config);
