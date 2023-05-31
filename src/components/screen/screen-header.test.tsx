import React from 'react'
import { screen } from '@testing-library/react-native'
import { act } from 'react-test-renderer'
import { buildTestId } from '../../services/test-id/test-id'
import { ScreenHeader } from './screen-header'
import { renderScreen } from './../../services/testing/test-utils'

test('Should render ScreenHeader', async () => {
  renderScreen(<ScreenHeader title="Hallo!" testID={buildTestId('screen_header')} />)
  await act(() => {})
  expect(await screen.findByText('Hallo!')).toBeOnTheScreen()
  expect(await screen.findByTestId(buildTestId('screen_header'))).toBeOnTheScreen()
})
