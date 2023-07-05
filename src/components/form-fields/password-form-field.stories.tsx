import { ComponentMeta, ComponentStory } from '@storybook/react-native'
import React from 'react'
import { PasswordFormField } from './password-form-field'

const componentMeta: ComponentMeta<typeof PasswordFormField> = {
  title: 'Password Form Field',
  component: PasswordFormField,
  args: {
    labelI18nKey: 'registration_form_password',
  },
  argTypes: {},
}

export default componentMeta

export const Basic: ComponentStory<typeof PasswordFormField> = args => (
  <PasswordFormField {...args} value="my password" />
)

export const WithError: ComponentStory<typeof PasswordFormField> = args => (
  <PasswordFormField
    {...args}
    labelI18nKey="registration_form_confirmPassword"
    value="my password"
    error={{ type: 'different_from_password' }}
  />
)
