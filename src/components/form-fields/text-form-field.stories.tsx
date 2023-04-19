import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react-native'
import { TextFormField } from './text-form-field'

const componentMeta: ComponentMeta<typeof TextFormField> = {
  title: 'Text Form Field',
  component: TextFormField,
  args: {
    labelI18nKey: 'registration_form_firstName',
  },
  argTypes: {},
}

export default componentMeta

export const Basic: ComponentStory<typeof TextFormField> = args => <TextFormField {...args} value="some input" />

export const BasicWithError: ComponentStory<typeof TextFormField> = args => (
  <TextFormField {...args} value="some input" error={{ type: 'required' }} />
)

export const Email: ComponentStory<typeof TextFormField> = args => (
  <TextFormField
    {...args}
    labelI18nKey={'registration_form_email'}
    value="hello@email.com"
    autoCapitalize="none"
    autoComplete="email"
    autoCorrect={false}
    keyboardType="email-address"
  />
)

export const EmailWithError: ComponentStory<typeof TextFormField> = args => (
  <TextFormField
    {...args}
    labelI18nKey={'registration_form_email'}
    value="email.com"
    autoCapitalize="none"
    autoComplete="email"
    autoCorrect={false}
    keyboardType="email-address"
    error={{ type: 'not_valid_email' }}
  />
)
