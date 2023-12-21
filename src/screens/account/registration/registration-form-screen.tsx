import { zodResolver } from '@hookform/resolvers/zod'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Platform, StyleSheet } from 'react-native'
import { useDispatch } from 'react-redux'
import { z } from 'zod'
import { Button } from '../../../components/button/button'
import { DateFormField } from '../../../components/form-fields/date-form-field'
import { FormFieldWithControl } from '../../../components/form-fields/form-field-with-control'
import { PasswordFormField } from '../../../components/form-fields/password-form-field'
import { TextFormField } from '../../../components/form-fields/text-form-field'
import { LoadingIndicator } from '../../../components/loading-indicator/loading-indicator'
import { ModalScreen } from '../../../components/modal-screen/modal-screen'
import { ModalScreenFooter } from '../../../components/modal-screen/modal-screen-footer'
import { ModalScreenHeader } from '../../../components/modal-screen/modal-screen-header'
import { ScreenContent } from '../../../components/screen/screen-content'
import { useFocusErrors } from '../../../features/form-validation/hooks/use-focus-errors'
import { useValidationErrors } from '../../../features/form-validation/hooks/use-validation-errors'
import { DATE_SCHEMA, EMAIL_SCHEMA } from '../../../features/form-validation/utils/form-validation'
import { CdcStatusValidationError } from '../../../services/errors/cdc-errors'
import { ErrorAlertManager } from '../../../services/errors/error-alert-provider'
import { ErrorWithCode, UnknownError } from '../../../services/errors/errors'
import { logger } from '../../../services/logger'
import { AppDispatch } from '../../../services/redux/configure-store'
import { useTestIdBuilder } from '../../../services/test-id/test-id'
import { useTranslation } from '../../../services/translation/translation'
import { register } from '../../../services/user/redux/thunks/register'
import { spacing } from '../../../theme/spacing'

export type RegistrationFormData = {
  email: string
  password: string
  confirmPassword: string
  firstName: string
  dateOfBirth: string
}

export type RegistrationFormDataKeys = keyof RegistrationFormData

export type RegistrationFormScreenProps = {
  onHeaderPressClose: () => void
  afterRegister: (regToken: string, firstName: string) => void
}

export const RegistrationFormScreen: React.FC<RegistrationFormScreenProps> = ({
  onHeaderPressClose,
  afterRegister,
}) => {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)

  const dispatch = useDispatch<AppDispatch>()

  const { buildTestId } = useTestIdBuilder()
  const form = useForm<RegistrationFormData>({
    shouldFocusError: false,
    resolver: zodResolver(
      z
        .object({
          email: EMAIL_SCHEMA(t, true),
          password: z.string().trim().min(1),
          confirmPassword: z.string().trim().min(1),
          firstName: z.string().optional(),
          dateOfBirth: DATE_SCHEMA(t).optional(),
        })
        .refine(data => data.password === data.confirmPassword, {
          path: ['confirmPassword'],
          message: t('form_error_different_from_password'),
        }),
    ),
  })

  useFocusErrors(form)
  const { setErrors } = useValidationErrors(form)

  const onSubmit = form.handleSubmit(async data => {
    setLoading(true)
    try {
      const accountsRegisterResponse = await dispatch(register(data)).unwrap()
      afterRegister(accountsRegisterResponse.regToken, accountsRegisterResponse.profile.firstName)
      form.reset()
    } catch (error: unknown) {
      if (error instanceof CdcStatusValidationError) {
        setErrors(error)
      } else if (error instanceof ErrorWithCode) {
        ErrorAlertManager.current?.showError(error)
      } else {
        logger.warn('account register error cannot be interpreted', JSON.stringify(error))
        ErrorAlertManager.current?.showError(new UnknownError('Register'))
      }
    } finally {
      setLoading(false)
    }
  })

  return (
    <ModalScreen whiteBottom testID={buildTestId('registration_form')}>
      <LoadingIndicator loading={loading} />
      <ModalScreenHeader
        titleI18nKey="registration_form_headline"
        testID={buildTestId('registration_form_headline')}
        onPressClose={onHeaderPressClose}
      />
      <ScreenContent style={styles.screenContent}>
        <FormFieldWithControl
          name={'email'}
          component={TextFormField}
          labelI18nKey="registration_form_email"
          testID={buildTestId('registration_form_email')}
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
          labelI18nKey="registration_form_password"
          testID={buildTestId('registration_form_password')}
          control={form.control}
          isRequired
          disableAccessibilityForLabel
          textContentType="password"
          registrationScenario
        />
        <FormFieldWithControl
          name={'confirmPassword'}
          component={PasswordFormField}
          labelI18nKey="registration_form_confirmPassword"
          testID={buildTestId('registration_form_confirmPassword')}
          control={form.control}
          isRequired
          disableAccessibilityForLabel
          textContentType={Platform.OS === 'ios' ? 'oneTimeCode' : 'newPassword'}
          registrationScenario
        />
        <FormFieldWithControl
          name={'firstName'}
          component={TextFormField}
          labelI18nKey="registration_form_firstName"
          testID={buildTestId('registration_form_firstName')}
          control={form.control}
          disableAccessibilityForLabel
        />
        <FormFieldWithControl
          name={'dateOfBirth'}
          component={DateFormField}
          labelI18nKey="registration_form_dateOfBirth"
          testID={buildTestId('registration_form_dateOfBirth')}
          control={form.control}
          disableAccessibilityForLabel
        />
      </ScreenContent>
      <ModalScreenFooter>
        <Button
          disabled={!form.formState.isDirty}
          testID={buildTestId('registration_form_submit')}
          i18nKey="registration_form_submit"
          onPress={onSubmit}
        />
      </ModalScreenFooter>
    </ModalScreen>
  )
}

const styles = StyleSheet.create({
  screenContent: {
    marginTop: spacing[6],
    paddingHorizontal: spacing[5],
  },
})
