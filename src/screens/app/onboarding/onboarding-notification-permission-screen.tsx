import React, { useCallback, useState } from 'react'
import { requestNotifications } from 'react-native-permissions'
import { useDispatch } from 'react-redux'
import { LoadingIndicator } from '../../../components/loading-indicator/loading-indicator'
import { OnboardingScreen } from '../../../features/onboarding/components/onboarding-screen'
import { logger } from '../../../services/logger'
import { notificationsStartup } from '../../../services/notifications/store/thunks/notifications-startup'
import { AppDispatch } from '../../../services/redux/configure-store'
import { useTestIdBuilder } from '../../../services/test-id/test-id'

export type OnboardingNotificationPermissionScreenProps = {
  onNext: () => void
}

export const OnboardingNotificationPermissionScreen: React.FC<OnboardingNotificationPermissionScreenProps> = ({
  onNext,
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useDispatch<AppDispatch>()

  const onAccept = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await requestNotifications(['alert', 'sound', 'badge'])
      if (response.status === 'granted') {
        await dispatch(notificationsStartup()).unwrap()
      }
    } catch (error: unknown) {
      logger.logError('Onboard Notifications', error)
    } finally {
      setIsLoading(false)
      onNext()
    }
  }, [dispatch, onNext])

  const { buildTestId } = useTestIdBuilder()

  const screenTestID = buildTestId('onboarding_notificationPermission')

  return (
    <>
      <LoadingIndicator loading={isLoading} />
      <OnboardingScreen
        testID={screenTestID}
        titleI18nKey="onboarding_notificationPermission_headline_title"
        contentTitleI18nKey="onboarding_notificationPermission_content_title"
        contentTextI18nKeyFirst="onboarding_notificationPermission_content_text_first"
        contentTextI18nKeySecond="onboarding_notificationPermission_content_text_second"
        acceptButtonI18nKey="onboarding_notificationPermission_acceptButton"
        denyButtonI18nKey="onboarding_notificationPermission_denyButton"
        illustrationI18nKey="onboarding_notificationPermission_image_alt"
        dataprivacyI18nKey="onboarding_notificationPermission_dpsLink"
        illustrationType="notification-permission"
        onAccept={onAccept}
        onDeny={onNext}
      />
    </>
  )
}
