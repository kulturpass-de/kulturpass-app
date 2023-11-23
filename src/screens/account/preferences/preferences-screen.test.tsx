import { fireEvent, screen, userEvent, waitFor } from '@testing-library/react-native'
import { http, HttpResponse } from 'msw'
import React from 'react'
import { buildTestId } from '../../../services/test-id/test-id'
import { renderScreen, setupServer, serverHandlersLoggedIn } from '../../../services/testing/test-utils'
import { PreferencesScreen } from './preferences-screen'

const afterSubmitTriggered = jest.fn()
const onPressClose = jest.fn()

describe('PreferencesScreen', () => {
  const server = setupServer(...serverHandlersLoggedIn)

  const mockServer = () => {
    server.use(
      http.get('*/categories/availablePreferences', () => {
        return HttpResponse.json({ categories: [{ id: 'culturalWorkshop', name: 'Workshops' }] }, { status: 200 })
      }),
    )
  }

  beforeAll(() => server.listen())
  afterEach(() => {
    jest.clearAllMocks()
    server.resetHandlers()
  })
  afterAll(() => server.close())

  test('Should render preferences screen', async () => {
    mockServer()
    renderScreen(<PreferencesScreen afterSubmitTriggered={afterSubmitTriggered} onPressClose={onPressClose} />)
    expect(await screen.findByTestId(buildTestId('preferences_screen'))).toBeOnTheScreen()
  })

  test('Should display the close button only if the form has been manipulated', async () => {
    mockServer()

    const user = userEvent.setup()

    renderScreen(<PreferencesScreen afterSubmitTriggered={afterSubmitTriggered} onPressClose={onPressClose} />)

    expect(await screen.findByTestId(buildTestId('preferences_screen'))).toBeOnTheScreen()

    expect(screen.queryByTestId(buildTestId('editPreferences_title_closeButton'))).not.toBeOnTheScreen()
    expect(screen.queryByTestId(buildTestId('editPreferences_title_backButton'))).toBeOnTheScreen()

    let postalCodeInput = await screen.findByTestId(buildTestId('preferences_form_postal_code_input'))

    // do change, close button should appear

    await user.type(postalCodeInput, '1')

    expect(screen.queryByTestId(buildTestId('editPreferences_title_closeButton'))).toBeOnTheScreen()

    // revert change, close button should disappear

    await user.clear(postalCodeInput)

    // waitForElementToBeRemoved could be an alternative here, but we use the `userEvent` api and await the input
    expect(screen.queryByTestId(buildTestId('editPreferences_title_closeButton'))).not.toBeOnTheScreen()
  })

  test('Should not show the preferences alert since no changes were made', async () => {
    mockServer()

    renderScreen(<PreferencesScreen afterSubmitTriggered={afterSubmitTriggered} onPressClose={onPressClose} />)

    fireEvent.press(screen.getByTestId(buildTestId('editPreferences_title_backButton')))

    expect(screen.queryByTestId(buildTestId('update_profile_alert_title'))).not.toBeOnTheScreen()

    await waitFor(() => expect(onPressClose).toHaveBeenCalledTimes(1))

    expect(afterSubmitTriggered).not.toHaveBeenCalled()
  })

  test('Should show the preferences alert since changes were made and the back button pressed. User presses dismiss to stay on the preferences screen', async () => {
    mockServer()

    const user = userEvent.setup()

    renderScreen(<PreferencesScreen afterSubmitTriggered={afterSubmitTriggered} onPressClose={onPressClose} />)

    expect(await screen.findByTestId(buildTestId('preferences_screen'))).toBeOnTheScreen()

    let postalCodeInput = await screen.findByTestId(buildTestId('preferences_form_postal_code_input'))

    await user.type(postalCodeInput, '1')

    fireEvent.press(screen.getByTestId(buildTestId('editPreferences_title_backButton')))

    expect(await screen.findByTestId(buildTestId('update_profile_alert_title'))).toBeOnTheScreen()

    fireEvent.press(screen.getByTestId(buildTestId('update_profile_alert_dismiss')))

    expect(await screen.findByTestId(buildTestId('preferences_screen'))).toBeOnTheScreen()

    expect(screen.queryByTestId(buildTestId('update_profile_alert_title'))).not.toBeOnTheScreen()

    expect(onPressClose).toHaveBeenCalledTimes(0)
  })

  test('Should show the preferences alert since changes were made and the back button pressed. User presses discard to leave on the preferences screen', async () => {
    mockServer()

    const user = userEvent.setup()

    renderScreen(<PreferencesScreen afterSubmitTriggered={afterSubmitTriggered} onPressClose={onPressClose} />)

    expect(await screen.findByTestId(buildTestId('preferences_screen'))).toBeOnTheScreen()

    let postalCodeInput = await screen.findByTestId(buildTestId('preferences_form_postal_code_input'))

    await user.type(postalCodeInput, '1')

    fireEvent.press(screen.getByTestId(buildTestId('editPreferences_title_backButton')))

    expect(await screen.findByTestId(buildTestId('update_profile_alert_title'))).toBeOnTheScreen()

    fireEvent.press(screen.getByTestId(buildTestId('update_profile_alert_discard')))

    expect(await screen.findByTestId(buildTestId('preferences_screen'))).toBeOnTheScreen()

    expect(screen.queryByTestId(buildTestId('update_profile_alert_title'))).not.toBeOnTheScreen()
    expect(onPressClose).toHaveBeenCalledTimes(1)
  })

  test('Should not let the user leave the preferences screen, when the close button has been pressed, since preferences alert is displayed', async () => {
    mockServer()

    const user = userEvent.setup()

    renderScreen(<PreferencesScreen afterSubmitTriggered={afterSubmitTriggered} onPressClose={onPressClose} />)

    expect(await screen.findByTestId(buildTestId('preferences_screen'))).toBeOnTheScreen()

    let postalCodeInput = await screen.findByTestId(buildTestId('preferences_form_postal_code_input'))

    await user.type(postalCodeInput, '1')

    fireEvent.press(screen.getByTestId(buildTestId('editPreferences_title_closeButton')))

    // alert should not be shown, back navigation should happen

    expect(await screen.findByTestId(buildTestId('update_profile_alert_title'))).toBeOnTheScreen()

    fireEvent.press(screen.getByTestId(buildTestId('update_profile_alert_discard')))

    expect(await screen.findByTestId(buildTestId('preferences_screen'))).toBeOnTheScreen()

    expect(onPressClose).toHaveBeenCalledTimes(1)
  })
})
