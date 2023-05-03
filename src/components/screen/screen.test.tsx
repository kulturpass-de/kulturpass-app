import React from 'react'
import { render, screen } from '@testing-library/react-native'
import { buildTestId } from '../../services/test-id/test-id'
import { Screen } from './screen'

test('Should render ScreenHeader', async () => {
  render(<Screen testID={buildTestId('screen_wrapper')} />)
  expect(await screen.findByTestId(buildTestId('screen_wrapper_screen'))).toBeOnTheScreen()
})
