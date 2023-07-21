import { zodResolver } from '@hookform/resolvers/zod'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { StyleSheet, View, Pressable } from 'react-native'
import { z } from 'zod'
import { Button } from '../../components/button/button'
import { FormFieldWithControl } from '../../components/form-fields/form-field-with-control'
import { PasswordFormField } from '../../components/form-fields/password-form-field'
import { TextFormField } from '../../components/form-fields/text-form-field'
import { LoadingIndicator } from '../../components/loading-indicator/loading-indicator'
import { ModalScreen } from '../../components/modal-screen/modal-screen'
import { ModalScreenHeader } from '../../components/modal-screen/modal-screen-header'
import { ScreenContent } from '../../components/screen/screen-content'
import { TranslatedText } from '../../components/translated-text/translated-text'
import { ErrorAlert } from '../../features/form-validation/components/error-alert'
import { useFocusErrors } from '../../features/form-validation/hooks/use-focus-errors'
import { useValidationErrors } from '../../features/form-validation/hooks/use-validation-errors'
import { EMAIL_SCHEMA } from '../../features/form-validation/utils/form-validation'
import { CdcStatusValidationError } from '../../services/errors/cdc-errors'
import { ErrorWithCode, UnknownError } from '../../services/errors/errors'
import { useTestIdBuilder } from '../../services/test-id/test-id'
import { useTranslation } from '../../services/translation/translation'
import { useTheme } from '../../theme/hooks/use-theme'

export type LoginFormData = {
  email: string
  password: string
}

export type LogInScreenProps = {
  afterLogin: (loginData: LoginFormData) => Promise<void>
  afterRegister: () => void
  afterClose: () => void
  afterForgotPassword: () => void
  onLoginSuccess: () => void
}

export const LogInScreen: React.FC<LogInScreenProps> = ({
  afterClose,
  afterRegister,
  afterForgotPassword,
  afterLogin,
}) => {
  const { t } = useTranslation()
  const { colors } = useTheme()

  const [loading, setLoading] = useState(false)

  const form = useForm<LoginFormData>({
    shouldFocusError: false,
    resolver: zodResolver(
      z.object({
        email: EMAIL_SCHEMA(t, true),
        password: z.string().trim().nonempty(),
      }),
    ),
  })

  useFocusErrors(form)
  const { setErrors } = useValidationErrors(form)

  const [visibleError, setVisibleError] = useState<ErrorWithCode>()
  const { buildTestId } = useTestIdBuilder()

  const onPressLoginButton = form.handleSubmit(async data => {
    setLoading(true)
    try {
      await afterLogin(data)
      form.reset()
    } catch (error: unknown) {
      if (error instanceof CdcStatusValidationError) {
        setErrors(error)
      } else if (error instanceof ErrorWithCode) {
        setVisibleError(error)
      } else {
        setVisibleError(new UnknownError())
      }
    } finally {
      setLoading(false)
    }
  })

  return (
    <ModalScreen testID={buildTestId('login')}>
      <LoadingIndicator loading={loading} />
      <ErrorAlert error={visibleError} onDismiss={setVisibleError} />
      <ModalScreenHeader
        titleI18nKey="login_headline"
        testID={buildTestId('login_headline')}
        onPressClose={afterClose}
      />
      <ScreenContent style={style.screenContent}>
        <FormFieldWithControl
          name={'email'}
          component={TextFormField}
          testID={buildTestId('login_form_email')}
          labelI18nKey="login_form_email"
          control={form.control}
          autoCapitalize="none"
          autoComplete="email"
          autoCorrect={false}
          keyboardType="email-address"
          isRequired
          disableAccessibilityForLabel
          textContentType="username"
        />
        <FormFieldWithControl
          name={'password'}
          component={PasswordFormField}
          testID={buildTestId('login_form_password')}
          labelI18nKey="login_form_password"
          control={form.control}
          containerStyle={style.passwordFormFieldContainerStyle}
          isRequired
          disableAccessibilityForLabel
          textContentType="password"
        />
        <Pressable
          accessibilityRole="link"
          onPress={afterForgotPassword}
          testID={buildTestId('login_form_forgotPassword_button')}>
          <TranslatedText
            i18nKey="login_form_forgotPassword"
            testID={buildTestId('login_form_forgotPassword')}
            textStyle="CaptionSemibold"
            textStyleOverrides={[style.forgotPasswordText, { color: colors.labelColor }]}
          />
        </Pressable>
        <View style={style.formLoginButton}>
          <Button
            disabled={!form.formState.isDirty}
            testID={buildTestId('login_button')}
            i18nKey="login_button"
            onPress={onPressLoginButton}
          />
        </View>

        <View style={style.registerTitle}>
          <TranslatedText
            i18nKey="login_form_noAccount_title"
            testID={buildTestId('login_form_noAccount_title')}
            textStyle="HeadlineH4Bold"
            textStyleOverrides={[style.noAccountTitle, { color: colors.labelColor }]}
          />
        </View>
        <View style={style.registerText}>
          <TranslatedText
            i18nKey="login_form_noAccount_text"
            testID={buildTestId('login_form_noAccount_text')}
            textStyle="BodySmallRegular"
            textStyleOverrides={[style.noAccountText, { color: colors.labelColor }]}
          />
        </View>
        <View style={style.registerButton}>
          <Button
            testID={buildTestId('login_form_noAccount_registerButton')}
            i18nKey="login_form_noAccount_registerButton"
            variant="tertiary"
            onPress={afterRegister}
          />
        </View>
      </ScreenContent>
    </ModalScreen>
  )
}

const style = StyleSheet.create({
  screenContent: {
    paddingTop: 32,
    paddingHorizontal: 16,
  },
  passwordFormFieldContainerStyle: {
    marginBottom: 8,
  },
  formLoginButton: {
    marginTop: 24,
  },
  forgotPasswordText: {
    textDecorationLine: 'underline',
  },
  registerTitle: {
    marginTop: 40,
  },
  registerText: {
    marginTop: 8,
  },
  registerButton: {
    marginTop: 32,
    marginBottom: 40,
  },
  noAccountTitle: {
    textAlign: 'center',
  },
  noAccountText: {
    textAlign: 'center',
  },
})
