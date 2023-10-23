import { screen } from '@testing-library/react-native'
import React from 'react'
import { buildTestId } from '../../services/test-id/test-id'
import { renderScreen } from '../../services/testing/test-utils'
import { CopyToClipboard } from './copy-to-clipboard'

test('Should render CopyToClipboard', async () => {
  const onPress = jest.fn()
  renderScreen(
    <CopyToClipboard
      baseTestId={buildTestId('copy_to_clipboard_wrapper')}
      accessibilityLabelI18nKey="productDetail_offer_copyToClipboard"
      copiedAccessibilityI18nKey="productDetail_offer_copiedToClipboard"
      onPress={onPress}
    />,
  )
  expect(await screen.findByTestId(buildTestId('copy_to_clipboard_wrapper_copyToClipboard'))).toBeOnTheScreen()
})
