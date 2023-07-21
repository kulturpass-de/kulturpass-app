import React, { FC, PropsWithChildren, useCallback, useMemo } from 'react'
import {
  AccessibilityRole,
  Pressable,
  PressableStateCallbackType,
  StyleProp,
  ViewStyle,
  Text,
  View,
} from 'react-native'
import { TestId, useTestIdBuilder } from '../../services/test-id/test-id'
import { useTranslation } from '../../services/translation/translation'
import { buttonColorMappings as darkButtonColorMappings } from '../../theme/dark/color-mappings'
import { useTheme } from '../../theme/hooks/use-theme'
import { buttonColorMappings as lightButtonColorMappings } from '../../theme/light/color-mappings'
import { ButtonColors } from '../../theme/types'
import { SvgImage, SvgImageProps } from '../svg-image/svg-image'
import { AvailableTranslations } from '../translated-text/types'
import { buttonModifierStyle, baseButtonStyle, shadow, noShadow, buttonWidthOptionStyle } from './button-style'
import { ButtonModifier, ButtonVariant, ButtonWidthOption } from './types'

export type ButtonProps = {
  i18nKey: AvailableTranslations
  i18nParams?: {}
  testID?: TestId
  variant?: ButtonVariant
  widthOption?: ButtonWidthOption
  modifier?: ButtonModifier
  onPress: () => void
  disabled?: boolean
  bodyStyleOverrides?: ViewStyle
  buttonColorOverrides?: ButtonColors
  iconSource?: SvgImageProps['type']
  iconPosition?: 'left' | 'right'
  accessibilityRole?: AccessibilityRole
  accessibilityHint?: string
}

