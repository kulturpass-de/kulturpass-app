import { StyleSheet, TextStyle, ViewStyle } from 'react-native'
import { spacing } from '../../theme/spacing'
import { textStyles } from '../../theme/typography'
import { ButtonModifier, ButtonWidthOption } from './types'

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
    columnGap: spacing[2],
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
      paddingVertical: spacing[2],
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

export const shadow: ViewStyle = {
  position: 'absolute',
  top: 3,
  left: 3,
  zIndex: 0,
  width: '100%',
  borderRadius: spacing[6],
}

export const noShadow: ViewStyle = {
  display: 'none',
}
