import { zodResolver } from '@hookform/resolvers/zod'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { StyleSheet, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { z } from 'zod'
import { Button } from '../../../components/button/button'
import { FormFieldWithControl } from '../../../components/form-fields/form-field-with-control'
import { PasswordFormField } from '../../../components/form-fields/password-form-field'
import { Illustration } from '../../../components/illustration/illustration'
import { LoadingIndicator } from '../../../components/loading-indicator/loading-indicator'
import { ModalScreen } from '../../../components/modal-screen/modal-screen'
import { ModalScreenFooter } from '../../../components/modal-screen/modal-screen-footer'
import { ModalScreenHeader } from '../../../components/modal-screen/modal-screen-header'
import { TranslatedText } from '../../../components/translated-text/translated-text'
import { ErrorWithCode, UnknownError } from '../../../services/errors/errors'
import { useTestIdBuilder } from '../../../services/test-id/test-id'
import { useTheme } from '../../../theme/hooks/use-theme'
import { spacing } from '../../../theme/spacing'
import { ErrorAlert } from '../../form-validation/components/error-alert'
import { useFocusErrors } from '../../form-validation/hooks/use-focus-errors'
import { useDeleteAccount } from '../hooks/use-delete-account'

export type AccountDeletionConfirmScreenProps = {
  onNext: () => void
  onClose: () => void
}

export const AccountDeletionConfirmScreen: React.FC<AccountDeletionConfirmScreenProps> = ({ onNext, onClose }) => {
  const { buildTestId, addTestIdModifier } = useTestIdBuilder()
  const { colors } = useTheme()
  const [visibleError, setVisibleError] = useState<ErrorWithCode | undefined>()

  const { deleteAccount, loading } = useDeleteAccount()

  const form = useForm<{ password: string }>({
    shouldFocusError: false,
    resolver: zodResolver(
      z.object({
        password: z.string().trim().nonempty(),
      }),
    ),
  })

  useFocusErrors(form)

  const handlePressDelete = form.handleSubmit(async data => {
    try {
      await deleteAccount(data.password)
      onNext()
    } catch (error: unknown) {
      if (error instanceof ErrorWithCode) {
        setVisibleError(error)
      } else {
        setVisibleError(new UnknownError())
      }
    }
  })

  const screenTestId = buildTestId('accountDeletion_confirm')

  return (
    <ModalScreen whiteBottom testID={screenTestId}>
      <LoadingIndicator loading={loading} />
      <ErrorAlert error={visibleError} onDismiss={setVisibleError} />
      <ModalScreenHeader
        testID={addTestIdModifier(screenTestId, 'title')}
        titleI18nKey="accountDeletion_confirm_title"
        onPressClose={onClose}
      />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContainer}>
        <Illustration
          testID={addTestIdModifier(screenTestId, 'image_alt')}
          i18nKey="stopSign_image_alt"
          type="stop-sign"
        />
        <View style={styles.contentContainer}>
          <TranslatedText
            textStyleOverrides={[styles.contentTitle, { color: colors.labelColor }]}
            testID={addTestIdModifier(screenTestId, 'content_title')}
            i18nKey="accountDeletion_confirm_content_title"
            textStyle="HeadlineH3Extrabold"
          />
          <TranslatedText
            i18nKey="accountDeletion_confirm_content_text"
            textStyle="BodyBold"
            testID={addTestIdModifier(screenTestId, 'content_text')}
            textStyleOverrides={[styles.contentText, { color: colors.labelColor }]}
          />
          <FormFieldWithControl
            name={'password'}
            component={PasswordFormField}
            testID={addTestIdModifier(screenTestId, 'form_password')}
            labelI18nKey="accountDeletion_confirm_passwordForm_title"
            control={form.control}
            containerStyle={styles.passwordFormFieldContainerStyle}
            isRequired
            disableAccessibilityForLabel
          />
        </View>
      </ScrollView>
      <ModalScreenFooter>
        <Button
          onPress={handlePressDelete}
          variant="error"
          disabled={!form.formState.isValid || loading}
          testID={addTestIdModifier(screenTestId, 'deleteAccount_button')}
          i18nKey="accountDeletion_confirm_deleteAccount_button"
        />
        <Button
          onPress={onClose}
          variant="white"
          testID={addTestIdModifier(screenTestId, 'cancel_button')}
          i18nKey="accountDeletion_confirm_cancel_button"
        />
      </ModalScreenFooter>
    </ModalScreen>
  )
}

export const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
  },
  scrollViewContainer: {
    flexGrow: 1,
  },
  contentContainer: {
    justifyContent: 'flex-start',
    flexDirection: 'column',
    paddingHorizontal: spacing[5],
    paddingBottom: spacing[6],
  },
  contentTitle: {
    paddingTop: spacing[6],
    flexWrap: 'wrap',
    textAlign: 'center',
  },
  passwordFormFieldContainerStyle: {
    paddingBottom: spacing[2],
  },
  contentText: {
    paddingVertical: spacing[6],
  },
})
