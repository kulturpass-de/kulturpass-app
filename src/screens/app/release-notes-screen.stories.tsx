import { ComponentStory, ComponentMeta } from '@storybook/react-native'
import React from 'react'
import { ReleaseNotesScreen } from './release-notes-screen'

const componentMeta: ComponentMeta<typeof ReleaseNotesScreen> = {
  title: 'ReleaseNotesScreen',
  component: ReleaseNotesScreen,
  args: {
    bodyTitleI18nKey: 'release_notes_screen_body_title',
    bodyTextGenericI18nKey: 'release_notes_screen_body_text_generic',
    bodyTextListBaseI18nKey: 'release_notes_screen_body_text_list_item',
    headerTitleI18nKey: 'release_notes_screen_headline_title',
    onPressOk: () => {
      console.log('ok')
    },
  },
}

export default componentMeta

export const Basic: ComponentStory<typeof ReleaseNotesScreen> = args => <ReleaseNotesScreen {...args} />
