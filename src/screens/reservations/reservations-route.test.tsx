import { act, screen, waitFor } from '@testing-library/react-native'
import React from 'react'
import { buildTestId } from '../../services/test-id/test-id'
import { renderScreen } from '../../services/testing/test-utils'
import { ReservationsScreen } from './reservations-screen'
import { ReservationsUnauthorizedScreen } from './reservations-unauthorized-screen'

jest.useFakeTimers()

const onSignInRequested = jest.fn()
const onReservationPressed = jest.fn()

const render = (isLoggedIn: Boolean) => {
  return renderScreen(
    isLoggedIn ? (
      <ReservationsScreen onReservationPressed={onReservationPressed} />
    ) : (
      <ReservationsUnauthorizedScreen onSignInRequested={onSignInRequested} />
    ),
  )
}

describe('ReservationsRoute', () => {
  test('Should render Reservation Screen', async () => {
    render(true)
    await act(
      async () => await waitFor(() => expect(screen.getByTestId(buildTestId('reservations_screen'))).toBeOnTheScreen()),
    )
  })
})

describe('ReservationsUnauthorizedScreen', () => {
  test('Should render Reservations Unauthorized Screen', async () => {
    render(false)
    await waitFor(() => expect(screen.getByTestId(buildTestId('reservations_unauthorized_screen'))).toBeOnTheScreen())
  })
})
