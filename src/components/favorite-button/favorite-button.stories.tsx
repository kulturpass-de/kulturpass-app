import React, { useState } from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react-native'
import { FavoriteButton } from './favorite-button'

const componentMeta: ComponentMeta<typeof FavoriteButton> = {
  title: 'FavoriteButton',
  component: FavoriteButton,
  args: {
    accessibilityLabel: 'test',
    testID: 'testID',
  },
}

export default componentMeta

export const Basic: ComponentStory<typeof FavoriteButton> = args => {
  const [active, setActive] = useState(false)
  return <FavoriteButton {...args} active={active} onPress={setActive} />
}
