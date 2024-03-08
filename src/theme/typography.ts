import { StyleSheet, TextStyle } from 'react-native'

export const typography = {
  primary: 'Nunito',
}

export const transformToBolderFontWeight = (input: TextStyle['fontWeight']): TextStyle['fontWeight'] => {
  switch (input) {
    case '100':
      return '300'
    case '200':
      return '400'
    case '300':
      return '500'
    case '400':
      return '600'
    case '500':
      return '700'
    case '600':
      return '800'
    case '700':
      return '900'
    case '900':
    case '800':
      return '900'
    case 'normal':
    default:
      return 'bold'
  }
}

export const textStyles = StyleSheet.create({
  /**
   * new design
   */
  HeadlineH1Black: {
    fontFamily: typography.primary,
    fontStyle: 'normal',
    fontWeight: '900',
    fontSize: 40,
    lineHeight: 48,
  },
  HeadlineH2Black: {
    fontFamily: typography.primary,
    fontStyle: 'normal',
    fontWeight: '900',
    fontSize: 32,
    lineHeight: 36,
  },
  HeadlineH3Extrabold: {
    fontFamily: typography.primary,
    fontStyle: 'normal',
    fontWeight: '800',
    fontSize: 25,
    lineHeight: 29,
  },
  HeadlineH4Extrabold: {
    fontFamily: typography.primary,
    fontStyle: 'normal',
    fontWeight: '800',
    fontSize: 21,
    lineHeight: 28,
  },
  HeadlineH4Bold: {
    fontFamily: typography.primary,
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: 21,
    lineHeight: 28,
  },
  HeadlineH4Regular: {
    fontFamily: typography.primary,
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 21,
    lineHeight: 28,
  },

  SubtitleBlack: {
    fontFamily: typography.primary,
    fontStyle: 'normal',
    fontWeight: '900',
    fontSize: 19,
    lineHeight: 23,
  },
  SubtitleExtrabold: {
    fontFamily: typography.primary,
    fontStyle: 'normal',
    fontWeight: '800',
    fontSize: 19,
    lineHeight: 23,
  },
  SubtitleSemibold: {
    fontFamily: typography.primary,
    fontStyle: 'normal',
    fontWeight: '800',
    fontSize: 19,
    lineHeight: 23,
  },
  SubtitleRegular: {
    fontFamily: typography.primary,
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 19,
    lineHeight: 23,
  },

  BodyBlack: {
    fontFamily: typography.primary,
    fontStyle: 'normal',
    fontWeight: '900',
    fontSize: 17,
    lineHeight: 23,
  },
  BodyExtrabold: {
    fontFamily: typography.primary,
    fontStyle: 'normal',
    fontWeight: '800',
    fontSize: 17,
    lineHeight: 23,
  },
  BodyBold: {
    fontFamily: typography.primary,
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: 17,
    lineHeight: 23,
  },
  BodyMedium: {
    fontFamily: typography.primary,
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: 17,
    lineHeight: 23,
  },
  BodyRegular: {
    fontFamily: typography.primary,
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 17,
    lineHeight: 23,
  },

  BodySmallExtrabold: {
    fontFamily: typography.primary,
    fontStyle: 'normal',
    fontWeight: '800',
    fontSize: 14.8,
    lineHeight: 20,
    letterSpacing: 0.25,
  },
  BodySmallBold: {
    fontFamily: typography.primary,
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: 14.8,
    lineHeight: 18,
    letterSpacing: 0.25,
  },
  BodySmallSemibold: {
    fontFamily: typography.primary,
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: 14.8,
    lineHeight: 20,
    letterSpacing: 0.25,
  },
  BodySmallMedium: {
    fontFamily: typography.primary,
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: 14.8,
    lineHeight: 18,
    letterSpacing: 0.25,
  },
  BodySmallRegular: {
    fontFamily: typography.primary,
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 14.8,
    lineHeight: 20,
    letterSpacing: 0.25,
  },

  CaptionExtrabold: {
    fontFamily: typography.primary,
    fontStyle: 'normal',
    fontWeight: '800',
    fontSize: 13,
    lineHeight: 15,
    letterSpacing: 0.4,
  },
  CaptionSemibold: {
    fontFamily: typography.primary,
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: 13,
    lineHeight: 15,
    letterSpacing: 0.4,
  },

  MicroExtraboldCaps: {
    fontFamily: typography.primary,
    fontStyle: 'normal',
    fontWeight: '800',
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  MicroExtrabold: {
    fontFamily: typography.primary,
    fontStyle: 'normal',
    fontWeight: '800',
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 0.3,
  },
  MicroMedium: {
    fontFamily: typography.primary,
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: 11,
    lineHeight: 12,
    letterSpacing: 0.4,
  },
  MicroMediumCaps: {
    fontFamily: typography.primary,
    fontStyle: 'normal',
    fontWeight: '800',
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },

  BodyPrimary1Dark: {
    fontFamily: typography.primary,
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: 13,
    lineHeight: 16,
    letterSpacing: 0.4,
  },
  SuggestionInfo: {
    fontFamily: typography.primary,
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 13,
    lineHeight: 19.5,
    letterSpacing: 0.4,
  },
})

export const textHighlighting = StyleSheet.create({
  Bold: {
    fontWeight: '700',
  },
  Link: {
    textDecorationLine: 'underline',
  },
  Italic: {
    fontStyle: 'italic',
  },
})
