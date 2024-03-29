import { StyleSheet } from 'react-native'

export const translatedTextStyles = StyleSheet.create({
  base: {
    flexShrink: 1, // wraps the text automatically
  },
  extralight: { fontWeight: '200' },
  extralightitalic: { fontWeight: '200', fontStyle: 'italic' },
  light: { fontWeight: '300' },
  lightitalic: { fontWeight: '300', fontStyle: 'italic' },
  regular: { fontWeight: '400' },
  italic: { fontWeight: '400', fontStyle: 'italic' },
  medium: { fontWeight: '500' },
  mediumitalic: { fontWeight: '500', fontStyle: 'italic' },
  semibold: { fontWeight: '600' },
  semibolditalic: { fontWeight: '600', fontStyle: 'italic' },
  bold: { fontWeight: '700' },
  bolditalic: { fontWeight: '700', fontStyle: 'italic' },
  extrabold: { fontWeight: '800' },
  extrabolditalic: { fontWeight: '800', fontStyle: 'italic' },
  black: { fontWeight: '900' },
  blackitalic: { fontWeight: '900', fontStyle: 'italic' },
})
