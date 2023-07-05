import { ComponentMeta, ComponentStory } from '@storybook/react-native'
import React from 'react'
import { Text } from 'react-native'
import { InfoBox } from './info-box'

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
