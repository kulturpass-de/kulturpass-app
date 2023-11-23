import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { fireEvent, render, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react-native'
import { HttpResponse, http } from 'msw'
import { setupServer } from 'msw/node'
import React from 'react'
import { ErrorAlertProvider } from '../../services/errors/error-alert-provider'
import { buildTestId } from '../../services/test-id/test-id'
import { AppProviders, StoreProvider } from '../../services/testing/test-utils'
import t from '../../services/translation/i18n/de.json'
import { LogInRoute } from './log-in-route'

const renderScreen = () => {
  const Stack = createStackNavigator()

  render(
    <AppProviders>
      <StoreProvider>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="Register" component={LogInRoute} />
          </Stack.Navigator>
          <ErrorAlertProvider />
        </NavigationContainer>
      </StoreProvider>
    </AppProviders>,
  )
}

const emailInput = buildTestId('login_form_email')
const passwordInput = buildTestId('login_form_password')
const formSubmitBtn = buildTestId('login_button')

describe('LoginRoute', () => {
  const server = setupServer()

  beforeAll(() => server.listen())
  afterEach(() => server.resetHandlers())
  afterAll(() => server.close())

  test('Should display error about invalid user/password', async () => {
    renderScreen()

    server.use(
      http.post('http://localhost/cdc/accounts.login', () =>
        HttpResponse.json(
          {
            callId: '56e915319f4846df9b74683a489cd720',
            errorCode: 403042,
            errorDetails: 'invalid loginID or password',
            errorMessage: 'Invalid LoginID',
            apiVersion: 2,
            statusCode: 403,
            statusReason: 'Forbidden',
            time: '2023-02-21T06:16:44.915Z',
          },
          { status: 200 },
        ),
      ),
    )

    expect(await screen.findByTestId(formSubmitBtn)).toBeOnTheScreen()

    fireEvent.changeText(screen.getByTestId(`${emailInput}_input`), 'cp@example.org')
    fireEvent.changeText(screen.getByTestId(`${passwordInput}_input`), 'S3cr3t')

    await waitFor(() => expect(screen.getByTestId(formSubmitBtn)).toBeEnabled())
    fireEvent.press(screen.getByTestId(formSubmitBtn))

    expect(await screen.findByText(t.cdc_invalid_loginid_title)).toBeOnTheScreen()
    expect(await screen.findByText(t.cdc_invalid_loginid_message)).toBeOnTheScreen()
    expect(screen.getByTestId(buildTestId('error_alert_cta'))).toBeOnTheScreen()
    await Promise.all([
      waitForElementToBeRemoved(() => screen.getByTestId(buildTestId('error_alert_cta'))),
      fireEvent.press(screen.getByTestId(buildTestId('error_alert_cta'))),
    ])
    expect(screen.queryByTestId(buildTestId('error_alert_cta'))).not.toBeOnTheScreen()
  })
})
