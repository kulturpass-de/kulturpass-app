import React, { FC, useCallback, useMemo } from 'react'
import { Pressable, PressableStateCallbackType, StyleProp, ViewStyle, Text, View } from 'react-native'

import { TestId, useTestIdBuilder } from '../../services/test-id/test-id'
import { ButtonModifier, ButtonVariant, ButtonWidthOption } from './types'
import { buttonModifierStyle, baseButtonStyle, buttonVariantStyles, buttonWidthOptionStyle } from './button-style'
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
  iconSource?: IconProps['source']
  iconPosition?: 'left' | 'right'
}

export const Button: FC<ButtonProps> = ({
  variant: buttonVariant = 'primary',
  widthOption = 'stretch',
  modifier = 'default',
  disabled = false,
  i18nKey,
  i18nParams,
  onPress,
  testID = i18nKey,
  bodyStyleOverrides = {},
  iconSource,
  iconPosition = 'right',
}) => {
  const { t } = useTranslation()

  const { addTestIdModifier } = useTestIdBuilder()

  const buttonPressableStyle = useMemo<ViewStyle>(() => {
    const { width: buttonWidth } = buttonWidthOptionStyle[widthOption]
    return buttonWidth
  }, [widthOption])

  const buttonContainerStyle = useCallback<(state: PressableStateCallbackType) => StyleProp<ViewStyle>>(
    ({ pressed }) => {
      const { buttonContainer } = baseButtonStyle
      const { size: buttonSize } = buttonModifierStyle[modifier]
      const { width: buttonWidth } = buttonWidthOptionStyle[widthOption]
      const { baseContainer, disabledContainer, pressedContainer } = buttonVariantStyles[buttonVariant]
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
    [buttonVariant, widthOption, disabled, modifier, bodyStyleOverrides],
  )

  const buttonShadowStyle = useCallback<(state: PressableStateCallbackType) => StyleProp<ViewStyle>>(
    ({ pressed }) => {
      const { baseShadow, pressedShadow, disabledShadow } = buttonVariantStyles[buttonVariant]
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
    [modifier, widthOption, buttonVariant, disabled],
  )

  const buttonTextStyle = useCallback(
    (pressed: boolean) => {
      const { text: buttonText } = buttonModifierStyle[modifier]

      const { baseText, disabledText, pressedText } = buttonVariantStyles[buttonVariant]
      const style = [buttonText, baseText]

      if (disabled) {
        style.push(disabledText)
      }
      if (pressed) {
        style.push(pressedText)
      }

      return style
    },
    [buttonVariant, disabled, modifier],
  )

  const buttonText = t(i18nKey, i18nParams)
  const iconSize = modifier === 'small' ? 20 : 24

  return (
    <Pressable
      onPress={onPress}
      testID={testID}
      disabled={disabled}
      style={[baseButtonStyle.pressed, buttonPressableStyle]}>
      {state => (
        <>
          <View style={buttonShadowStyle(state)} />
          <View style={buttonContainerStyle(state)}>
            <View style={baseButtonStyle.buttonContainerInner}>
              {iconSource && iconPosition === 'left' && (
                <Icon source={iconSource} width={iconSize} height={iconSize} style={baseButtonStyle.buttonIconLeft} />
              )}
              <Text
                testID={addTestIdModifier(testID, 'text')}
                accessibilityLabel={buttonText}
                accessible
                style={buttonTextStyle(state.pressed)}>
                {buttonText}
              </Text>
              {iconSource && iconPosition === 'right' && (
                <Icon source={iconSource} width={iconSize} height={iconSize} style={baseButtonStyle.buttonIconRight} />
              )}
            </View>
          </View>
        </>
      )}
    </Pressable>
  )
}
