import { zodResolver } from '@hookform/resolvers/zod'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { StyleSheet, View } from 'react-native'
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
import { useFocusErrors } from '../../features/form-validation/hooks/use-focus-errors'
import { useValidationErrors } from '../../features/form-validation/hooks/use-validation-errors'
import { EMAIL_SCHEMA } from '../../features/form-validation/utils/form-validation'
import { CdcStatusValidationError } from '../../services/errors/cdc-errors'
import { ErrorAlertManager } from '../../services/errors/error-alert-provider'
import { ErrorWithCode, UnknownError } from '../../services/errors/errors'
import { logger } from '../../services/logger'
import { useTestIdBuilder } from '../../services/test-id/test-id'
import { useTranslation } from '../../services/translation/translation'
import { useTheme } from '../../theme/hooks/use-theme'
import { spacing } from '../../theme/spacing'

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

  const { buildTestId } = useTestIdBuilder()

  const onPressLoginButton = form.handleSubmit(async data => {
    if (loading) {
      return
    }
    setLoading(true)
    try {
      await afterLogin(data)
      form.reset()
    } catch (error: unknown) {
      if (error instanceof CdcStatusValidationError) {
        setErrors(error)
      } else if (error instanceof ErrorWithCode) {
        ErrorAlertManager.current?.showError(error)
      } else {
        logger.warn('login error cannot be interpreted', JSON.stringify(error))
        ErrorAlertManager.current?.showError(new UnknownError('Login'))
      }
    } finally {
      setLoading(false)
    }
  })

  return (
    <ModalScreen testID={buildTestId('login')} withoutBottomSafeArea>
      <LoadingIndicator loading={loading} />
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
        <Button
          bodyStyleOverrides={style.formLoginButton}
          disabled={!form.formState.isDirty || loading}
          testID={buildTestId('login_button')}
          i18nKey="login_button"
          onPress={onPressLoginButton}
        />
        <Button
          bodyStyleOverrides={style.formForgotPasswordButton}
          testID={buildTestId('login_forgotPassword_button')}
          i18nKey="login_form_forgotPassword"
          variant="transparent"
          onPress={afterForgotPassword}
          disabled={loading}
        />
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
            disabled={loading}
          />
        </View>
      </ScreenContent>
    </ModalScreen>
  )
}

const style = StyleSheet.create({
  screenContent: {
    paddingTop: spacing[10],
    paddingHorizontal: spacing[5],
  },
  passwordFormFieldContainerStyle: {
    marginBottom: spacing[2],
  },
  formLoginButton: {
    marginTop: spacing[6],
  },
  formForgotPasswordButton: {
    marginTop: spacing[1],
  },
  registerTitle: {
    marginTop: spacing[9],
  },
  registerText: {
    marginTop: spacing[5],
  },
  registerButton: {
    marginTop: spacing[5],
  },
  noAccountTitle: {
    textAlign: 'center',
  },
  noAccountText: {
    textAlign: 'center',
  },
})