export const Button: FC<ButtonProps> = ({
  variant: buttonVariant = 'primary',
  widthOption = 'stretch',
  modifier = 'default',
  disabled = false,
  i18nKey,
  i18nParams,
  onPress,
  testID,
  bodyStyleOverrides = {},
  buttonColorOverrides,
  iconSource,
  iconPosition = 'right',
  accessibilityRole = 'button',
  accessibilityHint,
}) => {
  const { t } = useTranslation()
  const { colorScheme } = useTheme()

  const { addTestIdModifier } = useTestIdBuilder()

  const buttonPressableStyle = useMemo<ViewStyle>(() => {
    const { width: buttonWidth } = buttonWidthOptionStyle[widthOption]
    return buttonWidth
  }, [widthOption])

  const buttonColors: ButtonColors = useMemo(() => {
    if (buttonColorOverrides !== undefined) {
      return buttonColorOverrides
    }

    if (colorScheme === 'dark') {
      return darkButtonColorMappings[buttonVariant]
    } else {
      return lightButtonColorMappings[buttonVariant]
    }
  }, [buttonColorOverrides, buttonVariant, colorScheme])

  const buttonContainerStyle = useCallback<(state: PressableStateCallbackType) => StyleProp<ViewStyle>>(
    ({ pressed }) => {
      const { buttonContainer } = baseButtonStyle
      const { size: buttonSize } = buttonModifierStyle[modifier]
      const { width: buttonWidth } = buttonWidthOptionStyle[widthOption]

      let buttonBackgroundColor = buttonColors.containerBackground
      let buttonBorderColor = buttonColors.containerBorder
      let buttonOpacity: number | undefined
      if (disabled) {
        buttonBackgroundColor = buttonColors.containerBackgroundDisabled ?? buttonBackgroundColor
        buttonBorderColor = buttonColors.containerBorderDisabled ?? buttonBorderColor
        buttonOpacity = buttonColors.opacityDisabled
      } else if (pressed) {
        buttonBackgroundColor = buttonColors.containerBackgroundPressed ?? buttonBackgroundColor
        buttonBorderColor = buttonColors.containerBorderPressed ?? buttonBorderColor
        buttonOpacity = buttonColors.opacityPressed
      } else {
        buttonOpacity = buttonColors.opacity
      }

      const style: StyleProp<ViewStyle> = [
        buttonContainer,
        buttonSize,
        buttonWidth,
        { backgroundColor: buttonBackgroundColor, borderColor: buttonBorderColor, opacity: buttonOpacity },
      ]

      if (buttonBorderColor === undefined) {
        style.push({ borderWidth: 0 })
      }
      style.push(bodyStyleOverrides)
      return style
    },
    [modifier, widthOption, buttonColors, disabled, bodyStyleOverrides],
  )

  const buttonShadowStyle = useCallback<(state: PressableStateCallbackType) => StyleProp<ViewStyle>>(
    ({ pressed }) => {
      let buttonShadowColor = buttonColors.shadow
      let buttonOpacity: number | undefined
      if (disabled) {
        buttonShadowColor = buttonColors.shadowDisabled ?? buttonShadowColor
        buttonOpacity = buttonColors.opacityDisabled
      } else if (pressed) {
        buttonShadowColor = buttonColors.shadowPressed ?? buttonShadowColor
        buttonOpacity = buttonColors.opacityPressed
      } else {
        buttonOpacity = buttonColors.opacity
      }

      if (buttonShadowColor === undefined) {
        return noShadow
      }

      const { size: buttonSize } = buttonModifierStyle[modifier]
      const { width: buttonWidth } = buttonWidthOptionStyle[widthOption]

      const style: StyleProp<ViewStyle> = [
        shadow,
        { backgroundColor: buttonShadowColor, opacity: buttonOpacity },
        buttonSize,
        buttonWidth,
      ]

      return style
    },
    [disabled, modifier, widthOption, buttonColors],
  )

  const buttonTextStyle = useCallback(
    (pressed: boolean) => {
      const { text: buttonText } = buttonModifierStyle[modifier]

      let buttonTextColor = buttonColors.text
      if (disabled) {
        buttonTextColor = buttonColors.disabledText ?? buttonTextColor
      } else if (pressed) {
        buttonTextColor = buttonColors.pressedText ?? buttonTextColor
      }

      const style: StyleProp<ViewStyle> = [buttonText, { color: buttonTextColor }]

      return style
    },
    [buttonColors, disabled, modifier],
  )

  const buttonText = i18nParams ? t(i18nKey, i18nParams) : t(i18nKey)
  const iconSize = modifier === 'small' ? 20 : 24

  const ContainerWrapper = useCallback(
    ({ children }: PropsWithChildren) => {
      if (widthOption === 'content') {
        return <View>{children}</View>
      }

      return <React.Fragment>{children}</React.Fragment>
    },
    [widthOption],
  )

  return (
    <Pressable
      onPress={onPress}
      testID={testID}
      disabled={disabled}
      accessibilityLabel={buttonText}
      accessible
      accessibilityRole={accessibilityRole}
      accessibilityHint={accessibilityHint}
      accessibilityState={disabled ? { disabled: true } : undefined}
      style={[baseButtonStyle.pressed, buttonPressableStyle]}>
      {state => (
        <ContainerWrapper>
          <View style={buttonShadowStyle(state)} />
          <View style={buttonContainerStyle(state)}>
            <View style={baseButtonStyle.buttonContainerInner}>
              {iconSource && iconPosition === 'left' && (
                <SvgImage type={iconSource} width={iconSize} height={iconSize} />
              )}
              <Text testID={addTestIdModifier(testID ?? i18nKey, 'text')} style={buttonTextStyle(state.pressed)}>
                {buttonText}
              </Text>
              {iconSource && iconPosition === 'right' && (
                <SvgImage
                  type={iconSource}
                  width={iconSize}
                  height={iconSize}
                  style={[disabled ? baseButtonStyle.buttonIconDisabled : undefined]}
                />
              )}
            </View>
          </View>
        </ContainerWrapper>
      )}
    </Pressable>
  )
}
