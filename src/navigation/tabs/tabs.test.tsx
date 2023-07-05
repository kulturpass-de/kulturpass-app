import { fireEvent, screen } from '@testing-library/react-native'
import React from 'react'
import { buildTestId } from '../../services/test-id/test-id'
import { renderScreen } from '../../services/testing/test-utils'
import { Tabs } from './tabs'

test('should navigate to settings -> change language -> home -> settings and land on the initial settings screen again', async () => {
  renderScreen(<Tabs />)

  fireEvent.press(await screen.findByTestId(buildTestId(`settings_bottomNavigation_label`)))

  // on view-profile-screen (initial settings screen)
  expect(screen.queryByTestId(buildTestId('settings_screen'))).toBeOnTheScreen()

  fireEvent.press(await screen.findByTestId(buildTestId('changeLanguage_title')))

  // should be on change language screen
  expect(screen.queryByTestId(buildTestId('changeLanguage_screen'))).toBeOnTheScreen()

  fireEvent.press(await screen.findByTestId(buildTestId(`home_bottomNavigation_label`)))

  // should be on home screen
  expect(screen.queryByTestId(buildTestId('home_screen'))).toBeOnTheScreen()

  fireEvent.press(await screen.findByTestId(buildTestId(`settings_bottomNavigation_label`)))

  // should not be on change language screen anymore
  expect(screen.queryByTestId(buildTestId('changeLanguage_screen'))).not.toBeOnTheScreen()

  // back on initial settings screen
  expect(screen.queryByTestId(buildTestId('settings_screen'))).toBeOnTheScreen()
})
