import React, { useCallback, useState } from 'react'
import { type FieldError } from 'react-hook-form'
import { Pressable, StyleSheet, TextInput, View, type TextInputProps, type ViewStyle } from 'react-native'
import { useTestIdBuilder, type TestId } from '../../services/test-id/test-id'
import { useTranslation } from '../../services/translation/translation'
import { useTheme } from '../../theme/hooks/use-theme'
import { spacing } from '../../theme/spacing'
import { SvgImage } from '../svg-image/svg-image'
import { TranslatedText } from '../translated-text/translated-text'
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
  updateProfileScenario?: boolean
  name: String

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
      updateProfileScenario,
      name,
    },
    ref,
  ) => {
    const { t } = useTranslation()
    const { addTestIdModifier } = useTestIdBuilder()
    const [state, setState] = useState<{ isPasswordVisible?: boolean }>({})

    const { colors } = useTheme()
    const toggleIsPasswordVisible = useCallback(() => {
      setState(currentState => ({ ...currentState, isPasswordVisible: !currentState.isPasswordVisible }))
    }, [])

    return (
      <View>
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
        {(registrationScenario || updateProfileScenario) && (name === 'password' || name === 'newPassword') && (
          <TranslatedText
            textStyle="BodyRegular"
            textStyleOverrides={[styles.passwordRecommendationLabel, { color: colors.labelColor }]}
            i18nKey="password_recommendation_label"
          />
        )}
      </View>
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
  passwordRecommendationLabel: {
    marginTop: -spacing[5],
    marginBottom: spacing[6],
  },
})
