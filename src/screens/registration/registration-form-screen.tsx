import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { StyleSheet, View } from 'react-native'
import { useDispatch } from 'react-redux'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { ModalScreen } from '../../components/modal-screen/modal-screen'
import { ModalScreenHeader } from '../../components/modal-screen/modal-screen-header'
import { FormFieldWithControl } from '../../components/form-fields/form-field-with-control'
import { TextFormField } from '../../components/form-fields/text-form-field'
import { PasswordFormField } from '../../components/form-fields/password-form-field'
import { Button } from '../../components/button/button'
import { ScreenContent } from '../../components/screen/screen-content'
import { DateFormField } from '../../components/form-fields/date-form-field'
import { useTestIdBuilder } from '../../services/test-id/test-id'
import { useTranslation } from '../../services/translation/translation'
import { CdcStatusValidationError } from '../../services/errors/cdc-errors'
import { ErrorWithCode, UnknownError } from '../../services/errors/errors'
import { DATE_SCHEMA, EMAIL_SCHEMA } from '../../features/form-validation/utils/form-validation'
import { useValidationErrors } from '../../features/form-validation/hooks/use-validation-errors'
import { ErrorAlert } from '../../features/form-validation/components/error-alert'
import { colors } from '../../theme/colors'
import { spacing } from '../../theme/spacing'
import { register } from '../../services/user/redux/thunks/register'
import { AppDispatch } from '../../services/redux/configure-store'

export type RegistrationFormData = {
  email: string
  password: string
  confirmPassword: string
  firstName: string
  lastName: string
  dateOfBirth: string
}

export type RegistrationFormDataKeys = keyof RegistrationFormData

export type RegistrationFormScreenProps = {
  onHeaderPressClose: () => void
  afterRegister: (regToken: string) => void
}

export const RegistrationFormScreen: React.FC<RegistrationFormScreenProps> = ({
  onHeaderPressClose,
  afterRegister,
}) => {
  const { t } = useTranslation()
  const dispatch = useDispatch<AppDispatch>()

  const { buildTestId } = useTestIdBuilder()
  const form = useForm<RegistrationFormData>({
    resolver: zodResolver(
      z
        .object({
          email: EMAIL_SCHEMA(t, true),
          password: z.string().trim().nonempty(),
          confirmPassword: z.string().trim().nonempty(),
          firstName: z.string().optional(),
          lastName: z.string().optional(),
          dateOfBirth: DATE_SCHEMA(t),
        })
        .refine(data => data.password === data.confirmPassword, {
          path: ['confirmPassword'],
          message: t('form_error_different_from_password'),
        }),
    ),
  })

  const { setErrors } = useValidationErrors(form)
  const [visibleError, setVisibleError] = useState<ErrorWithCode | null>(null)

  const onSubmit = form.handleSubmit(async data => {
    try {
      const accountsRegisterResponse = await dispatch(register(data)).unwrap()
      afterRegister(accountsRegisterResponse.regToken)
    } catch (error: unknown) {
      if (error instanceof CdcStatusValidationError) {
        setErrors(error)
      } else if (error instanceof ErrorWithCode) {
        setVisibleError(error)
      } else {
        setVisibleError(new UnknownError())
      }
    }
  })

  return (
    <ModalScreen testID={buildTestId('registration_form')}>
      <ErrorAlert error={visibleError} onDismiss={setVisibleError} />
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
        />
        <FormFieldWithControl
          name={'password'}
          component={PasswordFormField}
          labelI18nKey="registration_form_password"
          testID={buildTestId('registration_form_password')}
          control={form.control}
          isRequired
        />
        <FormFieldWithControl
          name={'confirmPassword'}
          component={PasswordFormField}
          labelI18nKey="registration_form_confirmPassword"
          testID={buildTestId('registration_form_confirmPassword')}
          control={form.control}
          isRequired
        />
        <FormFieldWithControl
          name={'firstName'}
          component={TextFormField}
          labelI18nKey="registration_form_firstName"
          testID={buildTestId('registration_form_firstName')}
          control={form.control}
        />
        <FormFieldWithControl
          name={'lastName'}
          component={TextFormField}
          labelI18nKey="registration_form_lastName"
          testID={buildTestId('registration_form_lastName')}
          control={form.control}
        />
        <FormFieldWithControl
          name={'dateOfBirth'}
          component={DateFormField}
          labelI18nKey="registration_form_dateOfBirth"
          testID={buildTestId('registration_form_dateOfBirth')}
          control={form.control}
        />
      </ScreenContent>
      <View style={styles.submitButtonView}>
        <Button
          disabled={!form.formState.isDirty}
          testID={buildTestId('registration_form_submit')}
          i18nKey="registration_form_submit"
          onPress={onSubmit}
        />
      </View>
    </ModalScreen>
  )
}

const styles = StyleSheet.create({
  screenContent: {
    marginTop: spacing[6],
    paddingHorizontal: spacing[5],
  },
  submitButtonView: {
    paddingTop: spacing[5],
    paddingHorizontal: spacing[5],
    borderTopColor: colors.moonDarkest,
    borderTopWidth: 2,
    backgroundColor: colors.basicWhite,
  },
})
