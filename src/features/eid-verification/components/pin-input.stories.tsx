import React, { useState } from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react-native'
import { PinInput } from './pin-input'

const componentMeta: ComponentMeta<typeof PinInput> = {
  title: 'Pin Input',
  component: PinInput,
  args: {
    pinLength: 6,
    variant: 'pin',
  },
}

export default componentMeta

export const Basic: ComponentStory<typeof PinInput> = args => {
  const [value, setValue] = useState('')
  return <PinInput {...args} value={value} onChange={setValue} />
}

export const TwoRows: ComponentStory<typeof PinInput> = args => {
  const [value, setValue] = useState('')
  return <PinInput {...args} variant="puk" value={value} onChange={setValue} pinLength={10} numRows={2} />
}
