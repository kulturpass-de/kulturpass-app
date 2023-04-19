import React from 'react'
import { render, screen } from '@testing-library/react-native'
import { buildTestId } from '../../services/test-id/test-id'
import { I18nProvider } from '../../services/testing/test-utils'
import { Screen } from './screen'

test('Should render ScreenHeader', async () => {
  render(
    <I18nProvider>
      <Screen testID={buildTestId('screen_wrapper')} />
    </I18nProvider>,
  )
  expect(await screen.findByTestId(buildTestId('screen_wrapper_screen'))).toBeOnTheScreen()
})
