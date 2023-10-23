import { screen } from '@testing-library/react-native'
import React from 'react'
import { buildTestId } from '../../services/test-id/test-id'
import { renderScreen } from '../../services/testing/test-utils'
import { Screen } from './screen'

test('Should render ScreenHeader', async () => {
  renderScreen(<Screen testID={buildTestId('screen_wrapper')} />)
  expect(await screen.findByTestId(buildTestId('screen_wrapper_screen'))).toBeOnTheScreen()
})
