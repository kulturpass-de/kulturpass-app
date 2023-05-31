import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react-native'
import { InfoBox } from './info-box'
import { Text } from 'react-native'

type InfoBoxType = typeof InfoBox

const componentMeta: ComponentMeta<InfoBoxType> = {
  title: 'Info Box',
  component: InfoBox,
  argTypes: {},
}

export default componentMeta

export const PinkBoxWithText: ComponentStory<InfoBoxType> = () => (
  <InfoBox>
    <Text>{'this is a pink info box with a black shadow'}</Text>
  </InfoBox>
)
