import { ComponentMeta, ComponentStory } from '@storybook/react-native'
import React from 'react'
import { Chip } from './chip'

const componentMeta: ComponentMeta<typeof Chip> = {
  title: 'Chip',
  component: Chip,
  args: {},
  argTypes: { onPress: { action: 'onPress' } },
}

export default componentMeta

export const Location: ComponentStory<typeof Chip> = args => <Chip {...args} i18nKey="offerSelectionFilter_location" />

export const PostalCode: ComponentStory<typeof Chip> = args => (
  <Chip {...args} i18nKey="offerSelectionFilter_postalCode" />
)
