import React, { useCallback } from 'react'

import { useTestIdBuilder } from '../../services/test-id/test-id'
import { Screen } from '../../components/screen/screen'
import { ScreenHeader } from '../../components/screen/screen-header'
import { useTranslation } from '../../services/translation/translation'
import { useUserInfo } from '../../services/user/use-user-info'
import { usePreferenceCategories } from '../../features/preferences/hooks/use-preference-categories'
import { AccountInfoData } from '../../services/api/types'
import { Preferences } from '../../features/preferences/components/preferences'
import { LoadingSpinner } from '../../components/loading-spinner/loading-spinner'

export type PreferencesScreenProps = {
  afterSubmitTriggered: () => void
  onPressClose: () => void
}

export const PreferencesScreen: React.FC<PreferencesScreenProps> = ({ afterSubmitTriggered, onPressClose }) => {
  const { t } = useTranslation()
  const { buildTestId } = useTestIdBuilder()
  const preferenceCategories = usePreferenceCategories()
  const { firstName, updateAccountInfo, accountInfo } = useUserInfo()

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
      <Screen
        testID={buildTestId('preferences')}
        header={
          <ScreenHeader
            title={t('editPreferences_title')}
            testID={buildTestId('preferences_headline')}
            onPressClose={onPressClose}
            borderBottom
          />
        }>
        <Preferences
          onPressSubmit={onSubmit}
          firstName={firstName}
          userPreferences={accountInfo.data?.data}
          availableCategories={preferenceCategories.data?.categories}
          submitButtonI18nKey="preferences_form_profile_edit_submit"
        />
      </Screen>
    </>
  )
}
