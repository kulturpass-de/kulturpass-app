import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { render, screen, within } from '@testing-library/react-native'
import { rest } from 'msw'
import React from 'react'
import { GetProfileResponseBody } from '../../services/api/types/commerce/commerce-get-profile'
import { buildTestId } from '../../services/test-id/test-id'
import { AppProviders, serverHandlersLoggedIn, setupServer, StoreProvider } from '../../services/testing/test-utils'
import { HomeScreen } from './home-screen'

export const server = setupServer(...serverHandlersLoggedIn)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

const renderScreen = () => {
  const Stack = createStackNavigator()
  render(
    <AppProviders>
      <StoreProvider withLoginSession>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="Home" component={HomeScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </StoreProvider>
    </AppProviders>,
  )
}

test('Should render home screen with hint to identify', async () => {
  server.use(
    rest.get('*/cc/kulturapp/users/current', (_req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          firstName: 'Max',
          identificationStatus: 'NOT_VERIFIED',
          balanceStatus: 'NOT_ENTITLED',
          balance: {
            availableBalance: { value: 0, currencyIso: 'EUR' },
            grantedBalance: { value: 0, currencyIso: 'EUR' },
            reservedBalance: { value: 0, currencyIso: 'EUR' },
          },
        } satisfies GetProfileResponseBody),
      )
    }),
  )

  renderScreen()
  expect(await screen.findByTestId(buildTestId('screens_home_webview'))).toBeOnTheScreen()
  expect(await screen.findByTestId(buildTestId('eid_startVerify_button_title'))).toBeOnTheScreen()
})

test('Should render home screen with budget', async () => {
  server.use(
    rest.get('*/cc/kulturapp/users/current', (_req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          firstName: 'Max',
          identificationStatus: 'VERIFIED',
          balanceStatus: 'ENTITLED',
          balance: {
            availableBalance: { value: 100.0, currencyIso: 'EUR' },
            grantedBalance: { value: 200.0, currencyIso: 'EUR' },
            reservedBalance: { value: 42.5, currencyIso: 'EUR' },
          },
        } satisfies GetProfileResponseBody),
      )
    }),
  )

  renderScreen()
  expect(await screen.findByTestId(buildTestId('screens_home_webview'))).toBeOnTheScreen()
  expect(await screen.findByTestId(buildTestId('home_budget_greeting_text'))).toBeOnTheScreen()

  const amountText = screen.getByTestId(buildTestId('home_budget_amount_text'))
  expect(amountText).toBeOnTheScreen()
  expect(within(amountText).getByText('100,00 €', { exact: false })).toBeOnTheScreen()

  const reservedText = screen.getByTestId(buildTestId('home_budget_amount_reserved_text'))
  expect(reservedText).toBeOnTheScreen()
  expect(within(reservedText).getByText('42,50 €', { exact: false })).toBeOnTheScreen()
})

test('Should render home screen with hint of identified as duplicate', async () => {
  server.use(
    rest.get('*/cc/kulturapp/users/current', (_req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          firstName: 'Max',
          identificationStatus: 'DUPLICATE',
          balanceStatus: 'NOT_ENTITLED',
          balance: {
            availableBalance: { value: 0, currencyIso: 'EUR' },
            grantedBalance: { value: 0, currencyIso: 'EUR' },
            reservedBalance: { value: 0, currencyIso: 'EUR' },
          },
        } satisfies GetProfileResponseBody),
      )
    }),
  )

  renderScreen()
  expect(await screen.findByTestId(buildTestId('screens_home_webview'))).toBeOnTheScreen()
  expect(await screen.findByTestId(buildTestId('verification_duplicate_title'))).toBeOnTheScreen()
})

test('Should render home screen with hint of not yet entitled', async () => {
  server.use(
    rest.get('*/cc/kulturapp/users/current', (_req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          firstName: 'Max',
          identificationStatus: 'VERIFIED',
          balanceStatus: 'NOT_YET_ENTITLED',
          balance: {
            availableBalance: { value: 0, currencyIso: 'EUR' },
            grantedBalance: { value: 0, currencyIso: 'EUR' },
            reservedBalance: { value: 0, currencyIso: 'EUR' },
          },
        } satisfies GetProfileResponseBody),
      )
    }),
  )

  renderScreen()
  expect(await screen.findByTestId(buildTestId('screens_home_webview'))).toBeOnTheScreen()
  expect(await screen.findByTestId(buildTestId('not_yet_entitled_title'))).toBeOnTheScreen()
})
