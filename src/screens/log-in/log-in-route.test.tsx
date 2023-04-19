import React from 'react'
import { fireEvent, render, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react-native'
import { rest } from 'msw'
import { setupServer } from 'msw/node'

import { buildTestId } from '../../services/test-id/test-id'
import { LogInRoute } from './log-in-route'
import t from '../../services/translation/i18n/de.json'
import { NavigationContainer } from '@react-navigation/native'
import { AppProviders, I18nProvider, StoreProvider } from '../../services/testing/test-utils'
import { setupStore } from '../../services/redux/configure-store'
import { createStackNavigator } from '@react-navigation/stack'
import { setEnvironmentConfiguration } from '../../services/environment-configuration/redux/environment-configuration-slice'

const renderScreen = () => {
  const reduxStore = setupStore({})
  const Stack = createStackNavigator()

  reduxStore.store.dispatch(setEnvironmentConfiguration('test'))

  render(
    <AppProviders>
      <StoreProvider reduxStore={reduxStore}>
        <I18nProvider>
          <NavigationContainer>
            <Stack.Navigator>
              <Stack.Screen name="Register" component={LogInRoute} />
            </Stack.Navigator>
          </NavigationContainer>
        </I18nProvider>
      </StoreProvider>
    </AppProviders>,
  )
}

export const server = setupServer()

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

const emailInput = buildTestId('login_form_email')
const passwordInput = buildTestId('login_form_password')
const formSubmitBtn = buildTestId('login_button')

test('Should display error about invalid user/password', async () => {
  renderScreen()

  server.use(
    rest.post('http://localhost/cdc/accounts.login', (_req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          callId: '56e915319f4846df9b74683a489cd720',
          errorCode: 403042,
          errorDetails: 'invalid loginID or password',
          errorMessage: 'Invalid LoginID',
          apiVersion: 2,
          statusCode: 403,
          statusReason: 'Forbidden',
          time: '2023-02-21T06:16:44.915Z',
        }),
      )
    }),
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
