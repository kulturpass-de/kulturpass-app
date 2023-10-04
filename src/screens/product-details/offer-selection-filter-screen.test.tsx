import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { fireEvent, render, screen, userEvent, waitFor } from '@testing-library/react-native'
import { rest } from 'msw'
import React from 'react'
import { buildTestId } from '../../services/test-id/test-id'
import {
  serverHandlersLoggedIn,
  AppProviders,
  StoreProvider,
  renderScreen,
  setupServer,
} from '../../services/testing/test-utils'
import { OfferSelectionFilterRoute } from './offer-selection-filter-route'
import { OfferSelectionFilterScreen } from './offer-selection-filter-screen'

export const server = setupServer(...serverHandlersLoggedIn)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

const renderRoute = (props: Record<string, unknown> = {}) => {
  const Stack = createStackNavigator()
  render(
    <AppProviders>
      <StoreProvider withLoginSession>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="OfferSelectionRoute"
              component={OfferSelectionFilterRoute as any}
              initialParams={props}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </StoreProvider>
    </AppProviders>,
  )
}

const onPressClose = jest.fn()

const RESPONSE_EMPTY = { results: [] }

const RESPONSE_HAM = {
  results: Array.from({ length: 25 }).map((_, i) => ({
    id: `item_${i}`,
    name: `Hamburg ${i}`,
    latitude: 32 + i,
    longitude: 31 + i,
  })),
}

const mockSuggestionsResponse = (responseData: typeof RESPONSE_HAM | typeof RESPONSE_EMPTY) => {
  server.use(
    rest.get('*/cc/kulturapp/location/suggestions', (_req, res, ctx) => {
      return res(ctx.status(200), ctx.json(responseData))
    }),
  )
}

const noOp = () => {}

const getIsValidPostalCode = () => true

test('Should render offer selection filter screen for "location" and handle the user-prefers-default-location callback', async () => {
  const onSubmitLocation = jest.fn()

  renderScreen(
    <OfferSelectionFilterScreen
      onClose={onPressClose}
      defaultLocationProvider={{ provider: 'location' }}
      fetchLocationSuggestions={noOp as any}
      getIsValidPostalCode={noOp as any}
      onBack={noOp as any}
      onSubmitLocation={onSubmitLocation}
      onSubmitPostalCode={noOp as any}
    />,
  )

  expect(screen.getByTestId(buildTestId('offerSelectionFilter_screen'))).toBeOnTheScreen()

  fireEvent.press(screen.getByTestId(buildTestId('offerSelectionFilter_submit_button')))

  expect(onSubmitLocation).toHaveBeenCalledTimes(1)
})

test('Should render offer selection filter screen for "postalCode" with 65555 as default. Change to 99990 is possible', async () => {
  const onSubmitLocation = jest.fn()

  renderScreen(
    <OfferSelectionFilterScreen
      onClose={onPressClose}
      defaultLocationProvider={{ provider: 'postalCode', postalCode: '65555' }}
      fetchLocationSuggestions={noOp as any}
      getIsValidPostalCode={getIsValidPostalCode as any}
      onBack={noOp as any}
      onSubmitLocation={noOp as any}
      onSubmitPostalCode={onSubmitLocation}
    />,
  )

  expect(screen.getByTestId(buildTestId('offerSelectionFilter_screen'))).toBeOnTheScreen()

  expect(screen.getByDisplayValue('65555')).toBeOnTheScreen()

  fireEvent.changeText(screen.getByTestId(buildTestId('offerSelectionFilter_postalCodeOrCity_input')), '99990')

  expect(screen.getByDisplayValue('99990')).toBeOnTheScreen()
})

test('Should render offer selection filter route for "city=hamburg" and an empty response, with the empty list item being displayed', async () => {
  // support focus event
  // see https://callstack.github.io/react-native-testing-library/docs/user-event
  const user = userEvent.setup()

  mockSuggestionsResponse(RESPONSE_EMPTY)

  renderRoute({
    offersByLocation: {
      provider: 'city',
      location: { coordinates: [1, 5], id: 'hamburg001', name: 'Hamburg' },
    },
  })

  expect(screen.getByTestId(buildTestId('offerSelectionFilter_screen'))).toBeOnTheScreen()

  const inputElement = screen.getByTestId(buildTestId('offerSelectionFilter_postalCodeOrCity_input'))
  expect(inputElement.props?.value).toEqual('Hamburg')

  await user.clear(inputElement)
  await user.type(inputElement, 'Search with empty result')

  await waitFor(() =>
    expect(screen.getByTestId(buildTestId('offerSelectionFilter_suggestions_item_empty'))).toBeOnTheScreen(),
  )
})

