import { ComponentStory, ComponentMeta } from '@storybook/react-native'
import React from 'react'
import { OnboardingNotificationPermissionScreen } from './onboarding-notification-permission-screen'

const componentMeta: ComponentMeta<typeof OnboardingNotificationPermissionScreen> = {
  title: 'OnboardingNotificationPermissionScreen',
  component: OnboardingNotificationPermissionScreen,
  args: {
    onNext: () => {},
  },
}

export default componentMeta

export const Basic: ComponentStory<typeof OnboardingNotificationPermissionScreen> = args => (
  <OnboardingNotificationPermissionScreen {...args} />
)
