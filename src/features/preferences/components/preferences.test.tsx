/*  eslint-disable react/jsx-no-bind */

import React from 'react'
import { render, screen, waitFor } from '@testing-library/react-native'

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

const renderPreferences = () => {
  renderScreen(
    <Preferences
      inModal={false}
      onPressSubmit={async () => {}}
      submitButtonI18nKey="preferences_form_profile_edit_submit"
    />,
  )
}

test('Should render preferences', async () => {
  renderPreferences()
  expect(await screen.findByTestId(buildTestId('preferences_form_submit'))).toBeOnTheScreen()
  await waitFor(() => expect(screen.getByTestId(buildTestId('preferences_form_submit'))).toBeEnabled())
})
