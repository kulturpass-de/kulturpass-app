import { ComponentStory, ComponentMeta } from '@storybook/react-native'
import React from 'react'
import { ReleaseNotesModalScreen } from './release-notes-modal-screen'

const componentMeta: ComponentMeta<typeof ReleaseNotesModalScreen> = {
  title: 'ReleaseNotesModalScreen',
  component: ReleaseNotesModalScreen,
  args: {
    acceptButtonI18nKey: 'release_notes_screen_button_ok_text',
    bodyTitleI18nKey: 'release_notes_screen_body_title',
    bodyTextGenericI18nKey: 'release_notes_screen_body_text_generic',
    bodyTextListI18nKey: 'release_notes_screen_body_text_list',
    headerTitleI18nKey: 'release_notes_screen_headline_title',
    onPressOk: () => {
      console.log('ok')
    },
  },
}

export default componentMeta

export const Basic: ComponentStory<typeof ReleaseNotesModalScreen> = args => <ReleaseNotesModalScreen {...args} />
