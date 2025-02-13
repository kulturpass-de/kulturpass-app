/*  eslint-disable react/jsx-no-bind */
import { NavigationContainer } from '@react-navigation/native'
import { render, screen } from '@testing-library/react-native'
import React from 'react'
import { buildTestId } from '../../services/test-id/test-id'
import { AppProviders, StoreProvider } from '../../services/testing/test-utils'
import { ViewProfileScreen } from '../account/profile/view-profile-screen'
import { AppInformationsScreen } from './app-informations-screen'

const renderScreen = (children: React.ReactNode) => {
  render(
    <AppProviders>
      <StoreProvider>
        <NavigationContainer>{children}</NavigationContainer>
      </StoreProvider>
    </AppProviders>,
  )
}

test('Should render app informations screen', async () => {
  renderScreen(<AppInformationsScreen />)
  expect(screen.getByTestId(buildTestId('app_informations_screen'))).toBeOnTheScreen()
  expect(screen.getByTestId(buildTestId('app_informations_title'))).toBeOnTheScreen()
  expect(screen.getByTestId(buildTestId('app_informations_version'))).toBeOnTheScreen()
})

test('Should render menu item in settings page', async () => {
  renderScreen(
    <ViewProfileScreen
      onPressAppInformations={() => {}}
      onPressContact={() => {}}
      onPressDeleteAccount={() => {}}
      onPressLogin={() => {}}
      onPressDeveloperMenu={() => {}}
      onPressChangeLanguage={() => {}}
      onPressEditPreferences={() => {}}
      onPressUpdateProfile={() => {}}
      onPressBudgetBooster={() => {}}
      onPressMobilityOffers={() => {}}
    />,
  )
  expect(await screen.findByTestId(buildTestId('settings_screen'))).toBeOnTheScreen()
  expect(screen.getByTestId(buildTestId('settings_app_informations'))).toBeOnTheScreen()
})
