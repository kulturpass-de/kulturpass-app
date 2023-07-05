import { screen } from '@testing-library/react-native'
import React from 'react'
import { buildTestId } from '../../services/test-id/test-id'
import { renderScreen } from './../../services/testing/test-utils'
import { ScreenHeader } from './screen-header'

test('Should render ScreenHeader', async () => {
  renderScreen(<ScreenHeader title="Hallo!" testID={buildTestId('screen_header')} />)
  expect(await screen.findByText('Hallo!')).toBeOnTheScreen()
  expect(await screen.findByTestId(buildTestId('screen_header'))).toBeOnTheScreen()
})
