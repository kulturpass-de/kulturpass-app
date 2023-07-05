import { ComponentStory, ComponentMeta } from '@storybook/react-native'
import React from 'react'
import { SvgImage } from './svg-image'

export default {
  title: 'SvgImage',
  component: SvgImage,
  args: {
    type: 'placeholder-rectangle', // default svg type
    screenWidthRelativeSize: 0.5,
  },
  argTypes: {
    type: {
      control: 'radio',
      options: ['placeholder-rectangle', 'placeholder-circle'],
    },
    screenWidthRelativeSize: {
      control: { type: 'number', min: 0.1, max: 1.0, step: 0.1 },
    },
  },
} as ComponentMeta<typeof SvgImage>

export const Placeholder_200x200: ComponentStory<typeof SvgImage> = args => (
  <SvgImage {...args} width={200} height={200} />
)

export const Placeholder_400x400: ComponentStory<typeof SvgImage> = args => (
  <SvgImage {...args} width={400} height={400} />
)

export const Placeholder_RelativeSize: ComponentStory<typeof SvgImage> = ({ screenWidthRelativeSize, ...args }) => (
  <SvgImage {...args} screenWidthRelativeSize={screenWidthRelativeSize} />
)
