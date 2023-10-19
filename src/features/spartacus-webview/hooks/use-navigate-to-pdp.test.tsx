import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { renderHook } from '@testing-library/react-native'
import React from 'react'
import { parseBaseUrl64Location } from '../utils'
import { useNavigateToPDP } from './use-navigate-to-pdp'

test('Should not handle non-product links', () => {
  const wrapper: React.FC<React.PropsWithChildren> = ({ children }) => {
    return <NavigationContainer>{children}</NavigationContainer>
  }

  const { result } = renderHook(
    () =>
      useNavigateToPDP()({
        url: '/',
      }),
    { wrapper },
  )

  expect(result.current).toBeUndefined()
})

const mockedNavigateFn = jest.fn(x => x)

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: mockedNavigateFn,
  }),
}))

describe('Should handle product links', () => {
  const Stack = createStackNavigator()

  const wrapper: React.FC<React.PropsWithChildren> = ({ children }) => {
    const Screen = () => {
      return <>{children}</>
    }
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Root">
          {/* eslint-disable react/jsx-no-bind */}
          <Stack.Screen name="Root" component={Screen} />
          <Stack.Screen name="PDP" component={Screen} />
          {/* eslint-enable */}
        </Stack.Navigator>
      </NavigationContainer>
    )
  }

  test('only product code', () => {
    const { result } = renderHook(
      () =>
        useNavigateToPDP()({
          url: '/product/ExhibitProduct-534459658866',
        }),
      { wrapper },
    )

    expect(result.current).toBeTruthy()
    expect(mockedNavigateFn).toHaveBeenCalledWith('PDP', {
      screen: 'ProductDetail',
      params: {
        productCode: 'ExhibitProduct-534459658866',
        randomMode: false,
      },
    })
  })

  test('use postalCode', () => {
    const { result } = renderHook(
      () =>
        useNavigateToPDP()({
          url: '/product/ExhibitProduct-534459658866?postalCode=10117',
        }),
      { wrapper },
    )

    expect(result.current).toBeTruthy()
    expect(mockedNavigateFn).toHaveBeenCalledWith('PDP', {
      screen: 'ProductDetail',
      params: {
        productCode: 'ExhibitProduct-534459658866',
        randomMode: false,
        offersByLocation: {
          postalCode: '10117',
          provider: 'postalCode',
        },
      },
    })
  })

  test('invalid postalCode should not be used', () => {
    const { result } = renderHook(
      () =>
        useNavigateToPDP()({
          url: '/product/ExhibitProduct-534459658866?postalCode=1021324',
        }),
      { wrapper },
    )

    expect(result.current).toBeTruthy()
    expect(mockedNavigateFn).toHaveBeenCalledWith('PDP', {
      screen: 'ProductDetail',
      params: {
        productCode: 'ExhibitProduct-534459658866',
        randomMode: false,
      },
    })
  })
})

describe('location base64url query param', () => {
  test('should parse to "Hamburg"', () => {
    const urlStr = `https://commerce.qa.kulturpass.de/occ/v2/kulturapp/products/geospatial/CinemaProduct-603012674602?lang=de&location=eyJpZCI6ICIyOTExMjk4IiwgImxhdGl0dWRlIjogNTMuNTUwNzMsICJsb25naXR1ZGUiOiA5Ljk5MzAyLCAibmFtZSI6ICJIYW1idXJnIn0`
    const url = new URL(urlStr)
    const locationQueryParam = url.searchParams.get('location')
    const value = parseBaseUrl64Location(locationQueryParam!)
    expect(value).toEqual({
      id: '2911298',
      latitude: 53.55073,
      longitude: 9.99302,
      name: 'Hamburg',
    })
  })

  test('should parse to "Köln"', () => {
    const urlStr = `https://commerce.qa.kulturpass.de/occ/v2/kulturapp/product/StagedEventProduct-467914640428/details?location=eyJpZCI6ICIyODg2MjQyIiwgImxhdGl0dWRlIjogNTAuOTMzMzMsICJsb25naXR1ZGUiOiA2Ljk1LCAibmFtZSI6ICJLw7ZsbiJ9`
    const url = new URL(urlStr)
    const locationQueryParam = url.searchParams.get('location')
    const value = parseBaseUrl64Location(locationQueryParam!)
    expect(value).toEqual({
      id: '2886242',
      latitude: 50.93333,
      longitude: 6.95,
      name: 'Köln',
    })
  })
})
