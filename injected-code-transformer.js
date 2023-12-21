const babelTransformer = require('metro-react-native-babel-transformer');
const svgTransformer = require('react-native-svg-transformer');

/**
 * As injected code is must be a string and we want to import js files,
 * this transformer will add the js file as a string export. Also adds `true;` to the end of the code string as required by react-native-webview.
 */
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
