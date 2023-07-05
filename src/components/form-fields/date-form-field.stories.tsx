import { ComponentMeta, ComponentStory } from '@storybook/react-native'
import React from 'react'
import { DateFormField } from './date-form-field'

const componentMeta: ComponentMeta<typeof DateFormField> = {
  title: 'Date Form Field',
  component: DateFormField,
  args: {
    labelI18nKey: 'registration_form_dateOfBirth',
  },
  argTypes: {},
}

export default componentMeta

export const Basic: ComponentStory<typeof DateFormField> = args => <DateFormField {...args} value="2023-02-03" />

export const WithError: ComponentStory<typeof DateFormField> = args => (
  <DateFormField {...args} error={{ type: 'required' }} />
)