test('Should render offer selection filter route for "city=hamburg" and the clear input button clears the field, even after toggling back and forth to the location view', async () => {
  renderRoute({
    offersByLocation: {
      provider: 'city',
      location: { coordinates: [1, 5], id: 'hamburg001', name: 'Hamburg' },
    },
  })

  expect(screen.getByTestId(buildTestId('offerSelectionFilter_screen'))).toBeOnTheScreen()

  let inputElement = screen.getByTestId(buildTestId('offerSelectionFilter_postalCodeOrCity_input'))

  await waitFor(() => expect(inputElement.props?.value).toEqual('Hamburg'))

  fireEvent.press(screen.getByTestId(buildTestId('offerSelectionFilter_postalCodeOrCity_clearSearchTextButton')))

  await waitFor(() => expect(inputElement.props?.value).toEqual(''))

  // switch to location view and back, input element should still be empty

  fireEvent.press(screen.getByTestId(buildTestId('offerSelectionFilter_location_chip')))

  fireEvent.press(screen.getByTestId(buildTestId('offerSelectionFilter_postalCodeOrCity_chip')))

  inputElement = screen.getByTestId(buildTestId('offerSelectionFilter_postalCodeOrCity_input'))

  expect(inputElement.props?.value).toEqual('')
})

test('Should render offer selection filter route for with non empty list', async () => {
  const user = userEvent.setup()

  mockSuggestionsResponse(RESPONSE_HAM)

  renderRoute()

  fireEvent.press(screen.getByTestId(buildTestId('offerSelectionFilter_postalCodeOrCity_chip')))

  let inputElement = screen.getByTestId(buildTestId('offerSelectionFilter_postalCodeOrCity_input'))

  await user.type(inputElement, 'Ha')

  await waitFor(() => expect(screen.getByTestId(buildTestId('offerSelectionFilter_submit_button'))).toBeDisabled())

  await user.type(inputElement, 'm')

  // select third element of the list
  const listItems = screen.getAllByTestId(buildTestId('offerSelectionFilter_suggestions_item'))
  expect(listItems[2]).toBeVisible()

  fireEvent.press(listItems[2])

  expect(inputElement.props?.value).toEqual('Hamburg 2')

  // switch to location view and back, input element should still be filled

  fireEvent.press(screen.getByTestId(buildTestId('offerSelectionFilter_location_chip')))

  fireEvent.press(screen.getByTestId(buildTestId('offerSelectionFilter_postalCodeOrCity_chip')))

  inputElement = screen.getByTestId(buildTestId('offerSelectionFilter_postalCodeOrCity_input'))

  expect(inputElement.props?.value).toEqual('Hamburg 2')
})

test('Should render offer selection filter route and close the suggestions list when toggling back and forth to the location view', async () => {
  const user = userEvent.setup()

  mockSuggestionsResponse(RESPONSE_HAM)

  renderRoute()

  fireEvent.press(screen.getByTestId(buildTestId('offerSelectionFilter_postalCodeOrCity_chip')))

  const inputElement = screen.getByTestId(buildTestId('offerSelectionFilter_postalCodeOrCity_input'))

  // focus (and type in) the input field

  await user.type(inputElement, 'Ham')

  // make sure suggestions are visible

  await waitFor(() =>
    expect(screen.getByTestId(buildTestId('offerSelectionFilter_suggestions_list'))).toBeOnTheScreen(),
  )

  // switch to location view and back, input element should still be filled

  fireEvent.press(screen.getByTestId(buildTestId('offerSelectionFilter_location_chip')))

  fireEvent.press(screen.getByTestId(buildTestId('offerSelectionFilter_postalCodeOrCity_chip')))

  // suggestions should not be visible, so submit button is visible

  await waitFor(() => expect(screen.getByTestId(buildTestId('offerSelectionFilter_submit_button'))).toBeOnTheScreen())
})
