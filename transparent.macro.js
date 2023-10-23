const { createMacro, MacroError } = require('babel-plugin-macros');

module.exports = createMacro(toTransparentColorMacro);

/**
 * This Babel Macro adds the last two Hex chars for the given opacity number to the string
 */
function toTransparentColorMacro({ references, babel }) {
  references.default.forEach(referencePath => {
    if (referencePath.parentPath.type === 'CallExpression') {
      replaceFunctionWithPlusStmnt(referencePath.parentPath.get('arguments'), babel);
    } else {
      throw new MacroError('transparent.macro can only be called as a function');
    }
  });
}

function replaceFunctionWithPlusStmnt(argumentsPaths, babel) {
  const color = argumentsPaths[0].node;
  const opacity = argumentsPaths[1].node;

  argumentsPaths[0].parentPath.replaceWith(createTransparentColor(color, opacity, babel));
}

function createTransparentColor(color, opacity, babel) {
  const opacityValue = opacity.value;

  if (typeof opacityValue !== 'number' || opacityValue < 0.0 || opacityValue > 1.0) {
    throw new MacroError('Opacity is no number or not in range 0.0 - 1.0', opacityValue);
  }

  const opacityStr = Math.floor(opacityValue * 255)
    .toString(16)
    .toUpperCase()
    .padStart(2, '0');
  return babel.types.binaryExpression('+', color, babel.types.stringLiteral(opacityStr));
}
