import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react-native'
import { Button } from './button'

const componentMeta: ComponentMeta<typeof Button> = {
  title: 'Button',
  component: Button,
  args: {
    i18nKey: 'back_button',
    testID: 'testID',
    widthOption: 'stretch',
    disabled: false,
  },
  argTypes: { onPress: { action: 'onPress' } },
}

export default componentMeta

export const Primary: ComponentStory<typeof Button> = args => <Button {...args} />
export const PrimarySmall: ComponentStory<typeof Button> = args => (
  <Button {...args} modifier="small" widthOption="content" />
)

export const Secondary: ComponentStory<typeof Button> = args => <Button {...args} variant="secondary" />

export const Tertiary: ComponentStory<typeof Button> = args => <Button {...args} variant="tertiary" />
export const TertiarySmall: ComponentStory<typeof Button> = args => (
  <Button {...args} variant="tertiary" modifier="small" iconSource="ArrowForward" />
)

export const White: ComponentStory<typeof Button> = args => <Button {...args} variant="white" />

export const Transparent: ComponentStory<typeof Button> = args => <Button {...args} variant="transparent" />
