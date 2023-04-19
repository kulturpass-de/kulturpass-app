/*  eslint-disable react/jsx-no-bind */

import React from 'react'
import { render, screen } from '@testing-library/react-native'

import { buildTestId } from '../../services/test-id/test-id'
import { AppProviders, I18nProvider, StoreProvider } from '../../services/testing/test-utils'
import { AppInformationsScreen } from './app-informations-screen'
import { ViewProfileScreen } from './view-profile-screen'

const renderScreen = (children: React.ReactNode) => {
  render(
    <AppProviders>
      <I18nProvider>{children}</I18nProvider>
    </AppProviders>,
  )
}

test('Should render app informations screen', async () => {
  renderScreen(<AppInformationsScreen />)
  expect(screen.getByTestId(buildTestId('app_informations_screen'))).toBeOnTheScreen()
  expect(screen.getByTestId(buildTestId('app_informations_screen_title'))).toBeOnTheScreen()
  expect(screen.getByTestId(buildTestId('app_informations_version_text'))).toBeOnTheScreen()
})

test('Should render menu item in settings page', async () => {
  renderScreen(
    <StoreProvider>
      <ViewProfileScreen
        onPressAppInformations={() => {}}
        onPressLogin={() => {}}
        onPressLogout={() => {}}
        onPressDeveloperMenu={() => {}}
        onPressChangeLanguage={() => {}}
        onPressEditPreferences={() => {}}
      />
    </StoreProvider>,
  )
  expect(await screen.findByTestId(buildTestId('settings_screen'))).toBeOnTheScreen()
  expect(screen.getByTestId(buildTestId('settings_app_informations_button'))).toBeOnTheScreen()
})
