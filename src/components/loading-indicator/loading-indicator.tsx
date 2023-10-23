import React from 'react'
import { Modal } from 'react-native'
import { LoadingIndicatorOverlay } from './loading-indicator-overlay'
import { useDebouncedLoading } from './use-debounced-loading'

export type LoadingIndicatorProps = {
  loading: boolean
  // Debounce time in ms, set to undefined to disable debounce
  debounceTime?: number
}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ loading, debounceTime = 150 }) => {
  const debouncedLoading = useDebouncedLoading(loading, debounceTime)

  return (
    <Modal animationType="none" presentationStyle="overFullScreen" transparent={true} visible={debouncedLoading}>
      <LoadingIndicatorOverlay />
    </Modal>
  )
}
