import React, { useState } from 'react'
import { StyleSheet, View, Pressable } from 'react-native'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useForm } from 'react-hook-form'

import { Button } from '../../components/button/button'
import { FormFieldWithControl } from '../../components/form-fields/form-field-with-control'
import { PasswordFormField } from '../../components/form-fields/password-form-field'
import { TextFormField } from '../../components/form-fields/text-form-field'
import { ModalScreen } from '../../components/modal-screen/modal-screen'
import { ScreenContent } from '../../components/screen/screen-content'
import { ModalScreenHeader } from '../../components/modal-screen/modal-screen-header'
import { TranslatedText } from '../../components/translated-text/translated-text'
import { ErrorWithCode, UnknownError } from '../../services/errors/errors'
import { useTestIdBuilder } from '../../services/test-id/test-id'
import { useTranslation } from '../../services/translation/translation'
import { CdcStatusValidationError } from '../../services/errors/cdc-errors'
import { EMAIL_SCHEMA } from '../../features/form-validation/utils/form-validation'
import { useValidationErrors } from '../../features/form-validation/hooks/use-validation-errors'
import { ErrorAlert } from '../../features/form-validation/components/error-alert'
import { colors } from '../../theme/colors'
import { LoadingIndicator } from '../../components/loading-indicator/loading-indicator'

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
  const [loading, setLoading] = useState(false)

  const form = useForm<LoginFormData>({
    resolver: zodResolver(
      z.object({
        email: EMAIL_SCHEMA(t, true),
        password: z.string().trim().nonempty(),
      }),
    ),
  })
  const { setErrors } = useValidationErrors(form)

  const [visibleError, setVisibleError] = useState<ErrorWithCode>()
  const { buildTestId } = useTestIdBuilder()

  const onPressLoginButton = form.handleSubmit(async data => {
    setLoading(true)
    try {
      await afterLogin(data)
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
        />
        <FormFieldWithControl
          name={'password'}
          component={PasswordFormField}
          testID={buildTestId('login_form_password')}
          labelI18nKey="login_form_password"
          control={form.control}
          containerStyle={style.passwordFormFieldContainerStyle}
          isRequired
        />
        <Pressable onPress={afterForgotPassword} testID={buildTestId('login_form_forgotPassword_button')}>
          <TranslatedText
            i18nKey="login_form_forgotPassword"
            testID={buildTestId('login_form_forgotPassword')}
            textStyle="CaptionSemibold"
            textStyleOverrides={style.forgotPasswordText}
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
            textStyleOverrides={style.noAccounTitle}
          />
        </View>
        <View style={style.registerText}>
          <TranslatedText
            i18nKey="login_form_noAccount_text"
            testID={buildTestId('login_form_noAccount_text')}
            textStyle="BodySmallRegular"
            textStyleOverrides={style.noAccounText}
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
    color: colors.moonDarkest,
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
  noAccounTitle: {
    color: colors.moonDarkest,
    textAlign: 'center',
  },
  noAccounText: {
    color: colors.moonDarkest,
    textAlign: 'center',
  },
})
