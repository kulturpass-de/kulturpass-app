import React, { useCallback } from 'react'

import { ModalScreen } from '../../components/modal-screen/modal-screen'
import { ModalScreenHeader } from '../../components/modal-screen/modal-screen-header'
import { useTestIdBuilder } from '../../services/test-id/test-id'
import { useUserInfo } from '../../services/user/use-user-info'
import { commerceApi } from '../../services/api/commerce-api'
import { AccountInfoData } from '../../services/api/types'
import { Preferences } from '../../features/preferences/components/preferences'
import { LoadingIndicator } from '../../components/loading-indicator/loading-indicator'

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
  const { firstName, setAccountInfo, accountInfo } = useUserInfo(regToken)

  const onSubmit = useCallback(
    async (data: AccountInfoData) => {
      await setAccountInfo({ data })
      afterSubmitTriggered()
    },
    [setAccountInfo, afterSubmitTriggered],
  )

  return (
    <>
      <LoadingIndicator loading={preferenceCategories.isLoading || accountInfo.isLoading} />
      <ModalScreen whiteBottom testID={buildTestId('preferences')}>
        <ModalScreenHeader
          titleI18nKey="preferences_headline"
          testID={buildTestId('preferences_headline')}
          onPressClose={onPressClose}
        />
        <Preferences
          withGreeting
          onPressSubmit={onSubmit}
          firstName={firstName}
          userPreferences={accountInfo.data?.data}
          availableCategories={preferenceCategories.data?.categories}
          submitButtonI18nKey="preferences_form_registration_submit"
        />
      </ModalScreen>
    </>
  )
}
