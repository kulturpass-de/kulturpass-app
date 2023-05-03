import React from 'react'
import { render, screen } from '@testing-library/react-native'
import { buildTestId } from '../../services/test-id/test-id'
import { ScreenHeader } from './screen-header'

test('Should render ScreenHeader', async () => {
  render(<ScreenHeader title="Hallo!" testID={buildTestId('screen_header')} />)
  expect(await screen.findByText('Hallo!')).toBeOnTheScreen()
  expect(await screen.findByTestId(buildTestId('screen_header'))).toBeOnTheScreen()
})
