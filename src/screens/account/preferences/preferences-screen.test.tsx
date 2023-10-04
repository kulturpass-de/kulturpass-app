import { fireEvent, screen } from '@testing-library/react-native'
import React from 'react'
import { buildTestId } from '../../../services/test-id/test-id'
import { renderScreen } from '../../../services/testing/test-utils'
import { PreferencesScreen } from './preferences-screen'

const afterSubmitTriggered = jest.fn()
const onPressClose = jest.fn()

test('Should render preferences screen', async () => {
  renderScreen(<PreferencesScreen afterSubmitTriggered={afterSubmitTriggered} onPressClose={onPressClose} />)
  expect(screen.getByTestId(buildTestId('preferences_screen'))).toBeOnTheScreen()
})

test('Should display the close button only if the form has been manipulated', async () => {
  renderScreen(<PreferencesScreen afterSubmitTriggered={afterSubmitTriggered} onPressClose={onPressClose} />)

  expect(screen.queryByTestId(buildTestId('editPreferences_title_closeButton'))).not.toBeOnTheScreen()
  expect(screen.queryByTestId(buildTestId('editPreferences_title_backButton'))).toBeOnTheScreen()

  let postalCodeInput = await screen.findByTestId(buildTestId('preferences_form_postal_code_input'))

  // do change, close button should appear

  fireEvent.changeText(postalCodeInput, '1')

  expect(screen.queryByTestId(buildTestId('editPreferences_title_closeButton'))).toBeOnTheScreen()

  // revert change, close button should disappear

  fireEvent.changeText(postalCodeInput, '')

  expect(screen.queryByTestId(buildTestId('editPreferences_title_closeButton'))).not.toBeOnTheScreen()
})

test('Should not show the preferences alert since no changes were made', async () => {
  renderScreen(<PreferencesScreen afterSubmitTriggered={afterSubmitTriggered} onPressClose={onPressClose} />)

  fireEvent.press(screen.getByTestId(buildTestId('editPreferences_title_backButton')))

  expect(screen.queryByTestId(buildTestId('update_profile_alert_title'))).not.toBeOnTheScreen()
  expect(onPressClose).toHaveBeenCalledTimes(1)
})

test('Should show the preferences alert since changes were made and the back button pressed. User presses dismiss to stay on the preferences screen', async () => {
  renderScreen(<PreferencesScreen afterSubmitTriggered={afterSubmitTriggered} onPressClose={onPressClose} />)

  let postalCodeInput = await screen.findByTestId(buildTestId('preferences_form_postal_code_input'))

  fireEvent.changeText(postalCodeInput, '1')

  fireEvent.press(screen.getByTestId(buildTestId('editPreferences_title_backButton')))

  expect(screen.queryByTestId(buildTestId('update_profile_alert_title'))).toBeOnTheScreen()

  fireEvent.press(screen.getByTestId(buildTestId('update_profile_alert_dismiss')))

  expect(screen.queryByTestId(buildTestId('update_profile_alert_title'))).not.toBeOnTheScreen()
  expect(screen.getByTestId(buildTestId('preferences_screen'))).toBeOnTheScreen()
  expect(onPressClose).toHaveBeenCalledTimes(0)
})

test('Should show the preferences alert since changes were made and the back button pressed. User presses discard to leave on the preferences screen', async () => {
  renderScreen(<PreferencesScreen afterSubmitTriggered={afterSubmitTriggered} onPressClose={onPressClose} />)

  let postalCodeInput = await screen.findByTestId(buildTestId('preferences_form_postal_code_input'))

  fireEvent.changeText(postalCodeInput, '1')

  fireEvent.press(screen.getByTestId(buildTestId('editPreferences_title_backButton')))

  expect(screen.queryByTestId(buildTestId('update_profile_alert_title'))).toBeOnTheScreen()

  fireEvent.press(screen.getByTestId(buildTestId('update_profile_alert_discard')))

  expect(screen.queryByTestId(buildTestId('update_profile_alert_title'))).not.toBeOnTheScreen()
  expect(onPressClose).toHaveBeenCalledTimes(1)
})

test('Should not let the user leave the preferences screen, when the close button has been pressed, since preferences alert is displayed', async () => {
  renderScreen(<PreferencesScreen afterSubmitTriggered={afterSubmitTriggered} onPressClose={onPressClose} />)

  let postalCodeInput = await screen.findByTestId(buildTestId('preferences_form_postal_code_input'))

  fireEvent.changeText(postalCodeInput, '1')

  fireEvent.press(screen.getByTestId(buildTestId('editPreferences_title_closeButton')))

  // alert should not be shown, back navigation should happen

  expect(screen.queryByTestId(buildTestId('update_profile_alert_title'))).toBeOnTheScreen()

  fireEvent.press(screen.getByTestId(buildTestId('update_profile_alert_discard')))

  expect(screen.getByTestId(buildTestId('preferences_screen'))).toBeOnTheScreen()
  expect(onPressClose).toHaveBeenCalledTimes(1)
})

afterEach(() => {
  jest.clearAllMocks()
})
