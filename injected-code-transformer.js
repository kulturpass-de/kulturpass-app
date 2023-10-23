const babelTransformer = require('metro-react-native-babel-transformer');
const svgTransformer = require('react-native-svg-transformer');

module.exports.transform = ({ src, filename, options, plugins }) => {
  if (!!filename && filename.endsWith('.raw.js')) {
    return babelTransformer.transform({
      /**
       * Add return true to the end of the ouput: https://github.com/react-native-webview/react-native-webview/blob/master/docs/Guide.md#the-injectedjavascript-prop
       */
      src: `const code = ${JSON.stringify(src)} + '\\ntrue;'; module.exports = code;`,
      filename,
      options,
      plugins,
    });
  } else {
    return svgTransformer.transform({ src, filename, options, plugins });
  }
};
