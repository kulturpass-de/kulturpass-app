import React, { useState } from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react-native'
import { PinInput } from './pin-input'

const componentMeta: ComponentMeta<typeof PinInput> = {
  title: 'Pin Input',
  component: PinInput,
  args: {
    pinLength: 6,
  },
}

export default componentMeta

export const Basic: ComponentStory<typeof PinInput> = args => {
  const [value, setValue] = useState('')
  return <PinInput {...args} value={value} onChange={setValue} />
}
