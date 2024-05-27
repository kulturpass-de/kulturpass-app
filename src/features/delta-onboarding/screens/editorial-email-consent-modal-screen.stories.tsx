import { ComponentStory, ComponentMeta } from '@storybook/react-native'
import React from 'react'
import { EditorialEmailConsentModalScreen } from './editorial-email-consent-modal-screen'

const componentMeta: ComponentMeta<typeof EditorialEmailConsentModalScreen> = {
  title: 'EditorialEmailConsentModalScreen',
  component: EditorialEmailConsentModalScreen,
  args: {
    screenKey: 'editorialEmailConsentModal',
    onAccept: () => {
      console.log('ok')
    },
    onDecline: () => {
      console.log('decline')
    },
  },
}

export default componentMeta

export const Basic: ComponentStory<typeof EditorialEmailConsentModalScreen> = args => (
  <EditorialEmailConsentModalScreen {...args} />
)
