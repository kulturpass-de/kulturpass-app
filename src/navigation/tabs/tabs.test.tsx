import { createStackNavigator, TransitionPresets } from '@react-navigation/stack'
import { cleanup, fireEvent, screen } from '@testing-library/react-native'
import React from 'react'
import { View } from 'react-native'
import { buildTestId } from '../../services/test-id/test-id'
import { renderScreen } from '../../services/testing/test-utils'
import { ModalStackCardOverlay } from '../modal/modal-stack-card-overlay'
import { Tabs } from './tabs'

jest.useFakeTimers()

jest.mock('../../features/release-notes/hooks/use-display-release-notes', () => ({
  useDisplayReleaseNotes: jest.fn(() => ({})),
}))

const Test = () => {
  return <View accessible={false} style={{ width: 0, height: 0 }} />
}

const renderTabs = () => {
  const Stack = createStackNavigator()

  renderScreen(
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Tabs">
      <Stack.Screen name="Tabs" component={Tabs} />
      <Stack.Screen
        name="Modals"
        component={Test}
        options={{
          headerShown: false,
          presentation: 'transparentModal',
          cardOverlay: ModalStackCardOverlay,
          cardOverlayEnabled: true,
          ...TransitionPresets.ModalSlideFromBottomIOS,
        }}
      />
    </Stack.Navigator>,
  )
}

describe('Tabs', () => {
  afterEach(cleanup)

  test('should navigate to settings -> change language -> home -> settings and land on the initial settings screen again', async () => {
    renderTabs()

    fireEvent.press(screen.getByTestId(buildTestId('settings_bottomNavigation_button')))

    // on view-profile-screen (initial settings screen)
    expect(await screen.findByTestId(buildTestId('settings_screen'))).toBeOnTheScreen()

    fireEvent.press(screen.getByTestId(buildTestId('changeLanguage_title')))

    // should be on change language screen
    expect(await screen.findByTestId(buildTestId('changeLanguage_screen'))).toBeOnTheScreen()

    fireEvent.press(screen.getByTestId(buildTestId(`home_bottomNavigation_label`)))

    // should be on home screen
    expect(await screen.findByTestId(buildTestId('home_screen'))).toBeOnTheScreen()

    fireEvent.press(screen.getByTestId(buildTestId(`settings_bottomNavigation_label`)))

    // should not be on change language screen anymore
    expect(screen.queryByTestId(buildTestId('changeLanguage_screen'))).not.toBeOnTheScreen()

    // back on initial settings screen
    expect(await screen.findByTestId(buildTestId('settings_screen'))).toBeOnTheScreen()
  })
})
