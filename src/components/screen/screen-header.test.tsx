import React from 'react'
import { screen } from '@testing-library/react-native'
import { buildTestId } from '../../services/test-id/test-id'
import { ScreenHeader } from './screen-header'
import { renderScreen } from './../../services/testing/test-utils'

test('Should render ScreenHeader', async () => {
  renderScreen(<ScreenHeader title="Hallo!" testID={buildTestId('screen_header')} />)
  expect(await screen.findByText('Hallo!')).toBeOnTheScreen()
  expect(await screen.findByTestId(buildTestId('screen_header'))).toBeOnTheScreen()
})
