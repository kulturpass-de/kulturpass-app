import React from 'react'
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { spacing } from '../../theme/spacing'

export type ModalScreenFooterPaddingProps = {
  fallbackPadding?: number
}

export const ModalScreenFooterPadding: React.FC<ModalScreenFooterPaddingProps> = ({ fallbackPadding = spacing[5] }) => {
  const { bottom } = useSafeAreaInsets()

  return bottom === 0 ? <View style={{ height: fallbackPadding }} /> : null
}
