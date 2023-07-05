import { ComponentMeta, ComponentStory } from '@storybook/react-native'
import React, { useCallback, useState } from 'react'
import { TryAgainButton } from './try-again-button'

const componentMeta: ComponentMeta<typeof TryAgainButton> = {
  title: 'Try Again Button',
  component: TryAgainButton,
  args: {
    i18nKey: 'productDetail_random_tryAgain_button',
  },
  argTypes: { onPress: { action: 'onPress' } },
}

export default componentMeta

export const Basic: ComponentStory<typeof TryAgainButton> = args => {
  const [randomNumber, setRandomNumber] = useState(0)
  const randomize = useCallback(() => setRandomNumber(Math.random()), [])
  return <TryAgainButton {...args} randomTrigger={randomNumber} onPress={randomize} />
}

export const Disabled: ComponentStory<typeof TryAgainButton> = args => <TryAgainButton {...args} disabled />
