import React, { useCallback, useState } from 'react'
import { type FieldError } from 'react-hook-form'
import { Pressable, StyleSheet, TextInput, type TextInputProps, type ViewStyle } from 'react-native'
import { useTestIdBuilder, type TestId } from '../../services/test-id/test-id'
import { useTranslation } from '../../services/translation/translation'
import { spacing } from '../../theme/spacing'
import { SvgImage } from '../svg-image/svg-image'
import { AvailableTextStyles, type AvailableTranslations } from '../translated-text/types'
import { TextFormField } from './text-form-field'

export type PasswordFormFieldProps = {
  testID: TestId
  labelI18nKey: AvailableTranslations
  labelTextStyle?: AvailableTextStyles
  error?: FieldError
  containerStyle?: ViewStyle
  isRequired?: boolean
  disableAccessibilityForLabel?: boolean
  registrationScenario?: boolean

  onChange?: TextInputProps['onChangeText']
  onBlur?: TextInputProps['onBlur']
  value?: TextInputProps['value']
  textContentType?: TextInputProps['textContentType']
}

export const PasswordFormField = React.forwardRef<TextInput, PasswordFormFieldProps>(
  (
    {
      testID,
      labelI18nKey,
      labelTextStyle,
      error,
      containerStyle,
      isRequired,
      disableAccessibilityForLabel,
      onChange,
      onBlur,
      value,
      textContentType,
      registrationScenario,
    },
    ref,
  ) => {
    const { t } = useTranslation()
    const { addTestIdModifier } = useTestIdBuilder()
    const [state, setState] = useState<{ isPasswordVisible?: boolean }>({})

    const toggleIsPasswordVisible = useCallback(() => {
      setState(currentState => ({ ...currentState, isPasswordVisible: !currentState.isPasswordVisible }))
    }, [])

    return (
      <TextFormField
        ref={ref}
        testID={testID}
        labelI18nKey={labelI18nKey}
        labelTextStyle={labelTextStyle}
        error={error}
        containerStyle={containerStyle}
        isRequired={isRequired}
        disableAccessibilityForLabel={disableAccessibilityForLabel}
        onChange={onChange}
        onBlur={onBlur}
        value={value}
        secureTextEntry={!state.isPasswordVisible}
        autoComplete="password"
        autoCapitalize="none"
        autoCorrect={false}
        textContentType={textContentType}
        registrationScenario={registrationScenario}>
        <Pressable
          style={styles.inputIcon}
          onPress={toggleIsPasswordVisible}
          accessible
          accessibilityRole="button"
          accessibilityLabel={t(state.isPasswordVisible ? 'login_form_password_hide' : 'login_form_password_show')}
          testID={addTestIdModifier(testID, 'showPasswordButton')}>
          <SvgImage type={state.isPasswordVisible ? 'show-password' : 'hide-password'} width={24} height={24} />
        </Pressable>
      </TextFormField>
    )
  },
)

const styles = StyleSheet.create({
  inputIcon: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    right: spacing[5],
  },
})
