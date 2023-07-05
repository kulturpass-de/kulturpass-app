import { StyleSheet, TextStyle, ViewStyle } from 'react-native'
import { colors } from '../../theme/colors'
import { spacing } from '../../theme/spacing'
import { textStyles } from '../../theme/typography'
import { ButtonModifier, ButtonVariant, ButtonWidthOption } from './types'

export const baseButtonStyle = StyleSheet.create({
  pressed: {
    flexDirection: 'row',
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  buttonContainerInner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonIconLeft: {
    marginRight: spacing[2],
  },
  buttonIconRight: {
    marginLeft: spacing[2],
  },
  buttonIconDisabled: {
    opacity: 0.6,
  },
})

export type ButtonWidthOptionStyle = StyleSheet.NamedStyles<{
  width: ViewStyle
}>

export const buttonWidthOptionStyle: Record<ButtonWidthOption, ButtonWidthOptionStyle> = {
  stretch: StyleSheet.create({
    width: {
      width: '100%',
    },
  }),
  content: StyleSheet.create({
    width: {},
  }),
  grow: StyleSheet.create({
    width: {
      flexGrow: 1,
    },
  }),
}

export type ButtonModifierStyle = StyleSheet.NamedStyles<{
  size: ViewStyle
  text: TextStyle
}>

export const buttonModifierStyle: Record<ButtonModifier, ButtonModifierStyle> = {
  default: StyleSheet.create({
    size: {
      paddingHorizontal: spacing[5],
      minHeight: 48,
      borderRadius: spacing[6],
    },
    text: {
      ...textStyles.BodyMedium,
    },
  }),
  small: StyleSheet.create({
    size: {
      paddingHorizontal: spacing[5],
      minHeight: 36,
      borderRadius: spacing[6],
    },
    text: {
      ...textStyles.BodySmallBold,
    },
  }),
}

export type ButtonTypeStyle = StyleSheet.NamedStyles<{
  baseContainer: ViewStyle
  baseShadow: ViewStyle
  baseText: TextStyle

  pressedContainer: ViewStyle
  pressedShadow: ViewStyle
  pressedText: TextStyle

  disabledContainer: ViewStyle
  disabledShadow: ViewStyle
  disabledText: TextStyle
}>

// TODO: Cleanup empty styles
export const buttonVariantStyles: Record<ButtonVariant, ButtonTypeStyle> = {
  primary: StyleSheet.create({
    baseContainer: {
      backgroundColor: colors.basicBlack,
      borderColor: colors.basicBlack,
    },
    baseShadow: {
      display: 'none',
    },
    baseText: {
      color: colors.basicWhite,
    },
    pressedContainer: {
      backgroundColor: colors.transparentBlack70,
    },
    pressedShadow: {},
    pressedText: {},
    disabledContainer: {
      backgroundColor: colors.moonDarkest,
      opacity: 0.55,
      borderColor: colors.transparentBlack50,
    },
    disabledShadow: {},
    disabledText: {},
  }),
  secondary: StyleSheet.create({
    baseContainer: {
      backgroundColor: colors.basicWhite,
      borderColor: colors.basicBlack,
    },
    baseShadow: {
      display: 'none',
    },
    baseText: {
      color: colors.basicBlack,
    },
    pressedContainer: {
      backgroundColor: colors.transparentPrimaryLightest50,
    },
    pressedShadow: {},
    pressedText: {},
    disabledContainer: {
      backgroundColor: colors.basicWhite,
      borderColor: colors.transparentBlack50,
    },
    disabledShadow: {},
    disabledText: {
      color: colors.transparentBlack50,
    },
  }),
  tertiary: StyleSheet.create({
    baseContainer: {
      backgroundColor: colors.basicWhite,
      borderColor: colors.basicBlack,
    },
    baseShadow: {
      position: 'absolute',
      top: 3,
      left: 3,
      backgroundColor: colors.primaryLighter,
      zIndex: 0,
      width: '100%',
      borderRadius: spacing[6],
    },
    baseText: {
      color: colors.basicBlack,
    },
    pressedContainer: {
      backgroundColor: '#E7E1FF', // please don't move the hex codes into colors, as they're computed exclusivly for this use case
    },
    pressedShadow: {
      backgroundColor: colors.basicBlack,
    },
    pressedText: {},
    disabledContainer: {
      backgroundColor: colors.basicWhite,
      borderColor: '#625869',
    },
    disabledShadow: {
      backgroundColor: '#625869',
    },
    disabledText: {
      color: '#625869',
    },
  }),
  white: StyleSheet.create({
    baseContainer: {
      backgroundColor: colors.basicWhite,
      borderColor: colors.basicWhite,
    },
    baseShadow: {
      display: 'none',
    },
    baseText: {
      color: colors.basicBlack,
    },
    pressedContainer: {
      backgroundColor: colors.transparentPrimaryLightest50,
      borderColor: colors.transparentPrimaryLightest50,
    },
    pressedShadow: {},
    pressedText: {},
    disabledContainer: {
      borderColor: colors.basicWhite,
      backgroundColor: colors.basicWhite,
    },
    disabledShadow: {},
    disabledText: {
      color: colors.transparentBlack50,
    },
  }),
  transparent: StyleSheet.create({
    baseContainer: {
      backgroundColor: colors.transparentWhite00,
      borderColor: colors.transparentWhite00,
    },
    baseShadow: {
      display: 'none',
    },
    baseText: {
      color: colors.basicBlack,
    },
    pressedContainer: {},
    pressedShadow: {},
    pressedText: {
      color: colors.primaryDarkest,
    },
    disabledContainer: {},
    disabledShadow: {},
    disabledText: {
      color: colors.transparentBlack50,
    },
  }),
  error: StyleSheet.create({
    baseContainer: {
      backgroundColor: colors.redDarkest,
      borderColor: colors.redDarkest,
    },
    baseShadow: {
      display: 'none',
    },
    baseText: {
      color: colors.basicWhite,
    },
    pressedContainer: {
      backgroundColor: colors.redDarkest,
      opacity: 0.6,
    },
    pressedShadow: {},
    pressedText: {},
    disabledContainer: {
      backgroundColor: colors.redDarkest,
      opacity: 0.55,
      borderColor: 'transparent',
    },
    disabledShadow: {},
    disabledText: {},
  }),
}
