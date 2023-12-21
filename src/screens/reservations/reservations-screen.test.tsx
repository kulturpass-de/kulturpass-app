import { act, screen, waitFor } from '@testing-library/react-native'
import React from 'react'
import { buildTestId } from '../../services/test-id/test-id'
import { renderScreen } from '../../services/testing/test-utils'
import { ReservationsScreen } from './reservations-screen'

const onReservationPressed = jest.fn()

describe('ReservationsRoute', () => {
  test('Should render Reservation Screen', async () => {
    renderScreen(<ReservationsScreen onReservationPressed={onReservationPressed} />)
    await act(
      async () => await waitFor(() => expect(screen.getByTestId(buildTestId('reservations_screen'))).toBeOnTheScreen()),
    )
  })
})
