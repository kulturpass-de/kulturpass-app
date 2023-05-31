/*  eslint-disable react/jsx-no-bind */

import React from 'react'
import { render, screen } from '@testing-library/react-native'
import { NavigationContainer } from '@react-navigation/native'

import { buildTestId } from '../../services/test-id/test-id'
import { AppProviders, StoreProvider } from '../../services/testing/test-utils'
import { AppInformationsScreen } from './app-informations-screen'
import { ViewProfileScreen } from './view-profile-screen'
import { act } from 'react-test-renderer'

const renderScreen = (children: React.ReactNode) => {
  render(
    <AppProviders>
      <StoreProvider>
        <NavigationContainer>{children}</NavigationContainer>
      </StoreProvider>
    </AppProviders>,
  )
}

test.skip('Should render app informations screen', async () => {
  renderScreen(<AppInformationsScreen />)
  await act(() => {})
  expect(screen.getByTestId(buildTestId('app_informations_screen'))).toBeOnTheScreen()
  expect(screen.getByTestId(buildTestId('app_informations_title'))).toBeOnTheScreen()
  expect(screen.getByTestId(buildTestId('app_informations_version'))).toBeOnTheScreen()
})

test.skip('Should render menu item in settings page', async () => {
  renderScreen(
    <ViewProfileScreen
      onPressAppInformations={() => {}}
      onPressContact={() => {}}
      onPressDeleteAccount={() => {}}
      onPressLogin={() => {}}
      onPressLogout={() => {}}
      onPressDeveloperMenu={() => {}}
      onPressChangeLanguage={() => {}}
      onPressEditPreferences={() => {}}
      onPressUpdateProfile={() => {}}
    />,
  )
  expect(await screen.findByTestId(buildTestId('settings_screen'))).toBeOnTheScreen()
  expect(screen.getByTestId(buildTestId('settings_app_informations'))).toBeOnTheScreen()
})
