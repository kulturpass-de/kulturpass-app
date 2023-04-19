import React, { useCallback } from 'react'

import { notificationService } from '../../../services/notification/notification-service'
import { useDispatch } from 'react-redux'
import { setShowOnboardingOnStartup } from '../redux/onboarding'
import { OnboardingScreen } from '../components/onboarding-screen'

export type OnboardingNotificationPermissionScreenProps = {
  onNext: () => void
}

export const OnboardingNotificationPermissionScreen: React.FC<OnboardingNotificationPermissionScreenProps> = ({
  onNext,
}) => {
  const dispatch = useDispatch()

  const onAcceptAndDeny = useCallback(() => {
    dispatch(setShowOnboardingOnStartup(false))
    onNext()
  }, [dispatch, onNext])

  const onAccept = useCallback(async () => {
    try {
      await notificationService.requestNotificationPermission()
    } catch (e) {
    } finally {
      onAcceptAndDeny()
    }
  }, [onAcceptAndDeny])

  return (
    <OnboardingScreen
      testID="onboarding_notificationPermission"
      titleI18nKey="onboarding_notificationPermission_headline_title"
      contentTitleI18nKey="onboarding_notificationPermission_content_title"
      contentTextI18nKey="onboarding_notificationPermission_content_text"
      acceptButtonI18nKey="onboarding_notificationPermission_acceptButton"
      denyButtonI18nKey="onboarding_notificationPermission_denyButton"
      illustrationI18nKey="onboarding_notificationPermission_image_alt"
      illustrationType="notification-consent"
      onAccept={onAccept}
      onDeny={onAcceptAndDeny}
    />
  )
}
