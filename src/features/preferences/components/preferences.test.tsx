/*  eslint-disable react/jsx-no-bind */

import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native'

import { buildTestId } from '../../../services/test-id/test-id'
import { AppProviders } from '../../../services/testing/test-utils'
import { Preferences } from './preferences'
import { NavigationContainer } from '@react-navigation/native'

const renderScreen = (children: React.ReactNode) => {
  render(
    <NavigationContainer>
      <AppProviders>{children}</AppProviders>
    </NavigationContainer>,
  )
}

const renderPreferences = (postalCodeValidatorError = false) => {
  renderScreen(
    <Preferences
      inModal={false}
      onPressSubmit={async () => {}}
      submitButtonI18nKey="preferences_form_profile_edit_submit"
      getIsValidPostalCode={(async () => ({ isError: postalCodeValidatorError })) as any}
    />,
  )
}

test('Should render preferences', async () => {
  renderPreferences()

  const submitButton = await screen.findByTestId(buildTestId('preferences_form_submit'))

  expect(submitButton).toBeOnTheScreen()
  expect(submitButton).toBeDisabled()

  await waitFor(() => expect(submitButton).toBeEnabled())
})

test('Should render preferences, type a post code only enable the submit button once post code is valid', async () => {
  renderPreferences(true)

  let submitButton = await screen.findByTestId(buildTestId('preferences_form_submit'))
  let postalCodeInput = await screen.findByTestId(buildTestId('preferences_form_postal_code_input'))

  expect(submitButton).toBeOnTheScreen()
  expect(submitButton).toBeDisabled()

  expect(postalCodeInput).toBeOnTheScreen()

  // enter post code, but with invalid length

  fireEvent.changeText(postalCodeInput, '')

  await waitFor(() => expect(submitButton).toBeEnabled())

  fireEvent.changeText(postalCodeInput, '1')

  await waitFor(() => expect(submitButton).toBeDisabled())

  fireEvent.changeText(postalCodeInput, '11111')

  await waitFor(() => expect(submitButton).toBeDisabled())

  // render screen again, mock the post code verification to not throw an error, so post code is valid

  renderPreferences(false)

  submitButton = await screen.findByTestId(buildTestId('preferences_form_submit'))
  postalCodeInput = await screen.findByTestId(buildTestId('preferences_form_postal_code_input'))

  fireEvent.changeText(postalCodeInput, '69190')

  // post code is valid, submit button can be enabled

  await waitFor(() => expect(submitButton).toBeEnabled())
})
