import React, { FC, useCallback, useMemo } from 'react'
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
import { ButtonModifier, ButtonVariant, ButtonWidthOption } from './types'
import {
  buttonModifierStyle,
  baseButtonStyle,
  buttonVariantStyles,
  buttonWidthOptionStyle,
  ButtonTypeStyle,
} from './button-style'
import { useTranslation } from '../../services/translation/translation'
import { IconProps } from '../icon/icon'
import { Icon } from '../icon/icon'
import { AvailableTranslations } from '../translated-text/types'

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
  buttonVariantStyleOverrides?: Partial<ButtonTypeStyle>
  iconSource?: IconProps['source']
  iconPosition?: 'left' | 'right'
  accessibilityRole?: AccessibilityRole
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
  buttonVariantStyleOverrides,
  iconSource,
  iconPosition = 'right',
  accessibilityRole = 'button',
}) => {
  const { t } = useTranslation()

  const { addTestIdModifier } = useTestIdBuilder()

  const buttonPressableStyle = useMemo<ViewStyle>(() => {
    const { width: buttonWidth } = buttonWidthOptionStyle[widthOption]
    return buttonWidth
  }, [widthOption])

  const buttonVariantStyle: ButtonTypeStyle = useMemo(() => {
    const buttonStyles = buttonVariantStyles[buttonVariant]
    return buttonVariantStyleOverrides !== undefined
      ? { ...buttonStyles, ...buttonVariantStyleOverrides }
      : buttonStyles
  }, [buttonVariant, buttonVariantStyleOverrides])

  const buttonContainerStyle = useCallback<(state: PressableStateCallbackType) => StyleProp<ViewStyle>>(
    ({ pressed }) => {
      const { buttonContainer } = baseButtonStyle
      const { size: buttonSize } = buttonModifierStyle[modifier]
      const { width: buttonWidth } = buttonWidthOptionStyle[widthOption]
      const { baseContainer, disabledContainer, pressedContainer } = buttonVariantStyle
      const style = [buttonContainer, buttonSize, buttonWidth, baseContainer]

      if (disabled) {
        style.push(disabledContainer)
      }
      if (pressed) {
        style.push(pressedContainer)
      }
      style.push(bodyStyleOverrides)

      return style
    },
    [modifier, widthOption, buttonVariantStyle, disabled, bodyStyleOverrides],
  )

  const buttonShadowStyle = useCallback<(state: PressableStateCallbackType) => StyleProp<ViewStyle>>(
    ({ pressed }) => {
      const { baseShadow, pressedShadow, disabledShadow } = buttonVariantStyle
      const { size: buttonSize } = buttonModifierStyle[modifier]
      const { width: buttonWidth } = buttonWidthOptionStyle[widthOption]
      const style = [baseShadow, buttonSize, buttonWidth]

      if (disabled) {
        style.push(disabledShadow)
      }
      if (pressed) {
        style.push(pressedShadow)
      }

      return style
    },
    [buttonVariantStyle, modifier, widthOption, disabled],
  )

  const buttonTextStyle = useCallback(
    (pressed: boolean) => {
      const { text: buttonText } = buttonModifierStyle[modifier]

      const { baseText, disabledText, pressedText } = buttonVariantStyle
      const style = [buttonText, baseText]

      if (disabled) {
        style.push(disabledText)
      }
      if (pressed) {
        style.push(pressedText)
      }

      return style
    },
    [buttonVariantStyle, disabled, modifier],
  )

  const buttonText = i18nParams ? t(i18nKey, i18nParams) : t(i18nKey)
  const iconSize = modifier === 'small' ? 20 : 24

  return (
    <Pressable
      onPress={onPress}
      testID={testID}
      disabled={disabled}
      accessibilityLabel={buttonText}
      accessible
      accessibilityRole={accessibilityRole}
      accessibilityState={disabled ? { disabled: true } : undefined}
      style={[baseButtonStyle.pressed, buttonPressableStyle]}>
      {state => (
        <>
          <View style={buttonShadowStyle(state)} />
          <View style={buttonContainerStyle(state)}>
            <View style={baseButtonStyle.buttonContainerInner}>
              {iconSource && iconPosition === 'left' && (
                <Icon source={iconSource} width={iconSize} height={iconSize} style={baseButtonStyle.buttonIconLeft} />
              )}
              <Text testID={addTestIdModifier(testID ?? i18nKey, 'text')} style={buttonTextStyle(state.pressed)}>
                {buttonText}
              </Text>
              {iconSource && iconPosition === 'right' && (
                <Icon
                  source={iconSource}
                  width={iconSize}
                  height={iconSize}
                  style={[baseButtonStyle.buttonIconRight, disabled ? baseButtonStyle.buttonIconDisabled : undefined]}
                />
              )}
            </View>
          </View>
        </>
      )}
    </Pressable>
  )
}
