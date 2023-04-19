import React, { useCallback } from 'react'

import { ModalScreen } from '../../components/modal-screen/modal-screen'
import { ModalScreenHeader } from '../../components/modal-screen/modal-screen-header'
import { useTestIdBuilder } from '../../services/test-id/test-id'
import { useUserInfo } from '../../services/user/use-user-info'
import { usePreferenceCategories } from '../../features/preferences/hooks/use-preference-categories'
import { AccountInfoData } from '../../services/api/types'
import { Preferences } from '../../features/preferences/components/preferences'
import { LoadingSpinner } from '../../components/loading-spinner/loading-spinner'

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
  const preferenceCategories = usePreferenceCategories()
  const { firstName, updateAccountInfo, accountInfo } = useUserInfo(regToken)

  const onSubmit = useCallback(
    async (preferences: AccountInfoData) => {
      await updateAccountInfo(preferences)
      afterSubmitTriggered()
    },
    [updateAccountInfo, afterSubmitTriggered],
  )

  return (
    <>
      <LoadingSpinner isEnabled={preferenceCategories.isLoading || accountInfo.isLoading} />
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
