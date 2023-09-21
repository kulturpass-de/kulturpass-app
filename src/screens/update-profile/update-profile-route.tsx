import React, { useCallback } from 'react'
import { LoadingIndicator } from '../../components/loading-indicator/loading-indicator'
import { useDebouncedLoading } from '../../components/loading-indicator/use-debounced-loading'
import { ErrorAlert } from '../../features/form-validation/components/error-alert'
import { useTabsNavigation } from '../../navigation/tabs/hooks'
import { SettingsScreenProps } from '../../navigation/tabs/settings/types'
import { createRouteConfig } from '../../navigation/utils/create-route-config'
import { useDismissableError } from '../../services/errors/use-dismissable-error'
import { useUserInfo } from '../../services/user/use-user-info'
import { UpdateProfileScreen } from './update-profile-screen'

export const UpdateProfileRouteName = 'UpdateProfile'

export type UpdateProfileRouteParams = undefined

export type UpdateProfileRouteProps = SettingsScreenProps<'UpdateProfile'>

export const UpdateProfileRoute: React.FC<UpdateProfileRouteProps> = () => {
  const tabsNavigation = useTabsNavigation()
  const { accountInfo } = useUserInfo()

  const closeUpdateProfileScreen = useCallback(() => {
    tabsNavigation.goBack()
  }, [tabsNavigation])

  const { visibleError, onDismissVisibleError } = useDismissableError(
    accountInfo.isError ? accountInfo.error : undefined,
  )

  const handleDismissErrorAndClose = useCallback(() => {
    onDismissVisibleError()
    closeUpdateProfileScreen()
  }, [closeUpdateProfileScreen, onDismissVisibleError])

  const isLoading = useDebouncedLoading(accountInfo.isFetching)

  return (
    <>
      <LoadingIndicator loading={isLoading} />
      <ErrorAlert error={visibleError} onDismiss={handleDismissErrorAndClose} />

      {accountInfo?.data?.data && accountInfo?.data?.profile ? (
        <UpdateProfileScreen
          accountInfoData={{ data: accountInfo.data.data, profile: accountInfo.data.profile }}
          onHeaderPressClose={closeUpdateProfileScreen}
          afterUpdate={closeUpdateProfileScreen}
        />
      ) : null}
    </>
  )
}

export const UpdateProfileRouteConfig = createRouteConfig({
  name: UpdateProfileRouteName,
  component: UpdateProfileRoute,
})
