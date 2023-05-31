import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react-native'
import { FavoriteButton } from './favorite-button'

const componentMeta: ComponentMeta<typeof FavoriteButton> = {
  title: 'FavoriteButton',
  component: FavoriteButton,
  args: {
    testID: 'testID',
  },
}

export default componentMeta

export const Default: ComponentStory<typeof FavoriteButton> = args => {
  return <FavoriteButton {...args} active={false} />
}

export const Active: ComponentStory<typeof FavoriteButton> = args => {
  return <FavoriteButton {...args} active={true} />
}
