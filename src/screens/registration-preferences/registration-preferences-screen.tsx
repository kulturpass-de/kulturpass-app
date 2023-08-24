import React, { useCallback } from 'react'
import { LoadingIndicator } from '../../components/loading-indicator/loading-indicator'
import { ModalScreen } from '../../components/modal-screen/modal-screen'
import { ModalScreenHeader } from '../../components/modal-screen/modal-screen-header'
import { Preferences } from '../../features/preferences/components/preferences'
import { usePreferences } from '../../features/preferences/hooks/use-preferences'
import { commerceApi } from '../../services/api/commerce-api'
import { AccountInfoData } from '../../services/api/types'
import { ErrorAlertManager } from '../../services/errors/error-alert-provider'
import { ErrorWithCode, UnknownError } from '../../services/errors/errors'
import { useTestIdBuilder } from '../../services/test-id/test-id'
import { useSetAccountInfo } from '../../services/user/use-set-account-info'

export type RegistrationPreferencesScreenProps = {
  regToken: string
  afterSubmitTriggered: () => void
  onPressClose: () => void
}

export const RegistrationPreferencesScreen: React.FC<RegistrationPreferencesScreenProps> = ({
  regToken,
  afterSubmitTriggered,
  onPressClose,
}) => {
  const { buildTestId } = useTestIdBuilder()
  const preferenceCategories = commerceApi.useGetPreferenceCategoriesQuery()
  const [getIsValidPostalCode] = commerceApi.useLazyGetIsValidPostalCodeQuery()
  const setAccountInfo = useSetAccountInfo(regToken)
  const preferencesForm = usePreferences({ getIsValidPostalCode })

  const onSubmit = useCallback(
    async (data: AccountInfoData) => {
      try {
        await setAccountInfo({ data })
        afterSubmitTriggered()
      } catch (error: unknown) {
        if (error instanceof ErrorWithCode) {
          ErrorAlertManager.current?.showError(error)
        } else {
          ErrorAlertManager.current?.showError(new UnknownError())
        }
      }
    },
    [setAccountInfo, afterSubmitTriggered],
  )

  return (
    <>
      <LoadingIndicator loading={preferenceCategories.isLoading} />
      <ModalScreen whiteBottom testID={buildTestId('preferences')}>
        <ModalScreenHeader
          titleI18nKey="preferences_headline"
          testID={buildTestId('preferences_headline')}
          onPressClose={onPressClose}
        />
        <Preferences
          inModal
          form={preferencesForm}
          onPressSubmit={onSubmit}
          availableCategories={preferenceCategories.data?.categories}
          submitButtonI18nKey="preferences_form_registration_submit"
          getIsValidPostalCode={getIsValidPostalCode}
        />
      </ModalScreen>
    </>
  )
}
